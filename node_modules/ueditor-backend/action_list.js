const path = require('path')
const fs = require('fs')
const CONFIG = require('./config_reader')
const rootDir = path.dirname(require.main.filename)

module.exports = function (req, res, callback) {
    var allowFiles
    var listSize
    var dir
    switch (req.query.action) {
        case CONFIG.fileManagerActionName:
            allowFiles = CONFIG.fileManagerAllowFiles
            listSize = CONFIG.fileManagerListSize
            dir = CONFIG.fileManagerListPath
            break
        case CONFIG.imageManagerActionName:
        default:
            allowFiles = CONFIG.imageManagerAllowFiles
            listSize = CONFIG.imageManagerListSize
            dir = CONFIG.imageManagerListPath
    }
    var size = req.query.size? req.query.size : listSize
    var start = req.query.start? req.query.start : 0
    var files = getFiles(path.join(rootDir, dir), allowFiles)
    files = files.reverse()
    if (size != 0) {
        files = files.slice(start, start+size)
    }

    callback({
        state: "SUCCESS",
        list: files,
        start: start,
        total: files.length
    }, req, res)
}

function getFiles(pathStr, allowFiles) {
    var res = []
    var regExp = new RegExp('^(' + CONFIG.catcherAllowFiles.join('|') + ')$', 'i')
    
    fs.readdirSync(pathStr).forEach(function (file) {
        var fullName = path.join(pathStr, file)
        var stat = fs.statSync(fullName)
        if (stat.isDirectory()) {
            res = res.concat(getFiles(fullName, allowFiles))
            return
        }
        if (regExp.test(path.extname(fullName))) {
            res.push({
                url: '/' + path.relative(rootDir, fullName),
                mtime: Date.parse(stat.mtime)
            })
        }
    })
    return res
}