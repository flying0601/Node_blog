//创建一个Category的模型类
//实际操作的是通过操作模型类对数据库操作

var mongoose = require('mongoose');
var ContentSchema = require('../shcemas/content')

module.exports = mongoose.model('Content',ContentSchema);
