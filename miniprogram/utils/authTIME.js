const app = getApp()
var auth = require('./auth')
var config = require('../config')

function authGET(object){
  var that = this;
  var authObj = auth.authCodeGenerator;
  authObj.updateTimestamp();
  wx.request({
      method: "GET",
      url: config.hostUrl+"/time/disabled/list",
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
async function authPOST(object){
  var that = this;
  var authObj = auth.authCodeGenerator;
  authObj.updateTimestamp();
  wx.request({
      method: "POST",
      url: config.hostUrl+"/time/disabled/set",
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
  authGET,
  authPOST,
}