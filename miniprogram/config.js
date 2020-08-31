/**
 * 小程序配置文件
 */

var host = "https://asr.codesdream.com";

// var host = "http://localhost:8087";

var appID = "wx8d9d87cf93f3e918";

var config = {
    loginUrl: host+'/wx/user/'+appID+'/login',
    hostUrl: host
};

module.exports = config;
