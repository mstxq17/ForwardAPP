/**
 * 定义状态码
 */

var ExceptionMsg = {
    "SUCCESS":{code:"000", msg:"操作成功"},
    "FAILED":{code:"999", msg:"操作失败"},
    "LoginNameOrPassWordError":{code:"001", msg:"用户名或者密码错误！"},
    "CodeError":{code:"002", msg:"邀请码错误"},
    "CaptchError":{code:"003", msg:"验证码错误"},
}

exports.getMsg = function(name){
    return ExceptionMsg[name];
}