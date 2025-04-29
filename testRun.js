var auth = require('./backend/auth/roblox')
var openCloudApi = require('./backend/apis/openCloud')
var { RBXModelParser } = require('./parser/modelParser')
var tokenEncoding = require('./backend/auth/encryptTokens')
const { executablePath } = require('puppeteer-core')
const open = require('open');

var stateDat = undefined
var fs = require('fs')

async function run() {
    var state = await auth.checkRefreshToken(stateDat)
    var stateDecoded = tokenEncoding.read(Buffer.from(state, 'base64url'), ["access_token", "refresh_token", "expires_in"])
    var experiences = await auth.listUserExperiences(stateDecoded)
    console.log(experiences)
    console.log('downloading...')
    var downloaded = await openCloudApi.downloadPlace(stateDecoded, experiences[0].rootPlaceId)
    fs.writeFileSync('./exampleFile', downloaded.toString('base64'))
    console.log('done')
    if (stateDat != state) {
        console.log('new state')
        console.log(state)
    }
}

if (stateDat == undefined) {
    var express = require('express')
    var app = express()
    app.get('/flow/redirect', async function(req, res) {
        if (req.query.code != undefined) {
            var data = await auth.handleResponse(req.query.code, stateDat)
            if (data != undefined) {
                stateDat = data
                res.status(200).send("Success!")
                run()
            }
        }
    })
    var data = auth.fetchAuthURL()
    stateDat = data.cookie
    console.log(data.auth)
    open.default(data.auth)
    
    app.listen(3000)
    
}