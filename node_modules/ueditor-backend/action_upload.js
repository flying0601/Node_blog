const fs = require('fs')
const path = require('path')
const CONFIG = require('./config_reader')
const util = require('./util')
const rootDir = path.dirname(require.main.filename)

module.exports = function (req, res, callback) {
    var pathFormat
    var data
    var maxSize
    var allowFiles
    switch (req.query.action) {
        case CONFIG.imageActionName:
            pathFormat = CONFIG.imagePathFormat
            data = req.files[CONFIG.imageFieldName].data
            maxSize = CONFIG.imageMaxSize
            allowFiles = CONFIG.imageAllowFiles
            break
        case CONFIG.scrawlActionName:
            pathFormat = CONFIG.scrawlPathFormat
            data = new Buffer(req.body[CONFIG.scrawlFieldName], 'base64')
            maxSize = CONFIG.scrawlMaxSize
            break
        case CONFIG.videoActionName:
            pathFormat = CONFIG.videoPathFormat
            data = req.files[CONFIG.videoFieldName].data
            maxSize = CONFIG.videoMaxSize
            allowFiles = CONFIG.videoAllowFiles
            break
        case CONFIG.fileActionName:
        default:
            pathFormat = CONFIG.filePathFormat
            data = req.files[CONFIG.fileFieldName].data
            maxSize = CONFIG.fileMaxSize
            allowFiles = CONFIG.fileAllowFiles
            break
    }

    var size = data.length
    if (data.length > maxSize) {
        callback({
            state: '文件大小超出网站限制'
        }, req, res)
        return
    }

    var oriName = req.body.name ? req.body.name : 'scrawl.png'
    if (allowFiles) {
        var isMatch = false
        allowFiles.forEach(function (element) {
            if (path.extname(oriName).toLowerCase() == element.toLowerCase()) {
                isMatch = true
            }
        })
        if (!isMatch) {
            callback({
                state: '文件类型不允许'
            }, req, res)
            return
        }
    }

    var url = util.saveFile(pathFormat, oriName, data)
    callback({
        state: "SUCCESS",
        url: url,
        title: path.basename(url),
        original: req.body.name,
        type: path.extname(url),
        size: req.body.size
    }, req, res)
}