var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
var Swiper = require('../models/Swiper');
var data;
//处理通用的数据
router.use(function(req,res,next){
	data = {
		userInfo:req.userInfo,
		categories:[]
	};
	Category.find().sort({_id:-1}).then(function(categories){
		data.categories = categories;
		next();
	})
})
//首页
router.get('/',function(req,res,next){
	//列表
		data.category = req.query.category || '',
		data.page = Number(req.query.page) || 1,
		data.limit = 6,
		data.pages = 0,
		data.count = 0
	var where = {};
	if(data.category){
		where.category = data.category;
	}
	//读取所有的分类信息
	Category.find().sort({_id:-1}).then(function(categories){
		data.categories = categories;
		//console.log('categories',categories);
		//读取内容总记录数
		return Content.where(where).countDocuments();
	}).then(function(count){
		data.count = count;
		//计算总页数向上取整
		data.pages = Math.ceil(data.count / data.limit);
		//page取值不能超过pages，去总页数和page中的最小值
		data.page = Math.min(data.page,data.pages);
		//page取值不能小于1
		data.page = Math.max(data.page,1);
		var skip = (data.page -1 ) * data.limit;

		//读取内容,最新的展示在最前面
		return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({
			addTime:-1
		});
	}).then(function(contents){
		data.contents = contents; //将内容赋值给data属性
		// console.log(data);
	}).then(function () {
		return	Swiper.find().sort({_id:-1});
	}).then(function (swipers) {
		//轮播图
		data.swipers = swipers;
		return Category.findOne({_id:	where.category}).sort();
	}).then(function (listName) {
		if (listName) {
			data.listName = listName;
		}else{
			data.listName ={name:"最新发布"}
		}
		//console.log('listName',data.listName);
		//导航栏高亮
		if(data.category){
			data.contents.cate = where.category;
		}else{
			data.contents.cate = 'index';
		}
		res.render('main/index',data);
		//console.log('data',data);
	})

});
//详情页
router.get('/view',function(req,res){
	var contentid = req.query.contentid || '';
	data.category = req.query.category || '';
	var where = {};
	Content.findOne({
		_id:contentid
	}).populate(['category','user']).then(function(content){
		data.content = content;
		//console.log('content',data.content);
		if (data.category != 'index') {
			where.category = data.content.category.id;
		}
		content.views ++ ; //阅读量增加
		content.commentsNum = data.content.comments.length;
		content.save(); //保存阅读量和评论
		//上一篇的查询
		return Content.where(where).find({ '_id': { '$lt': contentid } }).sort({_id:-1}).limit(1);
	}).then(function (prev) {
			data.prevs = prev[0];
			//下一篇的查询
		return Content.where(where).find({ '_id': { '$gt': contentid } }).sort({_id:1}).limit(1);
	}).then(function (nexts){
		data.nexts = nexts[0];
		//上下篇的分类
		if(data.category){
			data.cate = data.category;
		}else{
			data.cate = 'index';
		}
		res.render('main/view',data);
		// console.log('object1',data);
	})
})


module.exports = router;
