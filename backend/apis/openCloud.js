var fetch = require('node-fetch-commonjs')

async function retrieveUserInfo(state) {
    var response = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
        headers: {
            'Authorization': 'Bearer ' + state.access_token
        },
        method: "GET"
    })
        .then(res => res.json())
    return response
}

async function downloadPlace(state, place) {
    return fetch('https://apis.roblox.com/asset-delivery-api/v1/assetId/' + place, {
        headers: {
            'Authorization': 'Bearer ' + state.access_token
        },
        method: "GET"
    })
        .then(res => res.json())
        .then(res => {
            return fetch(res.location, {
                headers: {
                    'Authorization': 'Bearer ' + state.access_token
                },
                method: "GET"
            })
        })
        .then(async res => {
            return Buffer.from(await res.arrayBuffer())
        })
}

async function uploadPlace(state, data) {
    var isSucessful = false
    console.log(data)
    await fetch('https://apis.roblox.com/universes/v1/' + data.universeId + '/places/' + data.placeId + '/versions?versionType=Published', {
        headers: {
            'Authorization': 'Bearer ' + state.access_token,
            'Content-Type': (data.type == 'xml') ? 'application/xml' : 'application/octet-stream'
        },
        body: data.data,
        method: "POST"
    })
        .then(res => {
            console.log(res.status)
            if (res.status == 200) {
                isSucessful = true
            }
            return res.json()
        })
        .then(res => {
            console.log(res)
        })
    return isSucessful
}

module.exports = {
    retrieveUserInfo,
    uploadPlace,
    downloadPlace
}