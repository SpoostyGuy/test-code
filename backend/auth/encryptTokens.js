var crypto = require('crypto')
var key = Buffer.from('', 'hex')

function read(buf, indexing) {
    var offset = 0
    var baseData = {}
    while (offset < buf.length) {
        var type = buf.readUint8(offset)
        offset += 1
        var length = buf.readUint32LE(offset)
        offset += 4
        if (type == 0) {
            baseData['iv'] = buf.slice(offset, offset+length)
            offset += length
        } else {
            if (type == 1) {
                baseData['data'] = buf.slice(offset, offset+length)
                offset += length
            }
        }
    }

    var decrypted = crypto.createDecipheriv('aes-256-cbc', key, baseData['iv'])
    var finalData = decrypted.update(baseData['data'])
    finalData = Buffer.concat([finalData, decrypted.final()])

    var finalJSON = {}
    offset = 0

    while (offset < finalData.length) {
        var type = finalData.readUint8(offset)
        offset += 1
        var length = finalData.readUint32LE(offset)
        offset += 4
        finalJSON[indexing[type]] = finalData.slice(offset, offset+length).toString()
        offset += length
    }
    return finalJSON
}

function write(data, indexing) {

    var encodedBuffer = Buffer.alloc(0)
    var offset = 0

    for (var index in data) {
        encodedBuffer = Buffer.concat([encodedBuffer, Buffer.alloc(5)])
        encodedBuffer.writeUint8(indexing.indexOf(index), offset)
        offset += 1
        encodedBuffer.writeUint32LE(Buffer.from(data[index]).length, offset)
        offset += 4
        encodedBuffer = Buffer.concat([encodedBuffer, Buffer.from(data[index])])
        offset += Buffer.from(data[index]).length
    }
    var offset = 0
    var finalData = {
        'iv': crypto.randomBytes(16),
        'data': Buffer.from(encodedBuffer)
    }


    var encrypted = crypto.createCipheriv('aes-256-cbc', key, finalData['iv'])
    finalData['data'] = encrypted.update(finalData['data'])
    finalData['data']  = Buffer.concat([finalData['data'], encrypted.final()])

    var buf = Buffer.alloc(0)
    for (var index in finalData) {
        buf = Buffer.concat([buf, Buffer.alloc(5)])
        buf.writeUint8((index == 'iv') ? 0 : 1, offset)
        offset += 1
        buf.writeUint32LE(finalData[index].length, offset)
        offset += 4
        buf = Buffer.concat([buf, finalData[index]])
        offset += finalData[index].length
    }
    return buf
}

module.exports = {
    read,
    write
}