var express = require('express');
var http = require('http')
var auth = require('./backend/auth/roblox')
var openCloudApi = require('./backend/apis/openCloud')
var cookieParser = require('cookie-parser')
var tokenEncoding = require('./backend/auth/encryptTokens')

var app = express();
var server = http.createServer(app);

app.use(express.json())
app.use(cookieParser())

app.get('/editor/index.js', function(req, res) {
    return res.sendFile(__dirname + '/dist/editor.js')
})

app.get('/editor', function(req, res) {
    return res.sendFile(__dirname + '/main.html')
})

app.get('/flow/continue/', function(req, res) {
    var data = auth.fetchAuthURL()
    res.cookie('state', data.cookie)
    return res.redirect(
        data.auth
    )
})

app.get('/flow/redirect', async function(req, res) {
    if (req.query.code != undefined && req.cookies.state != undefined) {
        console.log(req.cookies)
        var data = await auth.handleResponse(req.query.code, req.cookies.state)
        if (data != undefined) {
            res.cookie('state', data)
            return res.redirect('/flow')
        }
    }
})

app.get('/api/retrieve-info', async function(req, res) {
    if (req.cookies.state != undefined) {
        var state = await auth.checkRefreshToken(req.cookies.state)
        req.cookies.state = state
        res.cookie('state', state)
        var stateDecoded = tokenEncoding.read(Buffer.from(state, 'base64url'), ["access_token", "refresh_token", "expires_in"])
        return res.status(200).json(
            await openCloudApi.retrieveUserInfo(stateDecoded)
        )
    }
})


app.get('/editor/index.js', function(req, res) {
    return res.sendFile(__dirname + '/dist/editor.js')
})

app.get('/flow/index.js', function(req, res) {
    return res.sendFile(__dirname + '/dist/flow.js')
})

app.get('/flow', function(req, res) {
    return res.sendFile(__dirname + '/flow.html')
})

server.listen(3000)