$(function(){
  //轮播图片
  $('#swiper-save').on('click',function(){
      var myPhoto = $('#img-upload')[0].files[0];
      var oMyForm = new FormData();
      oMyForm.append("title",$('#title').val());
      oMyForm.append("username",'5c788c9f7f4dbe23888f3ea7');
      oMyForm.append("desciption",$('#desc').val());
      oMyForm.append("userfile", myPhoto);
      $.ajax({
          type : 'POST',
          url : '/admin/swiper/add',
          cache : false,  //不需要缓存
          processData : false,    //不需要进行数据转换
          contentType : false, //默认数据传输方式是application,改为false，编程multipart
          data : oMyForm,
          dataType : 'json'
      }).done(function(data){
          console.log(data);
          if (data.code == 0) {
            window.location = "http://localhost:8085/admin/swiper";
            alert(data.message);
            //  $('.message').text(data.messgae);
            //  $('.url').attr('href',data.url);
          }

      }).fail(function(err){
          console.error(err);
      });
  });

  $('#swiper-updata').on('click',function(){
    var myPhoto = $('#img-upload')[0].files[0];
    var oMyForm = new FormData();
    oMyForm.append("title",$('#title').val());
    oMyForm.append("username",'5c788c9f7f4dbe23888f3ea7');
    oMyForm.append("desciption",$('#desc').val());
    oMyForm.append("userfile", myPhoto);
    $.ajax({
        type : 'POST',
        url : '/admin/swiper/edit',
        cache : false,  //不需要缓存
        processData : false,    //不需要进行数据转换
        contentType : false, //默认数据传输方式是application,改为false，编程multipart
        data : oMyForm,
        dataType : 'json'
    }).done(function(data){
        console.log(data);
        if (data.code == 0) {
          window.location = "http://localhost:8085/admin/swiper";
          alert(data.message);
          //  $('.message').text(data.messgae);
          //  $('.url').attr('href',data.url);
        }

    }).fail(function(err){
        console.error(err);
    });
});


});



