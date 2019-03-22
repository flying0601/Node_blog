//定义数据库表储存结构

//引入mongoose模块操作数据库

var mongoose = require('mongoose');

//定义用户表结构（字段和类型），并暴露出去
module.exports = new mongoose.Schema({
  username:String,//用户名
  password:String,//密码
  photos:String,//密码
  isAdmin: {
    type: Boolean,
    default: false
  }
})
