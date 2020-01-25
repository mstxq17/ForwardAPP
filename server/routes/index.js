'use strict';
/**
 * router 前端核心路由
 */

var express = require('express');
var config = require('../config');
var utils = require('../lib/utils.js');
var captcha = require('svg-captcha');
var router = express.Router();
// 用户逻辑
var User = require('./user');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  utils.renderHTML(req, res, 'login');
});

/* GET login page  login.html*/
router.get('/login', function(req, res, next) {
  utils.renderHTML(req, res, 'login');
});

/* GET reg page  reg.html */
router.get('/reg', function(req, res, next) {
  utils.renderHTML(req, res, 'reg');
});

/* GET users page  users.html */
router.get('/users',User.checkLogin, function(req, res, next) {
  utils.renderHTML(req, res, 'users');
});

/* GET usersetting page  usersetting.html */
router.get('/usersetting', User.checkLogin, function(req, res, next) {
  utils.renderHTML(req, res, 'usersetting');
});

/* GET domainset page  domainset.html */
router.get('/domainset', User.checkLogin, function(req, res, next) {
  utils.renderHTML(req, res, 'domainset');
});

/* GET status page  status.html */
router.get('/status', User.checkLogin, function(req, res, next) {
  utils.renderHTML(req, res, 'status');
});

/* form validate */
// router.all('/api/*', 
// });

/* Get captch code page */
router.get('/verifCode',(req,res)=>{
  var cap =  captcha.create();
  req.session.captcha = cap.text; // session 存储
  res.type('svg'); // 响应的类型
  res.send(cap.data);
});

module.exports = router;
