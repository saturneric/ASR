const app = getApp()
var auth = require('./auth')
var config = require('../config')

async function authPOST(object){
  var that = this;
  var authObj = auth.authCodeGenerator;
  authObj.updateTimestamp();
  wx.request({
      method: "POST",
      url: config.hostUrl+"/"+object.url,
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
module.exports = {authPOST}