function base64URLEncode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
  
var tokenEncoding = require('./encryptTokens')
var crypto = require('crypto')
var fetch = require('node-fetch-commonjs')

var scopes = [
    'openid',
    'profile',
    'asset:read',
    'legacy-asset:manage',
    'legacy-universe:manage',
    'universe.place:write',
    'universe:write'
]

var clientId = ''
var client_secret = ''

var redirectURL = 'http://localhost:3000/flow/redirect'
function fetchAuthURL() {
    var codeVerifier = base64URLEncode(crypto.randomBytes(32))
    var codeChallenge = base64URLEncode(
        crypto.createHash('sha256').update(codeVerifier).digest('base64')
    )
    var randomState = crypto.randomBytes(3).toString('hex')
    var authUrl = 'https://apis.roblox.com/oauth/v1/authorize?client_id=' + clientId + '&code_challenge=' + codeChallenge + '&code_challenge_method=S256&redirect_uri=' + encodeURIComponent(redirectURL) + '&scope=' + encodeURIComponent(scopes.join(' ')) + '&response_type=code&state=' + randomState
    return {
        auth: authUrl,
        cookie: tokenEncoding.write({
            code_verifier: codeVerifier
        }, ['code_verifier']).toString('base64url')
    }
}

async function checkRefreshToken(originalState) {
    var state = tokenEncoding.read(Buffer.from(originalState, 'base64url'), ["access_token", "refresh_token", "expires_in"])
    if (Number(state.expires_in) < Date.now()) {
        var response = await fetch('https://apis.roblox.com/oauth/v1/token', {
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: state.refresh_token,
                client_id: clientId,
                client_secret: client_secret
            }).toString(),
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            }
        })
            .then(res => res.json())
        console.log('refreshed!')
        return tokenEncoding.write({
            "access_token": response.access_token,
            "refresh_token": response.refresh_token,
            "expires_in": String((Date.now() + (response.expires_in*1000))),
        }, ["access_token", "refresh_token", "expires_in"]).toString('base64url')    
    } else {
        return originalState
    }
}

async function handleResponse(code, state) {
    state = tokenEncoding.read(Buffer.from(state, 'base64url'), ['code_verifier'])
    var response = await fetch('https://apis.roblox.com/oauth/v1/token', {
        body: new URLSearchParams({
            "code": code,
            "code_verifier": state.code_verifier,
            "grant_type": "authorization_code",
            "client_id": clientId,
            "client_secret": client_secret
        }).toString(),
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        }
    })
        .then(res => res.json())
    return tokenEncoding.write({
        "access_token": response.access_token,
        "refresh_token": response.refresh_token,
        "expires_in": String((Date.now() + (response.expires_in*1000))),
    }, ["access_token", "refresh_token", "expires_in"]).toString('base64url')
}

async function listUserExperiences(state) {
    console.log("Loading...")
    var response = await fetch('https://apis.roblox.com/oauth/v1/token/resources', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            token: state.access_token,
            client_id: clientId,
            client_secret: client_secret
        }).toString(),
        method: "POST"
    })
        .then(res => res.json())
    var arrayOfItems = []
    for (var id in response.resource_infos[0].resources.universe.ids) {
        id = response.resource_infos[0].resources.universe.ids[id]
        arrayOfItems.push(id)
    }
    await fetch('https://games.roblox.com/v1/games?universeIds=' + arrayOfItems.join(','), {
        headers: {
            'Authorization': 'Bearer ' + state.access_token
        },
        method: "GET"
    })
        .then(res => res.json())
        .then(res => {
            res.data.forEach(function(item) {
                arrayOfItems[arrayOfItems.indexOf(String(item.id))] = {
                    id: item.id,
                    rootPlaceId: item.rootPlaceId,
                    name: item.name
                }
            })
        })
    await fetch('https://thumbnails.roblox.com/v1/places/gameicons?size=128x128&format=png&placeIds=' + arrayOfItems.map(function(val) { return val.rootPlaceId}).join(','), {
        headers: {
            'Authorization': 'Bearer ' + state.access_token
        },
        method: "GET"
    })
        .then(res => res.json())
        .then(res => {
            res.data.forEach(function(item) {
                var index = arrayOfItems.indexOf(arrayOfItems.find(function(val) { return val.rootPlaceId == item.targetId }))
                arrayOfItems[index] = {
                    id: arrayOfItems[index].id,
                    name: arrayOfItems[index].name,
                    rootPlaceId: arrayOfItems[index].rootPlaceId,
                    thumb: item.imageUrl
                }    
            })
        })
    return arrayOfItems
}

module.exports = {
    fetchAuthURL,
    checkRefreshToken,
    listUserExperiences,
    handleResponse
}