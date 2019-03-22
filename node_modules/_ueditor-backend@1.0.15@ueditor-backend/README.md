# ueditor-backend
[![ueditor-backend logo](https://github.com/ELSS-ZION/ueditor-for-node/raw/master/logo.jpg)](https://github.com/ELSS-ZION/ueditor-for-node/tree/master/ueditor-backend)

[UEditor](https://github.com/fex-team/ueditor) backend for [node](http://nodejs.org)

## Installation

```bash
$ npm install ueditor-backend
```

## Usage
1. modify `ueditor.config.js`
```js
// 服务器统一请求接口路径
serverUrl: URL + "ueditor-backend"
```
2. call ueditor_backend()
```js
const express = require('express')
const app = express()
const ueditor_backend = require('ueditor-backend')
ueditor_backend(app)
```

## Config
+ modify `/node_modules/ueditor-backend/config.json`

## Examples

+ [ueditor-backend examples](https://github.com/ELSS-ZION/ueditor-for-node/tree/master/examples)
