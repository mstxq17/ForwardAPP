'use strict';

/**
 * 解析任务逻辑处理函数封装
 * autho: xq17
 * time: 2020-01-18 15:10:22
 */

var db = require('../lib/sqlite.js');

var result = require('../model/response.js');
var utils = require('../lib/utils');



function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
} 



function filterPORT(port){
    var portReg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
    return portReg.test(port);
}

function isValidDomain(domain){
    var re = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
    return re.test(domain);
}

async function handleTask(username, status){
    console.log("Starting Task:" + username);
    var stmt = db.prepare('SELECT * from task WHERE username = ? and status= ?');
    var taskList = stmt.all(username, status);
}

exports.addTask = function (req, res, next) {
    var username = req.session.username;
    var domain = req.body.domain;
    var ip = req.body.ip;
    var port = req.body.port;
    if(isValidIP(ip) && filterPORT(port) && isValidDomain(domain)){
        var stmt = db.prepare('SELECT * from task WHERE domain = ?');
        if(stmt.get(domain)){
            return res.json(result.rsp('FAILED', '', '域名已经存在!'));
        }
        var status = "starting";
        var stmt = db.prepare("INSERT INTO task VALUES (null,?,?,?,?,?)");
        stmt.run(username, domain, ip, port, status);
        // 丢进任务处理函数
        handleTask(username, status);
        return res.json(result.rsp('SUCCESS'));
    }else{
        return res.json(result.rsp('FAILED', '', '格式错误!'));
    }
};

