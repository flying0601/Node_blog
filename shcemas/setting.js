//定义数据库表存储结构

//引入mongoose模块操作数据库

var mongoose = require('mongoose');

//定义用户表结构（字段和类型），并暴露出去

module.exports = new mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    //引用
    ref:'User'
  },
  name:{
    type:String,
    default:'setting'
  },
  //图片路径
  logopath: {
    type:String,
    default:''
  },
  //标题
  title:String,
  //博主姓名
  blogname:{
    type:String,
    default: ''
  },
  occupation:{
    type:String,
    default: ''
  },
  email:{
    type:String,
    default: ''
  },
  localtion:{
    type:String,
    default: ''
  },
  concernpath:{
    type:String,
    default: ''
  },
  //版权
  copyright:{
    type:String,
    default:''
  }
})
