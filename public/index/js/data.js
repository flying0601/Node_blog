$(function () {
  getNotice();
  dotList();//点击排行
  hotList();//热门推荐
  getYun();//链接
  getLink()
  setTing();//公共信息
})
var datas={}
//console.log('datas',datas);
function dotList() {
    var lists = '';
    $.ajax({
        type: 'post',
        url: '/api/dotlist',
        data: {},
        success: function (res) {
            //debugger
            datas.dotlist = res.data;
            //console.log('dotlist', dotlist);
            datas.dotlist.forEach(function (item, i) {
                //console.log(item, i);
                lists += '<li> <a href="/view?contentid=' + item._id + '&category=index">' + item.title + '</a> <p class="hits"><i class="Hui-iconfont" title="点击量">&#xe6c1;</i> ' + item.views + '° </p> </li>'
            });
            $('#dotlist').html(lists);
        }
    })
}
function hotList() {
    var lists = '';
    $.ajax({
        type: 'post',
        url: '/api/hotlist',
        data: {},
        success: function (res) {
            console.log(res);
            //debugger
            datas.hotlist = res.data;
            //console.log('dotlist', hotlist);
            datas.hotlist.forEach(function (item, i) {
                //console.log(item, i);
                lists += '<li> <a href="/view?contentid='+item._id+'&category=index">'+item.title+'</a> <p class="hits"><i class="Hui-iconfont" title="点击量">&#xe622;</i> '+item.commentsNum+'</p> </li>'
            });
            $('#hotlist').html(lists);
        }
    })
}
function getYun() {
    var lists = '';
    $.ajax({
        type: 'post',
        url: '/api/link',
        data: {category: '标签云'},
        success: function (res) {
            console.log(res);
            //debugger
             datas.yunlist = res.data;
            //console.log('dotlist', hotlist);
            datas.yunlist.forEach(function (item, i) {
                //console.log(item, i);
                lists += '<a href="http://'+item.link+'" target= "_blank">'+item.title+'</a>'
            });
            $('.tags').html(lists);
        }
    });
    //标签
    setTimeout(function (){
        $(".tags a").each(function () {
            var x = 9;
            var y = 0;
            var rand = parseInt(Math.random() * (x - y + 1) + y);
            $(this).addClass("tags" + rand)
        });
    }, 1200);

}
function getLink() {
    var lists = '';
    $.ajax({
        type: 'post',
        url: '/api/link',
        data: {category: '隔壁邻居'},
        success: function (res) {
            console.log(res);
            //debugger
             datas.youlist = res.data;
            //console.log('dotlist', hotlist);
            datas.youlist.forEach(function (item, i) {
                //console.log(item, i);
                lists += '<span><i class="Hui-iconfont">&#xe6f1;</i><a href="http://'+item.link+'" target= "_blank" class="btn-link">'+item.title+'</a></span>'
            });
            $('#youlink').html(lists);
        }
    });

}
function getNotice() {
    var lists = '';
    $.ajax({
        type: 'post',
        url: '/api/notice',
        data: {},
        success: function (res) {
            console.log(res);
            //debugger
             datas.noticelist = res.data;
            //console.log('dotlist', hotlist);
            datas.noticelist.forEach(function (item, i) {
                console.log(item, i);
                lists += '<li><a href="javascript:void(0);">'+item.title+'</a></li>'
            });
            $('#noticelist').html(lists);
        }
    });

}
function setTing() {
    $.ajax({
        type: 'post',
        url: '/api/setting',
        data: {},
        success: function (res) {
            console.log(res);
            //debugger
            datas.setting = res.data;
            console.log('setting', datas.setting);
            //$('#hotlist').html(lists);
            $('#bloglogo').attr('src',datas.setting.logopath);
            $('#blogtitle').text(datas.setting.title);
            $('#blgoname').text(datas.setting.blogname);
            $('#occupation').text(datas.setting.occupation);
            $('#email').append('<a href="'+datas.setting.email+'">'+datas.setting.email+'</a>');
            $('#localtion').html(datas.setting.localtion);
            $('#concernpath').attr('data-original',datas.setting.concernpath);
            $('#foot').html(datas.setting.copyright);
        }
    })
}
