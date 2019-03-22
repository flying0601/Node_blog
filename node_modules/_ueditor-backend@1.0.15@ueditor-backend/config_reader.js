const fs = require('fs')
const path = require('path')

var file = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8')
file = file.replace(/\/\*[\s\S]+?\*\//g, '')
json = JSON.parse(file)
if (json.imageManagerListPath.substr(0, 1) != '/') {
    json.imageManagerListPath =  '/' + json.imageManagerListPath
}
if (json.fileManagerListPath.substr(0, 1) != '/') {
    json.fileManagerListPath = '/' + json.fileManagerListPath
}
module.exports = json