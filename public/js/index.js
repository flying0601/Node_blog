$(function(){
	var toLogin = $('a.toLogin'),
		toRegister = $('a.toRegister'),
		loginInfo = $('div.loginInfo'),
		registerInfo = $('div.registerInfo'),
		loginBtn = $('input.loginBtn'),
		registerBtn = $('input.registerBtn'),
		registerRemind = $('.registerRemind'),
		loginRemind = $('.loginRemind'),
		showInfo = $('.showInfo');
		loginout = $('.loginout');

	toLogin.on('click',function(){
		registerInfo.hide();
		loginInfo.show();
	})
	toRegister.on('click',function(){
		loginInfo.hide();
		registerInfo.show();
	})
	//注册
	registerBtn.on('click',function(){
		$.ajax({
			type:'post',
			url: '/api/user/register',
			data: {
				username:registerInfo.find('[name="username"]').val(),
				password:registerInfo.find('[name="pwd"]').val(),
				repassword:registerInfo.find('[name="rpwd"]').val()
			},
			dataType: 'json',
			success: function(res){
				registerRemind.html(res.message);//返回提示信息
				if(!res.code){
					setTimeout(function(){
						registerInfo.hide();
						loginInfo.show();
					},1000);//这是1秒延迟跳转
				}
			}
		})
	})
	//登录
	loginBtn.on('click',function(){
		$.ajax({
			type: 'post',
			url: '/api/user/login',
			data: {
				username:loginInfo.find('[name="user2"]').val(),
				password:loginInfo.find('[name="pwd2"]').val()
			},
			dataType: 'json',
			success: function(res){
				console.log('res',res);
				loginRemind.html(res.message);//返回提示信息
				if(!res.code){
					// setTimeout(function(){
					// 	loginInfo.hide();
					// 	showInfo.show();
					// 	showInfo.find('.name').html(res.userInfo.username);
					// 	showInfo.find('.info').html('你好，欢迎光临我的博客');
					// },1000);//这是1秒延迟跳转
					window.location.reload();
					if (res.userInfo.isAdmin) {
						var hosts = location.host;
						location.href= "admin";
						//console.log('object',res);
					}
				}
			}
		})
	})
//退出
loginout.on('click',function () {
		$.ajax({
			url:'/api/user/logout',
			success: function (res) {
				console.log('res',res);
				if(!res.code){
					window.location.reload();
				}
			}
		})
	})
})
