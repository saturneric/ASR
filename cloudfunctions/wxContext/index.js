// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: "asr-v3kua"})

// 云函数入口函数
exports.main = async () => {
  const wxContext = cloud.getWXContext()

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
