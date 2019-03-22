//定义数据库分类表存储结构

//引入moogoose模块操作数据库
var mongoose = require('mongoose');

//定义用户表结构（字段和类型），并暴露出去
module.exports = new mongoose.Schema({
  title:String,
  link:{
    type:String,
    default:''
  },
  //排序
  sort:{
    type:Number,
    default:0
  }
})
