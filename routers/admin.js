var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Category = require('../models/Category');
var Content = require('../models/Content');
var Swiper = require('../models/Swiper');
var Setting = require('../models/Setting');
var Link = require('../models/Link');
var Notice = require('../models/Notice');

router.use(function (req,res,next) {
  if (!req.userInfo.isAdmin) {
    res.render('admin/login');
    console.log('对不起,只有管理才有权限！');
    return;
  }
  next();
})

//首页
router.get('/', function (req, res, next) {
  if (req.userInfo.isAdmin) {
    User.findOne({
      _id:req.userInfo._id
    }).then(function(users){
      res.render('admin/index', {
        userInfo: req.userInfo,
        photo: users.photos
      });
    })
    //console.log('req.userInfo',req.userInfo);
  }
})
//主页
router.get('/main',function (req,res,next) {
  res.render('admin/main');
})
//用户管理
router.get('/user',function (req, res, next) {
  //limiy()限制获取的用户条数
  //skip()忽略数据的查询
  var page = Number(req.query.page) || 1;
  var limit = 10;
  var pages = 0;
  User.countDocuments().then(function(count){
      //计算总页数向上取整
      //console.log('object',count);
      pages = Math.ceil(count / limit);
      //page 取值不能超过pages,去总页和page中的最小值
      page = Math.min(page,pages);
      page = Math.max(page,1);
      //console.log('object',page);
      var skip = (page - 1) * limit;
      //从数据中读取所以的用户数据
      User.find().sort({_id:-1}).limit(limit).skip(skip).then(function(users){
        //console.log(users);
        res.render('admin/user_index',{
          userInfo: req.userInfo,
          users: users,
          page: page,
          count: count,
          pages: pages,
          limit: limit
        });
      });
    });
})
//用户添加
router.get('/user/add',function(req,res){
	res.render('admin/user_add',{
		userInfo:req.userInfo
	})
})
//用户添加保存
router.post('/user/add',function(req,res){
  if (req.body.username == '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'用户名不能为空',
      url: 'admin/user',
      urlText:'用户列表'
    })
    return
  }
  if (req.body.password == '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'密码不能为空',
      url: 'admin/user',
      urlText:'用户列表'
    })
    return
  }
  if (req.body.password != req.body.repassword) {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'两次密码不一致',
      url: 'admin/user',
      urlText:'用户列表'
    })
    return
  }
  User.findOne({
    username: req.body.username
  }).then(function (users) {
    if (users) {
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'用户名已经被注册',
        url: 'admin/user',
        urlText:'用户列表'
      });
      return Promise.reject();
    }else{
    //用户名没有被注册则将用户名保存到数据库
    return new User({
      username: req.body.username,
      password: req.body.password,
      photos: req.body.photos
    }).save();
  }
  }).then(function (newUsers) {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'添加成功',
      url: '/admin/user',
      urlText:'用户列表'
    })
  })
})
//用户的修改
router.get('/user/edit',function (req,res) {
  //获取要修改分类的信息，用表单展示出来
  var id = req.query.id || '';
  //获取要修改的分类信息
  User.findOne({
    _id:id
  }).then(function (users) {
    //console.log(users);
    if (!users) {
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'用户信息不存在',
        url:'/admin/user',
        urlText:'用户列表'
      })
    }else{
      res.render('admin/user_edit',{
        userInfo:req.userInfo,
        users:users
      });
    }
  })
})
//用户信息修改
router.post('/user/edit',function (req,res) {
  //console.log('object',req.body);
  var id = req.query.id || '';
  User.findOne({
    _id:id
  }).then(function (users) {
     oldPassword = users.password;
    if (oldPassword  != req.body.oldpassword || req.body.oldpassword == '') {
       res.render('admin/error',{
        userInfo:req.userInfo,
        message:'旧密码不正确或旧密码为空',
        url:'/admin/user',
        urlText:'用户列表'
       })
      return Promise.reject();
    }
    if (oldPassword == req.body.newpassword) {
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'新密码与旧密码一致',
        url:'/admin/user',
        urlText:'用户列表'
       })
      return Promise.reject();
    }
      return User.updateOne({
        _id:id,
      },{
        password: req.body.newpassword,
        photos: req.body.photos
      })

  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'修改成功',
      url:'/admin/user',
      urlText:'用户列表'
    });
  })
})
// 用户删除
router.get('/user/delete',function (req,res) {
  var id = req.query.id || '';
  User.deleteOne({
    _id:id
  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'删除成功',
      url:'/admin/user',
      urlText:'用户列表'
    });
  })
})

//分类管理
router.get('/category',function (req, res, next) {
  //limit()限制获取的分类条数
  //skip()忽略数据查询
  var page = Number(req.query.page) || 1;
  var limit = 4;
  var pages = 0;
  Category.countDocuments().then(function (count) {
    //计算总页数向上取整
    pages = Math.ceil( count / limit);
    //page取值不能超过pages，去总页数和page中的最小值
    page = Math.min(page,pages);
    //page取值不能小于1
    page = Math.max(page,1);
    var skip = (page - 1) * limit;
    // res.render('admin/category_index');
    //从数据库读取所有分类数据
    Category.find().limit(limit).skip(skip).then(function (categories) {
      //console.log('cate',categories);
      res.render('admin/category_index',{
        userInfo:req.userInfo,
        categories:categories,
        page:page,
        count:count,
        pages:pages,
        limit: limit
    });
  });
 })
})
//分类添加
router.get('/category/add',function(req,res){
	res.render('admin/category_add',{
		userInfo:req.userInfo
	})
})
//分类的保存
router.post('/category/add',function(req,res){
	var name = req.body.name || '';
	if(name == ''){
		res.render('admin/error',{
			userInfo:req.userInfo,
      message:"名称不能为空",
      url:'/admin/category',
      urlText: '分类列表'
		});
		return;
	}
	//数据库中是否已经存在同名名称
	Category.findOne({
		name:name
	}).then(function(caregryInfo){
		if(caregryInfo){
			res.render('admin/error',{
				userInfo:req.userInfo,
        message:'分类已经存在',
        url:'/admin/category',
        urlText: '分类列表'
			})
			return Promise.reject(); //不在执行then方法
		}else{
			//若数据库中不存在该分类
			return new Category({
				name:name
			}).save();
		}
	}).then(function(rs){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'分类保存成功',
      url:'/admin/category',
      urlText: '分类列表'
		})
	})
})
//分类的修改
router.get('/category/edit',function (req,res) {
  //获取要修改分类的信息，用表单展示出来
  var id = req.query.id || '';
  //获取要修改的分类信息
  Category.findOne({
    _id:id
  }).then(function (category) {
    //console.log(category);
    if (!category) {
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'分类信息不存在',
        url:'/admin/category',
        urlText: '分类列表'
      })
    }else{
      res.render('admin/category_edit',{
        userInfo:req.userInfo,
        category:category
      });
    }
  })
})
//分类修改保存
router.post('/category/edit',function (req,res) {
  var id = req.query.id || '';
  //获取新的分类名称
  var name = req.body.name || '';
  Category.findOne({
    _id:id
  }).then(function (category) {
    if (!category) {
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'分类信息不存在',
        url:'/admin/category',
        urlText: '分类列表'
      })
      return Promise.reject();
    }else{
      //当用户没有做任何修改
      if(name == category.naem){
        res.render('admin/success',{
          userInfo:req.userInfo,
          message:'修改成功',
          url:'admin/category',
          urlText: '分类列表'
        });
        return Promise.reject();
      }else{
        //修改名称是否已经存在
        return Category.findOne({
          _id:{$ne: id},
          name:name
        })
      }
    }
  }).then(function (sameCategory) {
    if (sameCategory) {
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'数据库中已经存在同名分类',
        url:'/admin/category',
        urlText: '分类列表'
      });
      return Promise.reject();
    }else{
      return Category.updateOne({
        _id:id,
      },{
        name:name
      })
    }
  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'修改成功',
      url:'/admin/category',
      urlText: '分类列表'
    });
  })

})

//分类删除
router.get('/category/delete',function (req,res) {
  var id = req.query.id || '';
  Category.deleteOne({
    _id:id
  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'删除成功',
      url:'/admin/category',
      urlText: '分类列表'
    });
  })
})

//内容管理
router.get('/content',function (req,res) {
  //limit()限制获取的用户条数
  //skip()忽略数据的查询
  var page = Number(req.query.page) || 1;
  var limit = 4;
  var pages = 0;
  Content.countDocuments().then(function(count){
    //计算总页数向上取整
    pages = Math.ceil(count /limit);
    //page取值不能超过pages,去总页数和page中的最小值
    page = Math.min(page,pages);
    page = Math.max(page,1);
    var skip = (page -1) * limit;
    //从数据库中读取所有的内容数据
    //sort排序1表示升序 -1表示降序
    //populate关联category的信息
    Content.find({},{photo:1,category:1,views:1,addTime:1,title:1,user:1}).sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
      //console.log('contents',contents);
      res.render('admin/content_index',{
        userInfo:req.userInfo,
        contents:contents,
        page:page,
        count:count,
        pages:pages,
        limit:limit
      });
    });
  })
})
//内容添加
router.get('/content/add',function(req,res){
  Category.find().sort({_id:-1}).then(function (categories) {
    res.render('admin/content_add',{
      userInfo:req.userInfo,
      categories:categories
    });
  });
})
//内容保存
router.post('/content/add',function (req,res) {
  //console.log(req.body);
  //验证
  if (req.body.title == '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'标题不能为空',
      url:'/admin/content',
      urlText: '分类列表'
    })
    return;
  }
  if (req.body.content == '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'内容不能为空',
      url:'/admin/content',
      urlText: '分类列表'
    })
    return;
  }
  //保存
  new Content({
    category:req.body.category,
    title:req.body.title,
    user:req.userInfo._id.toString(),
    desciption:req.body.desc,
    content:req.body.content,
    photo:req.body.photos
  }).save().then(function () {
      res.render('admin/success',{
        userInfo:req.userInfo,
        message:'内容保存成功',
        url:'/admin/content',
        urlText: '分类列表'
      })
  })
})
//内容修改
router.get('/content/edit',function (req,res) {
  var id = req.query.id || '';
  var categories = [];
  Category.find().sort({_id:1}).then(function (res) {
    categories = res;
    return Content.findOne({
      _id:id
    }).populate('category');
  }).then(function (content) {
    if (!content) {
      res,render('admin/error',{
        userInfo:req.userInfo,
        message:'制定内容不存在',
        url:'/admin/content',
        urlText: '分类列表'
      });
      return Promise.reject();
    } else{
      res.render('admin/content_edit',{
        userInfo:req.userInfo,
        categories:categories,
        content:content
      })
    }
  })
})
//内容修改保存
router.post('/content/edit',function (req,res) {
  console.log(req.body);
  var id = req.query.id || '';
  if (req.query.id == '') {
      req.render('admin/error',{
        userInfo:req.userInfo,
        message:'标题不能为空',
        url:'/admin/content',
        urlText: '分类列表'
      })
      return;
  }
  if (req.query.content == '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'内容不能为空',
      url:'/admin/content',
      urlText: '分类列表'
    })
    return;
  }
  Content.updateOne({
    _id:id
  },{
    category:req.body.category,
    title:req.body.title,
    user:req.userInfo._id.toString(),
    desciption:req.body.desc,
    content:req.body.content,
    photo:req.body.photos
  }).then(function(){
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'内容保存成功',
      url: '/admin/content/edit?id=' + id,
      urlText: '分类列表'
    })
  })
})
//内容删除
router.get('/content/delete',function (req,res) {
  var id = req.query.id || '';
  Content.deleteOne({
    _id:id
  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'删除成功',
      url:'/admin/content',
      urlText: '分类列表'
    });
  })
})

//轮播管理
router.get('/swiper',function (req,res) {
  //limit()限制获取的用户条数
  //skip()忽略数据的查询
  var page = Number(req.query.page) || 1;
  var limit = 4;
  var pages = 0;
  Swiper.countDocuments().then(function(count){
    //计算总页数向上取整
    pages = Math.ceil(count /limit);
    //page取值不能超过pages,去总页数和page中的最小值
    page = Math.min(page,pages);
    page = Math.max(page,1);
    var skip = (page -1) * limit;
    //从数据库中读取所有的内容数据
    //sort排序1表示升序 -1表示降序
    //populate关联category的信息
    Swiper.find().sort({_id:-1}).limit(limit).skip(skip).populate(['user']).then(function(swipers){
      //console.log('swipers',swipers);
      res.render('admin/swiper_index',{
        userInfo:req.userInfo,
        swipers:swipers,
        page:page,
        count:count,
        pages:pages,
        limit:limit
      });
    });
  })
})
//轮播图添加
router.get('/swiper/add',function(req,res){
    res.render('admin/swiper_add',{
      userInfo:req.userInfo,
  });
})

//轮播图保存
router.post('/swiper/add',function (req,res) {
  console.log(req.body);
  //验证
  if (req.body.title == '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'标题不能为空',
      url:'/admin/swiper',
      urlText: '轮播图列表'
    })
    return;
  }
  if (req.body.path == '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'图片不能为空',
      url:'/admin/swiper',
      urlText: '轮播图列表'
    })
    return;
  }
    //保存
    new Swiper({
      title:req.body.title,
      user:req.userInfo._id.toString(),
      desciption:req.body.desc,
      path:req.body.path
    }).save().then(function () {
      res.render('admin/success',{
        userInfo:req.userInfo,
        message:'轮播图保存成功',
        url:'/admin/swiper',
        urlText: '轮播图列表'
      })
    })
})
//轮播图修改
router.get('/swiper/edit',function (req,res) {
  var id = req.query.id || '';
  Swiper.findOne({
      _id:id
    }).then(function (swipers) {
    if (!swipers) {
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'制定轮播图不存在',
        url:'/admin/swiper',
        urlText: '轮播图列表'
      });
    }else{
      res.render('admin/swiper_edit',{
        userInfo:req.userInfo,
        swipers:swipers
      })
    }
  })
});
//轮播图修改保存
router.post('/swiper/edit',function (req,res) {
  var id = req.query.id || '';
  //验证
  if (req.body.title == '') {
    req.render('admin/error',{
      userInfo:req.userInfo,
      message:'标题不能为空',
      url:'/admin/swiper',
      urlText: '轮播图列表'
    })
    return;
  }
  if (req.body.path == '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'图片不能为空',
      url:'/admin/swiper',
      urlText: '轮播图列表'
    })
    return;
  }
    //保存
    Swiper.updateOne({
      _id:id
    },{
      title:req.body.title,
      user:req.userInfo._id.toString(),
      desciption:req.body.desc,
      path:req.body.path
    }).then(function () {
      res.render('admin/success',{
          userInfo:req.userInfo,
          message:'轮播图修改成功',
          url:'/admin/swiper',
          urlText: '轮播图列表'
        })
    })

})

//轮播图删除
router.get('/swiper/delete',function (req,res) {
  var id = req.query.id || '';
  Swiper.deleteOne({
    _id:id
  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'删除成功',
      url:'/admin/swiper',
      urlText: '轮播图列表'
    });
  })
})

//链接管理
router.get('/link',function (req, res, next) {
  //limiy()限制获取的用户条数
  //skip()忽略数据的查询
  var page = Number(req.query.page) || 1;
  var limit = 5;
  var pages = 0;
  Link.countDocuments().then(function(count){
      //计算总页数向上取整
      //console.log('object',count);
      pages = Math.ceil(count / limit);
      //page 取值不能超过pages,去总页和page中的最小值
      page = Math.min(page,pages);
      page = Math.max(page,1);
      //console.log('object',page);
      var skip = (page - 1) * limit;
      //从数据中读取所以的用户数据
      Link.find().sort({_id:-1}).limit(limit).skip(skip).then(function(links){
        //console.log(links);
        res.render('admin/link_index',{
          userInfo: req.userInfo,
          links: links,
          page: page,
          count: count,
          pages: pages,
          limit: limit
        });
      });
    });
});
router.get('/link/add',function(req,res){
	res.render('admin/link_add',{
		userInfo:req.userInfo
	})
})
//链接添加保存
router.post('/link/add',function(req,res){
  if (req.body.username == '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'标题不能为空',
      url: 'admin/link',
      urlText:'链接列表'
    })
    return
  }
  Link.findOne({
    title: req.body.title
  }).then(function (title) {
    if (title) {
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'已经存在标题',
        url: 'admin/link',
        urlText:'链接列表'
      });
      return Promise.reject();
    }else{
    //没有存在标题保存到数据库
    return new Link({
      category: req.body.category,
      title: req.body.title,
      link: req.body.link,
      sort: req.body.sort
    }).save();
  }
  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'添加成功',
      url: '/admin/link',
      urlText:'链接列表'
    })
  })
})
//链接的修改
router.get('/link/edit',function (req,res) {
  //获取要修改分类的信息，用表单展示出来
  var id = req.query.id || '';
  //获取要修改的分类信息
  Link.findOne({
    _id:id
  }).then(function (links) {
    //console.log(users);
    if (!links) {
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'链接不存在',
        url:'/admin/link',
        urlText:'链接列表'
      })
    }else{
      res.render('admin/link_edit',{
        userInfo:req.userInfo,
        links:links
      });
    }
  })
})
//链接修改
router.post('/link/edit',function (req,res) {
  //console.log('object',req.body);
  var id = req.query.id || '';
  Link.findOne({
    _id:id
  }).then(function (links) {
      return Link.updateOne({
        _id:id,
      },{
        category: req.body.category,
        title: req.body.title,
        link: req.body.link,
        sort: req.body.sort
      })

  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'修改成功',
      url:'/admin/link',
      urlText:'链接列表'
    });
  })
})
// 链接删除
router.get('/link/delete',function (req,res) {
  var id = req.query.id || '';
  Link.deleteOne({
    _id:id
  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'删除成功',
      url:'/admin/link',
      urlText:'链接列表'
    });
  })
})

//通知管理
router.get('/notice',function (req, res, next) {
  //limiy()限制获取的用户条数
  //skip()忽略数据的查询
  var page = Number(req.query.page) || 1;
  var limit = 5;
  var pages = 0;
  Notice.countDocuments().then(function(count){
      //计算总页数向上取整
      //console.log('object',count);
      pages = Math.ceil(count / limit);
      //page 取值不能超过pages,去总页和page中的最小值
      page = Math.min(page,pages);
      page = Math.max(page,1);
      //console.log('object',page);
      var skip = (page - 1) * limit;
      //从数据中读取所以的用户数据
      Notice.find().sort({sort:-1}).limit(limit).skip(skip).then(function(notices){
        //console.log(notices);
        res.render('admin/notice_index',{
          userInfo: req.userInfo,
          notices: notices,
          page: page,
          count: count,
          pages: pages,
          limit: limit
        });
      });
    });
});
//通知添加
router.get('/notice/add',function(req,res){
	res.render('admin/notice_add',{
		userInfo:req.userInfo
	})
})
//通知添加保存
router.post('/notice/add',function(req,res){
  if (req.body.username == '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'标题不能为空',
      url: 'admin/notice',
      urlText:'通知列表'
    })
    return
  }
  Notice.findOne({
    title: req.body.title
  }).then(function (title) {
    if (title) {
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'已经存在标题',
        url: 'admin/notice',
        urlText:'通知列表'
      });
      return Promise.reject();
    }else{
    //没有存在标题保存到数据库
    return new Notice({
      title: req.body.title,
      link: req.body.link,
      sort: req.body.sort
    }).save();
  }
  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'添加成功',
      url: '/admin/notice',
      urlText:'通知列表'
    })
  })
})
//通知的修改
router.get('/notice/edit',function (req,res) {
  //获取要修改分类的信息，用表单展示出来
  var id = req.query.id || '';
  //获取要修改的分类信息
  Notice.findOne({
    _id:id
  }).then(function (notices) {
    //console.log(users);
    if (!notices) {
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'通知不存在',
        url:'/admin/notice',
        urlText:'通知列表'
      })
    }else{
      res.render('admin/notice_edit',{
        userInfo:req.userInfo,
        notices:notices
      });
    }
  })
})
//链接修改
router.post('/notice/edit',function (req,res) {
  //console.log('object',req.body);
  var id = req.query.id || '';
  Notice.findOne({
    _id:id
  }).then(function (notices) {
      return Notice.updateOne({
        _id:id,
      },{
        title: req.body.title,
        link: req.body.link,
        sort: req.body.sort
      })

  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'修改成功',
      url:'/admin/notice',
      urlText:'通知列表'
    });
  })
})
// 链接删除
router.get('/notice/delete',function (req,res) {
  var id = req.query.id || '';
  Notice.deleteOne({
    _id:id
  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'删除成功',
      url:'/admin/notice',
      urlText:'通知列表'
    });
  })
})

//网站设置
router.get('/setting',function(req,res){
  Setting.findOne({
    name:'setting'
  }).then(function(setting){
    res.render('admin/setting',{
      userInfo:req.userInfo,
      setting:setting
    })
    //console.log('setting',setting);
  })
})
router.post('/setting',function(req,res){
  if (req.body.title == '') {
    req.render('admin/error',{
      userInfo:req.userInfo,
      message:'标题不能为空',
      url:'javascript:window.history.back()',
      urlText: '网站设置'
    })
    return;
  }
  if (req.body.logopath == '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'图片不能为空',
      url:'javascript:window.history.back()',
      urlText: '网站设置'
    })
    return;
  }
  if (req.body.copyright == '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'图片不能为空',
      url:'javascript:window.history.back()',
      urlText: '网站设置'
    })
    return;
  }
  //保存
  Setting.updateOne({
    name:'setting'
  },{
    user:req.userInfo._id.toString(),
    logopath:req.body.logopath,
    title:req.body.title,
    blogname:req.body.blogname,
    occupation:req.body.occupation,
    email:req.body.email,
    localtion:req.body.localtion,
    concernpath:req.body.concernpath,
    copyright:req.body.copyright,
  }).then(function () {
    res.render('admin/success',{
        userInfo:req.userInfo,
        message:'修改成功',
        url:'/admin/setting',
        urlText: '网站设置'
      })
  })
})
module.exports = router;
