//创建一个Swiper的模型类
//实际操作的是通过操作模型类对数据库操作

var mongoose = require('mongoose');
var SwiperSchema = require('../shcemas/swiper');

module.exports = mongoose.model('Swiper',SwiperSchema);
