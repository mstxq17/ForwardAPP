/**
 * 配置文件
 */


const path = require('path');

// 运行环境  development 或 production
exports.env = 'development';

// 监听端口
exports.port = 3000;

// 管理界面的域名，转发的域名CNAME到以下地址
exports.host = '127.0.0.1';

// 日志样式
exports.logger = 'dev';

// 密匙
exports.secret = {
  cookie:     'Cookie secret'
};

// 应用根目录
exports.appDir = path.dirname(require.main.filename) + '/../';
// console.log(exports.appDir);

// Redis服务器配置
exports.redis = {
  db:         1,                // 数据库号
  port:       6379,             // 端口
  host:       'rd',      // 主机
  prefix:     'UF:',            // 前缀
  sessionTtl: 86400             // Session存活时间
};

// etcd  数据库配置
exports.etcdUrl = 'http://127.0.0.1:2379';

// Sqlite3 数据库配置
exports.sqlite = {
    file: 'ForwarApp', //数据库文件名
}
