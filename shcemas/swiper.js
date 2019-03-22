//定义数据库表存储结构

//引入mongoose模块操作数据库

var mongoose = require('mongoose');

//定义用户表结构（字段和类型），并暴露出去

module.exports = new mongoose.Schema({

  title:String,
  //作者
  user:{
    type:mongoose.Schema.Types.ObjectId,
    //引用
    ref:'User'
  },
  //简介
  desciption:{
    type:String,
    default: ''
  },
  //图片路径
  path: {
    type:String,
    default:''
  }
})
