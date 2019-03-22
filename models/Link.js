//创建一个Category的模型类
//实际操作的通过模型类来对数据可操作

var mongoose = require('mongoose');
var LinkSchema = require('../shcemas/link');

//mongoose的模型方法创建Userm模型，操作LinkSchema,并暴露出去
module.exports = mongoose.model('Link',LinkSchema);
