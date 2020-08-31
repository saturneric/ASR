// miniprogram/pages/information/graph/graph.js
var uCharts = require('../../../utils/ucharts/u-charts');
var authCOMP = require('../../../utils/authCOMP')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allFinishRate: 0.00,
    taskFinishRate: 0.00,
    planFinishRate: 0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.showFinishedRate("canvasAllFinishedRate", 
      {
      series: [{
        name: '总完成度',
        data: this.data.allFinishRate,
        color: '#19be6b'
      }]
    });

    this.showFinishedRate("canvasTaskFinishedRate", 
      {
      series: [{
        name: '任务完成度',
        data: this.data.taskFinishRate,
        color: '#2d8cf0'
      }]
    });

    this.showFinishedRate("canvasPlanFinishedRate", 
      {
      series: [{
        name: '计划完成度',
        data: this.data.planFinishRate,
        color: '#ff9900'
      }]
    });

    this.showFunnel("funnelFinished", 
    {
      "series": [{
      "name": "90%-100%",
      "data": 0
      }, {
      "name": "80%-90%",
      "data": 0
      }, {
      "name": "70%-80%",
      "data": 0
      }, {
      "name": "60%-70%",
      "data": 0
      }, {
      "name": "<60%",
      "data": 0
      }]
    });
    this.showColumn("columnNumbered",
    {
      "categories": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      "series": [{
      "name": "已完成",
      "data": [0, {"value": 0,"color": "#f04864"}, 0, 0, 0, 0]
      }, {
      "name": "未完成",
      "data": [0, {"value": 0,"color": "#facc14"}, 0, 0, 0, 0]
      }]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.onQuery()
  },
  onQuery:function(){
    authCOMP.authCOMP({
      url : "total",
      data: {

      },
      success: function (res) {
          console.log("get",res)

      },
      fail: function (res) {
          console.log(res)
      }
  })     
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

  },

  showFunnel: function(canvasId, chartData){
    canvaFunnel=new uCharts({
      $this:this,
      canvasId: canvasId,
      type: 'funnel',
      fontSize:11,
      padding:[15,15,0,15],
      legend:{
        show:true,
        padding:5,
        lineHeight:11,
        margin:0,
      },
      background:'#FFFFFF',
      pixelRatio:this.pixelRatio,
      series: chartData.series,
      animation: true,
      width: 300,
      height: 200,
      dataLabel: true,
      extra: {
        funnel: {
          border:true,
          borderWidth:2,
          borderColor:'#FFFFFF'
        }
      },
    })
  },

  showFinishedRate: function(canvasId, chartData){
    canvasFinishedRate = new uCharts({
      $this:this,
      canvasId: canvasId,
      type: 'arcbar',
      fontSize:11,
      legend:{show:false},
      background:'#FFFFFF',
      pixelRatio:1,
      series: chartData.series,
      animation: true,
      width: 120,
      height: 120,
      dataLabel: true,
      title: {
        name: Math.round(chartData.series[0].data*100)+'%',
        color: chartData.series[0].color,
        fontSize: 25
      },
      subtitle: {
        name: chartData.series[0].name,
        color: '#666666',
        fontSize: 15
      },
      extra: {
        arcbar:{
          type:'default',
          width:10
        }
      }
    });
  },
  
  showColumn : function(canvasId, chartData) {
    canvaColumn=new uCharts({
      $this:this,
      canvasId: canvasId,
      type: 'column',
      legend:{show:true},
      fontSize:11,
      background:'#FFFFFF',
      pixelRatio:1,
      animation: true,
      categories: chartData.categories,
      series: chartData.series,
      xAxis: {
        disableGrid:true,
      },
      yAxis: {
        //disabled:true
      },
      dataLabel: true,
      width: 300,
      height: 210,
      extra: {
        column: {
          type:'group',
          width: 20
        }
        }
    });
  },
  touchColumn(e) {
    canvaColumn.showToolTip(e, {
      format: function (item, category) {
        if (typeof item.data === 'object') {
          return category + ' ' + item.name + ':' + item.data.value
        } else {
          return category + ' ' + item.name + ':' + item.data
        }
      }
    });
  },
})