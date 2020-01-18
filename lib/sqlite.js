'use strict';

/**
 * file: sqlite.js
 * sqlite 数据库连接
 * author: xq17
 * time: 2020-01-17 21:29:30
 */

var config = require('../config');
var easyDB = require('better-sqlite3');


var DB = DB || {};

DB.easySqlite = function(file){
    var filePath = './' + file + '.db';
    console.log(filePath + " Created success!");
    DB.db = new easyDB(filePath);
}

//创建表
//
DB.easySqlite.prototype.initTable = function(){
    /**
     * 删除表内容
     */
    DB.db.backup(`backup-${Date.now()}.db`)
      .then(() => {
        console.log('backup complete!');
      })
      .catch((err) => {
        console.log('backup failed:', err);
      });
    try{
        var r0 = DB.db.prepare("drop table user;").run();
        var r0 = DB.db.prepare("drop table task").run();
        var r0 = DB.db.prepare("drop table domain").run();
    }catch(e){
        console.log(e);
    }
    /**
     * 用户表 user
     * column: id username password invitecode
     */
    var createUserTableSql = "create table if not exists user(`id` integer primary key autoincrement,`username` varchar(255) not null,`password` varchar(255) not null,`inviteCode` varchar(255) not null);";
    const r1 = DB.db.prepare(createUserTableSql);
    r1.run();

    // console.log(r1);
    /**
     * 域名表 domain
     * column: username Domain ip port satus
     */
    var createDomainTableSql = "create table if not exists domain(`id` integer primary key autoincrement,`username` varchar(255) not null,`Domain` varchar(255) not null,`ip` varchar(100) not null,`port` varchar(50) not null,`status` varchar(255) not null);";
    const r2 = DB.db.prepare(createDomainTableSql);
    r2.run();
    // console.log(r2);

    /**
     * 任务表 task
     * column: username Domain ip port status
     * status: starting finished
     */
    var createTaskTableSql = "create table if not exists task(`id` integer primary key autoincrement,`username` varchar(255) not null,`Domain` varchar(255) not null,`ip` varchar(100) not null,`port` varchar(50) not null,`status` varchar(255) not null);";
    const r3 = DB.db.prepare(createTaskTableSql);
    r3.run();

    // 程序关闭时断开数据库连接
    process.on('exit', () => DB.db.close());
    process.on('SIGHUP', () => process.exit(128 + 1));
    process.on('SIGINT', () => process.exit(128 + 2));
    process.on('SIGTERM', () => process.exit(128 + 15));

}

var db = new DB.easySqlite(config.sqlite.file);
// 初始化表结构
//db.initTable();
// 测试注释,生产环境的话删掉
// var stmt = DB.db.prepare("INSERT INTO user VALUES (null,?,?,?)");
// stmt.run('admin1', 'admin', '12345');
// var stmt = DB.db.prepare('SELECT * from user');
// var stmt = DB.db.prepare("INSERT INTO task VALUES (null,?,?,?,?,?)");
// stmt.run(username, domain, ip, port, status);
// var stmt = DB.db.prepare('SELECT * from user WHERE username = ?');
// var cat = stmt.get('admin1');
// if(cat){
//     console.log(1);
// }
// console.log(cat);
// console.log(stmt.all());
// var stmt = DB.db.prepare('SELECT * from task WHERE  status= ?');
// var taskList = stmt.all("starting");
// console.log(taskList.leng);
module.exports = DB.db;