$(document).ready(function () {
  bgSwiper(); //背景轮播
  loginWay(); //切换登录方式
  inputWay(); //输入框
  msgCode(); //倒计时
  userLogin(); //账号登录
  phoenLogin(); //手机号登录
  $(window).resize(function () { //当浏览器大小变化时
    $('.container_skitter').css({
      'width': '100%',
      'height': '100%'
    });
  });
});

function bgSwiper() {
  $('.box_skitter_large').skitter({
    theme: 'default',
    dots: false,
    label: false, //标签
    navigation: false, //左右控制
    preview: true,
    interval: 25000, //间隔
    with_animations: ['cubeRandom', 'cube', 'paralell', 'glassCube', 'swapBars', 'cubeSize'], //动画效果
    numbers_align: 'center',
  });
}
//切换登录方式
function loginWay() {
  $('.login-maininput .login-maininput_btn').on('click', '.btn__icon', function () {
    var $icon = $(this);
    var $container = $('.container');
    var $tips = $('.btn__tips');
    $('.login__erro').addClass('hidden');
  });
  $(".login-maininput").slide({
    titCell: ".tab .login-maininput_btn",
    mainCell: ".container",
    effect: "fold",
    autoPlay: false
  });
}

function inputWay() {
  // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
  if (!String.prototype.trim) {
    (function () {
      // Make sure we trim BOM and NBSP
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      String.prototype.trim = function () {
        return this.replace(rtrim, '');
      };
    })();
  }

  [].slice.call(document.querySelectorAll('input.input__field')).forEach(function (inputEl) {
    // in case the input is already filled..
    if (inputEl.value.trim() !== '') {
      classie.add(inputEl.parentNode, 'input--filled');
    }

    // events:
    inputEl.addEventListener('focus', onInputFocus);
    inputEl.addEventListener('blur', onInputBlur);
  });

  function onInputFocus(ev) {
    classie.add(ev.target.parentNode, 'input--filled');
  }

  function onInputBlur(ev) {
    if (ev.target.value.trim() === '') {
      classie.remove(ev.target.parentNode, 'input--filled');
    }
  }
}

var countdown;

function msgCode() {
  function invokeSettime(obj) {
    countdown = 60;
    settime(obj);

    function settime(obj) {
      if (countdown == 0) {
        $(obj).attr("disabled", false);
        $(obj).val("获取验证码");
        countdown = 60;
        return;
      } else {
        $(obj).attr("disabled", true);
        $(obj).val("(" + countdown + "s) 重新发送");
        countdown--;
      }
      setTimeout(function () {
        settime(obj)
      }, 1000)
    }
  }
  $('.container').on('click', '.phone_code', function () {
    new invokeSettime(".phone_code");
  });
}

function userLogin() {
  $('.container').on('click', '.user-login', function () {
    //debugger
    //var $ycode = $('#input-ycode').val();

    $.ajax({
      type: 'post',
      url: '/api/user/login',
      data: {
        username: $('#input-user').val(),
        password: $('#input-possword').val(),
        captcha: $('#input-ycode').val()
      },
      dataType: 'json',
      success: function (res) {
        console.log('res', res);
        $('.login__erro').removeClass('hidden');
        $('.erro-txt').text(res.message);
        if (!res.code) {
          setTimeout(function () {
            window.location.reload();
            location.href = "admin";
          }, 800);
        }
      }
    })
  });
  $('body').keypress(function (e) {
    // 回车键事件
    if (e.which == 13) {
      $('body .user-login').click();
    }
  });
}

function phoenLogin() {
  $('.container').on('click', '.phone-login', function () {
    //debugger
    var $ycode = $('#input-msgcode').val();
    if ($ycode == '8z9i') { //模拟短信验证码
      $('.login__erro').addClass('hidden');
      countdown = 0; //重置倒计时
      console.log('userlogin is OK');
    } else {
      $('.login__erro').removeClass('hidden');
      $('.erro-txt').text('短信证码错误！');
      console.log('userlogin not OK');
    }
  })
}
