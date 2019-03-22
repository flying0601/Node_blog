//定义数据库表存储结构

//引入mongoose模块操作数据库

var mongoose = require('mongoose');

//定义用户表结构（字段和类型），并暴露出去

module.exports = new mongoose.Schema({
  //关联字段 -分类的id
  category:{
    type:mongoose.Schema.Types.ObjectId,
    //引用
    ref:'Category'
  },
  title:String,
  //作者
  user:{
    type:mongoose.Schema.Types.ObjectId,
    //引用
    ref:'User'
  },
  //点击量
  views:{
    type:Number,
    default:0
  },
  //评论量
  commentsNum:{
    type:Number,
    default:0
  },
  //创建时间
  addTime:{
    type:Date,
    default:new Date()
  },
  //简介
  desciption:{
    type:String,
    default: ''
  },
  //缩略图
  photo: {
    type:String,
    default:''
  },
  //内容
  content: {
    type:String,
    default:''
  },
  //评论
	comments:{
		type:Array,
		default:[]
	}
})
