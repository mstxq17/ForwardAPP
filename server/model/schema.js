/**
 * 初始化数据库表结构
 * 记录下一个坑,就是使用user 的时候总是缓存不能更新,应该是连接没断开(ps.没用)
 * 然后卑微的我改了better-sqlite3来使用
 * 该文件是废弃文件,可以删除
 */


var sqliteDB = require('../lib/sqlite.js');

/**
 * 用户表 user
 * column: id username password invitecode
 */

exports.init = function() {
    /**
     * 用户表 user
     * column: id username password invitecode
     */
    var createUserTableSql = "create table if not exists user(`id` integer primary key autoincrement,`username` varchar(255) not null,`password` varchar(255) not null,`inviteCode` varchar(255) not null);";
    // console.log(createUserTableSql);
    sqliteDB.createTable(createUserTableSql);

    /**
     * 用户表 domain
     * column: username Domain ip port satus
     */
    var createDomainTableSql = "create table if not exists domain(`id` integer primary key autoincrement,`username` varchar(255) not null,`Domain` varchar(255) not null,`ip` varchar(100) not null,`port` varchar(50) not null,`status` varchar(255) not null);";
    // console.log(createDomainTableSql);
    sqliteDB.createTable(createDomainTableSql);
}
exports.init();