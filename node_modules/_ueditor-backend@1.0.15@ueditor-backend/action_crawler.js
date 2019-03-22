const CONFIG = require('./config_reader')
const util = require('./util')
const path = require('path')
const request = require('request')

module.exports = function (req, res, callback) {
    var source = req.body[CONFIG.catcherFieldName] ? req.body[CONFIG.catcherFieldName] : req.query[CONFIG.catcherFieldName]
    var list = []
    source.forEach(function (v, i) {
        handleURL(v, (result) => {
            list.push(result)
            if (list.length == source.length) {
                console.info('list:', list.length)
                callback({
                    state: "SUCCESS",
                    list: list
                }, req, res)
            }
        })
    })
}

function handleURL(urlStr, callback) {
    request({
        uri: urlStr,
        encoding: 'binary'
    }, (error, response, body) => {
        var result = {}
        result.source = urlStr
        if (error) {
            result.state = error.message
        }
        if (response.statusCode != 200) {
            result.state = '链接不可用'
        }

        var contentType = response.headers['content-type']
        var regExp = new RegExp('^(' + CONFIG.catcherAllowFiles.join('|') + ')$', 'i')

        if (!regExp.test(path.extname(urlStr)) || !contentType || contentType.indexOf('image') == -1) {
            result.state = '链接contentType不正确'
        }

        if (body.length > CONFIG.catcherMaxSize) {
            result.state = '文件大小超出网站限制'
        }

        result.state = result.state ? result.state : 'SUCCESS'

        var oriName = path.basename(urlStr) ? path.basename(urlStr) : 'remote.png'
        var buffer = Buffer.from(body, 'binary')
        result.url = util.saveFile(CONFIG.catcherPathFormat, oriName, buffer)
        callback(result)
    })
}