const app = getApp()
var auth = require('./auth')
var config = require('../config')

function authTODAY(object){
  var that = this;
  var authObj = auth.authCodeGenerator;
  authObj.updateTimestamp();
  wx.request({
      method: "GET",
      url: config.hostUrl+'/'+object.url+"/today",
      data: object.data,
      header:{
          'openid': app.globalData.openid,
          'X-Requested-With': '',
          'timestamp': authObj.timestamp,
          'signed': authObj.signed(app.globalData.openid, app.globalData.token)
      },
      success: object.success,
      fail:object.fail,
  });
}
async function authRESULTS(object){
  var that = this;
  var authObj = auth.authCodeGenerator;
  authObj.updateTimestamp();
  wx.request({
      method: "GET",
      url: config.hostUrl+'/'+object.url+"/results",
      data: object.data,
      header:{
          'openid': app.globalData.openid,
          'X-Requested-With': '',
          'timestamp': authObj.timestamp,
          'signed': authObj.signed(app.globalData.openid, app.globalData.token)
      },
      success: object.success,
      fail:object.fail,
  });
}
async function authMARK(object){
  var that = this;
  var authObj = auth.authCodeGenerator;
  authObj.updateTimestamp();
  wx.request({
      method: "POST",
      url: config.hostUrl+'/'+object.url+"/mark",
      data: object.data,
      header:{
          'openid': app.globalData.openid,
          'X-Requested-With': '',
          'timestamp': authObj.timestamp,
          'signed': authObj.signed(app.globalData.openid, app.globalData.token)
      },
      success: object.success,
      fail:object.fail,
  });
}
module.exports = {
  authTODAY,
  authRESULTS,
  authMARK,

}