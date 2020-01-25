/*
 * 微服务返回数据处理
 * author: xq17
 * time:2020-01-17 12:56:20
 */

var ExceptionMsg = require('./ExceptionMsg.js');

exports.rsp = function(name, data = '', msg = ''){
    var Rsp = ExceptionMsg.getMsg(name);
    if(data){
        Rsp['myData'] = data;
    }
    if(msg){
         Rsp['myMsg'] = msg;
    }
    return Rsp;
}