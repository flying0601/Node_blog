//创建一个Swiper的模型类
//实际操作的是通过操作模型类对数据库操作

var mongoose = require('mongoose');
var SettingSchema = require('../shcemas/setting');

module.exports = mongoose.model('Setting',SettingSchema);
