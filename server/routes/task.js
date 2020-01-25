'use strict';

/**
 * 解析任务逻辑处理函数封装
 * autho: xq17
 * time: 2020-01-18 15:10:22
 */

var db = require('../lib/sqlite.js');
var etcd = require('../lib/db.js').etcd;
var dns = require('dns');
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


function checkStatus(u1, u2){
    //后面再进行优化判断规则
    console.log("checking status");
    return 'True'
}

// column: username Domain ip port status
async function handleTask(username, status){
    console.log("Starting Task:" + username);
    var stmt = db.prepare('SELECT * from task WHERE username = ? and status= ?');
    var taskList = stmt.all(username, status);
    taskList.forEach(function(v,i){
        // console.log(v);
        var domain= v.Domain;
        var url = v.ip + ':' + v.port;
        console.log(domain, url);
        // 修改etcd 数据库内容
        var r1 = updateTask(v, domain, url);
        //  更新 domain 表
        var r2 = updateDomain(username, v, domain, url);
    })

}

// 修改etcd 数据库内容
function updateTask(v, d, u){
    var kdir = '/services/test/' + d +'/';
    var key = kdir + 'url';
    // console.log(kdir, key, u);
    try{
        etcd.mkdir(kdir);
        etcd.set(key, u);
        console.log("updateTask in Etcd,Success!");
    }catch(e)
    {
        console.log(e);
    }
}

 //  更新 domain 表
function updateDomain(username, v, d, u){
    var proxy = u;
    var Domain = d.trim();
    var Arecord = '';
    var status = 'True';
    console.log("updateDoamin uping!");
    dns.lookup(Domain, function(err, address, family){
        if(err){
           address = 'error';
        }
        Arecord = address;
        status = checkStatus(d,u);
        var stmt = db.prepare("INSERT INTO domain VALUES (null,?,?,?,?,?)");
        stmt.run(username, Domain, proxy, Arecord, status);
        console.log("updateDomain,Success!");
    });
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

