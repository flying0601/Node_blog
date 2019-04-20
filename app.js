//应用程序的启动入口文件
var express = require('express');//加载express模块
var swig = require('swig');//加载模板处理模块
var app = express();//创建app应用,相当于nodeJS的http.createService()
var mongoose = require('mongoose');//加载数据库模块
var bodyParser = require('body-parser');//加载body-parser处理post提交的数据
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
var ueditor_backend = require('ueditor-backend')//富文本
var Cookies = require('cookies');//加载cookie模块
var User = require('./models/User')



//2配置模板应用模块
app.engine('html', swig.renderFile);//定义当前应用所使用的模板引擎，第一个参数：模板引擎名称，同时也是模板文件的后缀；第二个参数：解析处理模板内容的方法
app.set('views', './views');//设置模板文件存放的目录,第一个参数必须是views，第二个参数是目录
app.set('view engine', 'html')//注册模板，第一个参数：必须是view engine,第二个参数与定义模板引擎的第一个参数名称一致
swig.setDefaults({ cache: false });//第一次读取会把模板缓存到内存当中，下次会直接读取，因此即使改了模板内容刷新也不会有变化，需要在开发过程中需要取消模板缓存
ueditor_backend(app)

//设置静态文件托管
//托管规则：用户发送http请求到后端，后端解析url，找到匹配规则，执行绑定的函数，返回对应的内容，静态文件直接读取制定目录下文件返回给用户，动态文件：处理业务逻辑，加载模板，解析模板返回上数据
app.use('/public',express.static(__dirname + '/public'));//当用户请求的路径ulr以/public开头时，以第二个参数的方式进行处理（直接返回__dirname + '/public'目录下文件）
//设置cookie
app.use(function(req,res,next){
  req.cookies = new Cookies(req,res); //调用req的cookies方法把Cookies加载到req对象里面
  req.userInfo = {};//定义一个全局访问对象
  req.captcha = '';
  //如果浏览器请求有cookie信息，尝试解析cookie
  if(req.cookies.get('userInfo')){
    try{
      req.userInfo = JSON.parse(req.cookies.get('userInfo'));
      //获取当前用户登录的类型，是否是管理员
      User.findById(req.userInfo._id).then(function (userInfo) {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
        // console.log('object',req.userInfo);
        next();
      })
    }catch(e){
      next();
    }
  }else{
    next();
    //console.log('req',req.userInfo);
  }
})

//根据不同的功能模块划分
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect('mongodb://localhost:27017/nodeblog',{useNewUrlParser:true},function (err) {
  if (err) {
    console.log('数据库连接失败！');
  }else{
    console.log('数据库连接SUCCESS！');
    app.listen(8086);//监听http请求
    console.log('http://127.0.0.1:8086');
  }
});

