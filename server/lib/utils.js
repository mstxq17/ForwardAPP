'use strict';

/**
 * 工具函数
 */

var crypto = require('crypto');
var config = require('../config');

// 声明文件操作系统对象
var fs = require('fs');

/**
 * 32位MD5加密
 *
 * @param {string} text 文本
 * @return {string}
 */
var md5 = exports.md5 = function (text) {
  return crypto.createHash('md5').update(text).digest('hex');
};

/**
 * 加密密码
 *
 * @param {string} password
 * @return {string}
 */
exports.encryptPassword = function (password) {
  var random = md5(Math.random() + '' + Math.random()).toUpperCase();
  var left = random.substr(0, 2);
  var right = random.substr(-2);
  var newpassword = md5(left + password + right).toUpperCase();
  return [left, newpassword, right].join(':');
};

/**
 * 验证密码
 *
 * @param {string} password 待验证的密码
 * @param {string} encrypted 密码加密字符串
 * @return {bool}
 */
exports.validatePassword = function (password, encrypted) {
  var random = encrypted.toUpperCase().split(':');
  if (random.length < 3) return false;
  var left = random[0];
  var right = random[2];
  var main = random[1];
  var newpassword = md5(left + password + right).toUpperCase();
  return newpassword === main;
};

/**
 * 渲染html页面
 */

exports.renderHTML = function(req, res, html){
  res.set('Content-Type', 'text/html'); 
  var htmlPath = config.appDir + '/views/' + html +'.html';
  // console.log(htmlPath);
  fs.readFile(htmlPath, 'utf-8', function(err, data){
    if(err){
      throw err;
    }
    res.end(data);
  });
}