'use strict';

/**
 * file: db.js
 * redis 数据库连接
 * author: xq17
 * time: 2020-01-17 21:29:30
 */

var redis = require('redis');
var config = require('../config');
var resPort = config.redis.port;     //端口号
var resHost = config.redis.host;     //服务器IP
var resPass = config.redis.pass;     //密码
var resOpt = {auth_pass: resPass};   //redis密码验证

var db = redis.createClient(resPort, resHost, resOpt);
db.select(config.redis.db);

db.on('error', function (err) {
  console.error(err.stack);
});

db.on('end',function(err){
    console.log('end');
});

db.on('error', function (err) {
    console.log(err);
});

db.on('connect',function(){
    console.log('redis connect success!');
});

module.exports = db;
