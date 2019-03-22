$(document).ready(function() {
  initAuthor();//权限初始化
});

function initAuthor() {
  /*权限初始化*/
  var $author = $('.ihovers');
  var $authorA = $('.ihovers a');
  //debugger
  $authorA.attr("disabled",true);
  $authorA.css("pointer-events","none");
  $author.css("cursor","not-allowed");
  $author.attr("title","您没有权限^_^");

  /*模拟权限*/
  var have = ['integrated', 'epms', 'tims', 'socs'];

  /*判断权限*/
  for (var i = 0; i < have.length; i++) {
      //console.log(i, have[i]);
      var $noa = '.' + have[i];
      if ($authorA.is($noa)) {
          $($noa).attr("disabled",false);
          $($noa).css("pointer-events","");
          $($noa).parent().css("cursor","pointer");
          $($noa).parent().attr("title","");
      }
  }
}
