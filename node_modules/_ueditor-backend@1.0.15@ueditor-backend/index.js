const fs = require('fs')
const path = require('path')
const CONFIG = require('./config_reader')
const action_upload = require('./action_upload')
const action_list = require('./action_list')
const action_crawler = require('./action_crawler')

const express = require('express')
const fileUpload = require('express-fileupload')
const body_parser = require('body-parser')
const rootDir = path.dirname(require.main.filename)

module.exports = function (app) {
    
    app.use(body_parser.urlencoded({
        extended: true
    }))
    app.use(body_parser.json())
    app.use(fileUpload())
    app.use(CONFIG.imageManagerListPath, express.static(path.join(rootDir, CONFIG.imageManagerListPath)))
    app.use(CONFIG.fileManagerListPath, express.static(path.join(rootDir, CONFIG.fileManagerListPath)))
    app.use('/ueditor-backend', function (req, res, next) {
        var result
        switch (req.query.action) {
            case 'config':
                sendFunc(CONFIG, req, res)
                break
            case CONFIG.imageActionName:
            case CONFIG.scrawlActionName:
            case CONFIG.videoActionName:
            case CONFIG.fileActionName:
                action_upload(req, res, sendFunc)
                break
            case CONFIG.imageManagerActionName:
            case CONFIG.fileManagerActionName:
                action_list(req, res, sendFunc)
                break
            case CONFIG.catcherActionName:
                action_crawler(req, res, sendFunc)
                break
            default:
                sendFunc({
                    state: '请求地址出错'
                }, req, res)
        }
    })
}

function sendFunc(result, req, res) {
    if (req.query.callback) {
        if (!/^[\w_]+$/.test(req.query.callback)) {
            res.json({
                state: 'callback参数不合法'
            })
            return
        }
        res.send(req.query.callback + '(' + JSON.stringify(result) + ')')
        return
    }
    res.json(result)
}