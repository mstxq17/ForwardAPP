'use strict';
/**
 * APIrouter  
 * /api/login
 * /api/reg
 * /api/changePass
 * /api/user
 * /api/addTask
 */

var express = require('express');
var config = require('../config');
var utils = require('../lib/utils.js');
var router = express.Router();

// 用户逻辑
var User = require('./user');

// 任务逻辑
var Task = require('./task.js');


// 用户路由
router.post('/login', User.signin);
router.post('/reg', User.signup);
router.get('/logout', User.checkLogin, User.signout);
router.post('/info', User.checkLogin, User.info);
router.post('/changePass', User.checkLogin, User.changePass);


// 任务路由
router.post('/addTask',User.checkLogin, Task.addTask);

router.post('/user',User.checkLogin, function(req, res, next) {
  res.send("hello,login user");
});

module.exports = router;