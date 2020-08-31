// pages/information/information.js
var authGET = require('../../utils/authGET')
const app = getApp()
Page({
  
  data: {
    avatarUrl: '../../images/user-unlogin.png',                   
    userInfo: {},
    loading: true,
  },
  onLoad:function(){
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                loading: false,

              })
              app.globalData.userInfo=this.data.userInfo
              console.log(app.globalData.userInfo);
              let that1 = that;
              authGET.authGET({
                url : "user/star",
                data: {
                },
                success: function (res) {
                    console.log(res)
                    that1.setData({
                      star : res.data.starNum,
                      starDescription : res.data.description,
                      loading: false
                    })
                },
                fail: function (res) {
                    console.log(res)
                    that1.setData({
                      star : 0,
                      starDescription : "暂无执行力评价",
                      loading: false
                    })
                }
              })
            }
          })
        }
        else{
          wx.showToast({
            title: '未登录',
            icon:'none',
            duration:2000,
          })
        }
      }
    });
  },
  goSetting :function(){
      wx.navigateTo({
        url: 'setting/setting',
      })
  },
  goHelp :function(){
    wx.navigateTo({
      url: 'help/help',
    })
},
  goGraph :function(){
    wx.navigateTo({
      url: 'graph/graph',
    })
},
  goSubmit :function(){
    wx.navigateTo({
      url: 'submit/submit',
    })
  },
  goAbout :function(){
    wx.navigateTo({
      url: 'about/about',
    })
  }
})
