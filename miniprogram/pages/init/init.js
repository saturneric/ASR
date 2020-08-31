// miniprogram/pages/init/init.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  imgLoad1(res) {
    this.setData({
      loading:false,
    })
  },

  /*微信授权登陆 */
  getuserinfo:function(e){
    if(e.detail.userInfo){
    console.log('授权通过')
    app.globalData.userInfo = e.detail.userInfo
    console.log( app.globalData.userInfo)
    wx.reLaunch({
      url: '../index/index',
    })
    }else{
    console.log('拒绝授权')
    wx.showModal({
        title: '真香警告！'
    })
    }
  },

  noneLoading(res){

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