const path = require('path')
const fs = require('fs')
const rootDir = path.dirname(require.main.filename)

function getFullName (pathFormat, oriName) {
    var date = new Date()
    var month = date.getMonth() + 1
    pathFormat = pathFormat.replace('{yyyy}', date.getFullYear())
    pathFormat = pathFormat.replace('{yy}', (date.getFullYear() + '').substr(2))
    pathFormat = pathFormat.replace('{mm}', (month >= 10 ? '' : '0') + month)
    pathFormat = pathFormat.replace('{dd}', (date.getDate() >= 10 ? '' : '0') + date.getDate())
    pathFormat = pathFormat.replace('{hh}', (date.getHours() >= 10 ? '' : '0') + date.getHours())
    pathFormat = pathFormat.replace('{ii}', (date.getMinutes() >= 10 ? '' : '0') + date.getMinutes())
    pathFormat = pathFormat.replace('{ss}', (date.getSeconds() >= 10 ? '' : '0') + date.getSeconds())
    pathFormat = pathFormat.replace('{time}', date.getTime())

    var pathObj = path.parse(oriName)
    var ext = pathObj.ext.toLowerCase()
    oriName = pathObj.name
    oriName = oriName.replace(/[\:*?"<>|]+/g, '')
    pathFormat = pathFormat.replace('{filename}', oriName)


    var reg = /{rand\:([\d]*)}/i
    if (reg.test(pathFormat)) {
        var random = Math.pow(10, RegExp.$1) * Math.random()
        random = Math.floor(random)
        pathFormat = pathFormat.replace(reg, random)
    }

    pathFormat = path.join(rootDir, pathFormat) + ext
    return pathFormat
}

function mkdirsSync (dirname) {
    if (fs.existsSync(dirname)) {
        return true
    }

    if (mkdirsSync(path.dirname(dirname), 0777)) {
        fs.mkdirSync(dirname);
        fs.chmodSync(path.join(dirname), 0777)
        return true
    }
}

exports.saveFile = function (pathFormat, oriName, buffer) {
    var fullName = getFullName(pathFormat, oriName)
    mkdirsSync(path.dirname(fullName))
    fs.writeFileSync(fullName, buffer)
    return '/' + path.relative(rootDir, fullName)
}