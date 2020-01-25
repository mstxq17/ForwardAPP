'use strict';

/**
 * 用户逻辑处理函数封装
 * autho: xq17
 * time: 2020-01-17 16:04:00
 */

var db = require('../lib/sqlite.js');
var etcd = require('../lib/db.js').etcd;
var result = require('../model/response.js');
var utils = require('../lib/utils');

/**
 * [checkLogin 登陆状态checker]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.checkLogin = function(req, res, next) {
    if (!req.session.username) return res.redirect('/');
    // 放行路由
    next();
};

/**
 * [signup 用户注册]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.signup = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var inviteCode = req.body.inviteCode;

    // console.log(username);
    if (inviteCode != '154380808')
        return res.json(result.rsp('CodeError'));
    var stmt = db.prepare('SELECT * from user WHERE username = ?');
    var user = stmt.get(username);
    // console.log(user);
    if(user){
      return res.json(result.rsp('FAILED', '', '用户已存在!'));
    }
    // 开始插入新用户
    var stmt = db.prepare("INSERT INTO user VALUES (null,?,?,?)");
    stmt.run(username, utils.encryptPassword(password), inviteCode);
    return res.json(result.rsp('SUCCESS'));
}

/**
 * [signin 用户登陆]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.signin = function(req, res, next) {
    var username = req.body.username.trim();
    var password = req.body.password.trim();
    var captcha = req.body.captcha;

    // 判断验证码正确
    // console.log(captcha);
    // console.log(req.session.captcha);
    if(req.session.captcha.toLowerCase() != captcha.toLowerCase())
    {
      return res.json(result.rsp('CaptchError'));
    }
    var stmt = db.prepare('SELECT password from user WHERE username = ?');
    var user = stmt.get(username);
    if(user){
      var pass = user.password;
      if(utils.validatePassword(password, pass))
      {
        // 设置session
        req.session.username = username;
        return res.json(result.rsp('SUCCESS'));
      }
    }
    return res.json(result.rsp('LoginNameOrPassWordError'));
}

/**
 * [changePass 修改用户密码]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.changePass = function (req, res, next) {
  var username = req.session.username;
  var password = req.body.password.trim();
  var stmt = db.prepare("update user set password = ? where username=?");
  stmt.run(utils.encryptPassword(password), username);
  return res.json(result.rsp('SUCCESS'));
};


/**
 * [info 获取用户名信息]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.info = function (req, res, next) {
  console.log("ok");
  return res.json(result.rsp('SUCCESS', req.session.username));
};

/**
 * [status description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.status= function (req, res, next) {
  var username = req.session.username;
  var stmt = db.prepare('SELECT * from domain WHERE username = ?');
  var taskList = stmt.all(username);
  console.log(taskList);
  return res.json(result.rsp('SUCCESS', taskList));
};

exports.delDomain= function (req, res, next) {
  var id = req.body.id;
  var domain = req.body.domain;
  // console.log(id);
  var stmt = db.prepare('delete from domain WHERE id = ? and Domain= ?');
  try{
    stmt.run(id, domain);
    var kdir = '/services/test/' + domain +'/';
    var key = kdir + 'url';
    console.log(kdir, key);
    try{
        etcd.rmdir(kdir);
        etcd.del(key);
        return res.json(result.rsp('SUCCESS'));
    }catch(e)
    {
         return res.json(result.rsp('FAILED'));
    }
  }catch(e)
  {
    console.log(e);
    return res.json(result.rsp('FAILED'));
  }
};
/**
 * [signout 注销登陆]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.signout = function (req, res, next) {
  delete req.session.username;
  return res.redirect('/');
};
