var express = require('express');
const captcha = require('svg-captcha');
var router = express.Router();
var User = require('../models/User'); //引入模型类
var Content = require('../models/Content');
var Swiper = require('../models/Swiper');
var Swiper = require('../models/Swiper');
var Setting = require('../models/Setting');
var Link = require('../models/Link');
var Notice = require('../models/Notice');
var uploadModel = require('../models/Upload-model');

//定义验证吗
var captchaCookies = '';

//定义返回变量格式
var resData;
router.use(function (req, res, next) {
  //res.send('api-user');
  resData = {
    code: 0,
    message: ''
  };
  next();
})

//注册逻辑
router.post('/user/register', function (req, res, next) {
  //console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;
  //用户名不能为空
  if (username == '') {
    resData.code = 1;
    resData.message = '用户名不能为空';
    res.json(resData); //使用res.json的方法返回前端
    return;
  }
  //密码不能为空
  if (password == '') {
    resData.code = 2;
    resData.message = '密码不能为空';
    res.json(resData); //使用res.json的方法返回前端
    return;
  }
  //两次密码不一致
  if (password != repassword) {
    resData.code = 3;
    resData.message = '两次输入的密码不一致';
    res.json(resData); //使用res.json的方法返回前端
    return;
  }
  //验证用户名是否已经注册
  User.findOne({
    username: username
  }).then(function (userInfo) {
    console.log(userInfo); //返回为空表示没有当前用户名
    if (userInfo) {
      //数据库有该用户名
      resData.code = 4;
      resData.message = '用户名已经被注册';
      res.json(resData);
      return
    }
    //用户名没有被注册则将用户名保存到数据库
    var user = new User({
      username: username,
      password: password
    }); //通过操作对象 操作数据库
    return user.save();
  }).then(function (newUserInfo) {
    resData.message = '注册成功';
    res.json(resData);
    console.log(resData);
  });

})

router.post('/user/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var captcha = req.body.captcha;
  if (username == '' || password == '') {
    resData.code = 1;
    resData.message = '用户名或密码不能为空';
    res.json(resData);
    return
  }
  if ( captcha == '' ) {
    resData.code = 1;
    resData.message = '验证码不能为空';
    res.json(resData);
    return
  }
  if ( captcha != captchaCookies ) {
    resData.code = 1;
    resData.message = '验证码错误';
    res.json(resData);
    return
  }
  User.findOne({
    username: username,
    password: password
  }).then(function (userInfo) {
    if (!userInfo) {
      resData.code = 2;
      resData.message = '用户名或密码错误';
      res.json(resData);
      return;
    }
    //验证通过则登录
    resData.message = '登录成功';
    resData.userInfo = {
      _id: userInfo._id,
      username: userInfo.username,
      isAdmin: userInfo.isAdmin
    };
    //使用req.cookies的set方法把用户信息发送cookie信息给浏览器，浏览器将cookie信息保存，再次登录浏览器会将cookie信息放在头部发送你的服务端，验证登录状态
    req.cookies.set('userInfo', JSON.stringify({
      _id: userInfo._id,
      username: userInfo.username
    }));
    res.json(resData);
    return;
  })
})

router.get('/user/logout', function (req, res) {
  req.cookies.set('userInfo', null);
  res.json(resData);
})
// 验证码
router.get('/captcha',(req,res)=>{
  const cap = captcha.createMathExpr({
    ignoreChars: '0o1i' ,
    noise: 2,
    color: true ,
    background: '#e8e8e9'
  });
  captchaCookies = cap.text; // 验证码存储到全局
  // req.cookies.set('captcha',cap.text );
  //console.log('captcha',cap.text);
  res.type('svg'); // 响应的类型
  res.send(cap.data);
});


// 后台用户列表接口
router.post('/user/list', function (req, res, next) {
  //limiy()限制获取的用户条数
  //skip()忽略数据的查询
  var page = Number(req.query.page) || 1;
  var limit = 4;
  var pages = 0;
  User.count().then(function (count) {
    //计算总页数向上取整
    //console.log('object',count);
    pages = Math.ceil(count / limit);
    //page 取值不能超过pages,去总页和page中的最小值
    page = Math.min(page, pages);
    page = Math.max(page, 1);
    //console.log('object',page);
    var skip = (page - 1) * limit;
    //从数据中读取所以的用户数据
    User.find().limit(limit).skip(skip).then(function (users) {
      //console.log(users);
      resData.message = {
        userInfo: req.userInfo,
        users: users,
        page: page,
        count: count,
        pages: pages,
        limit: limit
      };
      res.json(resData);
      return;
      // res.render('admin/user_index',{
      //   userInfo: req.userInfo,
      //   users: users,
      //   page: page,
      //   count: count,
      //   pages: pages,
      //   limit: limit
      // });
    });
  });
})
//评论提交
router.post('/comment/post',function (req,res) {
  //内容的id
  var contentid = req.body.contentid || '';
  var postData = {
    username:req.userInfo.username,
    postTime:new Date(),
    content:req.body.content
  }
  //查询当前这边内容的信息
  Content.findOne({
    _id:contentid
  }).then(function (content) {
    content.comments.push(postData);
    return content.save();
  }).then(function (newContent) {
    resData.message = '评论成功';
    resData.data = newContent;
    res.json(resData);
    //console.log(res.json(resData));
  })
})
//获取指定文章的所有评论
router.get('/comment',function(req,res){
	//内容的id
	var contentid = req.query.contentid || '';
	Content.findOne({
		_id:contentid
	}).then(function(content){
		resData.data = content.comments,
		res.json(resData);
	})
});
//公告
router.post('/notice', function (req, res) {
  Notice.find().sort({
    sort: -1
  }).then(function (notices) {
    //console.log('hotlist', hotlist);
    resData.data = notices;
    res.json(resData);
  })
});
//点击排行
router.post('/dotlist', function (req, res) {
  Content.find({},{title:1, _id:1,views:1}).sort({
    views: -1
  }).limit(5).then(function (dotLists) {
    //console.log('dotLists', dotLists);
    resData.data = dotLists
    res.json(resData);
  })
});
//热门排行
router.post('/hotlist', function (req, res) {
  Content.find( {}, {title:1, _id:1,commentsNum:1}).sort({
    commentsNum: -1
  }).limit(5).then(function (hotlist) {
    //console.log('hotlist', hotlist);
    resData.data = hotlist;
    res.json(resData);
  })
});
//链接
router.post('/link', function (req, res) {
  var cate = req.body.category;
  Link.find( {category: cate}).sort({
    sort: -1
  }).then(function (links) {
    //console.log('hotlist', hotlist);
    resData.data = links;
    res.json(resData);
  })
});
router.post('/setting',function (req,res) {
  Setting.findOne({
    name:'setting'
  }).then(function(setting){
    //console.log('setting',setting);
    resData.data = setting;
    res.json(resData);
  })
})

//上传图片
router.post('/imgUpload',function(req,res){
  // /**设置响应头允许ajax跨域访问**/
  // res.setHeader("Access-Control-Allow-Origin","*");
  uploadModel.uploadPhoto(req,'img',function(err,fields,uploadPath){
      if(err){
          return res.json({
              errCode : 0,
              errMsg : '上传图片错误'
          });
      }
      console.log(fields);    //表单中字段信息
      console.log(uploadPath);    //上传图片的相对路径
      res.json({
          errCode : 1,
          errMsg : '上传成功',
          fields :  fields,
          uploadPath : uploadPath
      });
  });
});

//轮播图保存
router.post('/swiper/add',function (req,res) {
  //console.log(req.body);
  //验证
  if (req.body.title == '') {
    resData.userInfo = req.userInfo;
    resData.message = '标题不能为空';
    return;
  }
  if (req.body.path == '') {
      resData.userInfo = req.userInfo;
      resData.message = '图片不能为空';
    return;
  }
  //保存
  new Swiper({
    title:req.body.title,
    user:req.body.username,
    desciption:req.body.desc,
    path:req.body.path
  }).save().then(function () {
    resData.userInfo = req.userInfo,
    resData.message = '内容保存成功';
    resData.url = '/admin/swiper';
    res.json(resData);
    //console.log(res.json(resData));
  })
})

module.exports = router;
