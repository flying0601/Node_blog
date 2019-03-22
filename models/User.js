//创建一个User的模型类
//实际操作的通过模型类来对数据可操作

var mongoose = require('mongoose');
var usersSchema = require('../shcemas/users');

//mongoose的模型方法创建Userm模型，操作usersSchema,并暴露出去
module.exports = mongoose.model('User',usersSchema);
