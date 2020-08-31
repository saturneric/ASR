// miniprogram/pages/information/submit/submit.js
var authPOST = require('../../../utils/authPOST')
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    complain: [{id: 1,name: '漏洞反馈',}, {id: 2,name: '功能建议'}],
    current: '漏洞反馈',
    type: 0,
    nickname:'',
    emali:'',
    text:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
              })
              app.globalData.userInfo=this.data.userInfo
              console.log(app.globalData.userInfo);
              
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

  handleComplainChange: function({ detail = {} }) {
    var index=0
    if(detail.value == "漏洞反馈") index=0
    else if (detail.value == "功能建议") index=1
    this.setData({
        type: index,
        current:detail.value,
    });
    console.log('chang_type', this.data.type) 
  },

  bindNickNameBlur(e) {
    console.log('nickname发生改变，携带值为', e.detail.detail.value)
    this.setData({
        nickname:  e.detail.detail.value
    })
    console.log('nickname值为', this.data.nickname)
  },
  bindEmailBlur(e) {
    console.log('email发生改变，携带值为', e.detail.detail.value)
    this.setData({
        emali:  e.detail.detail.value
    })
    console.log('email值为', this.data.emali)
  },
  bindTextBlur(e) {
    console.log('text发生改变，携带值为', e.detail.detail.value)
    this.setData({
        text:  e.detail.detail.value
    })
    console.log('text值为', this.data.text)
  },
  handleSubmit() {
    authPOST.authPOST({    
      url : "user/submit",
      data: {
          "type":this.data.type,
          "text":this.data.text
      },
      success: function (res) {
          console.log(res)
          wx.reLaunch({
            url: '../information',
          })
          wx.showToast({
            title: '创建成功',
            icon:"success",
            duration: 2000
          })
      },
      fail: function (res) {
          console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})