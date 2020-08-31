// pages/list/list.js
var authGET = require('../../utils/authGET')
var authRESULT = require('../../utils/authRESULT')
const { $Message } = require('../../dist/base/index');

const app = getApp()
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
Page({
  data: {
    taskid:new Array,taskidstring:'',
    taskddllist:new Array, taskbeginlist:new Array,
    planid:new Array,planidstring:'',
    planddllist:new Array, planbeginlist:new Array,
    taskNULL:false,
    current: 'tab1',current_scroll: 'tab1',
    visible2: false,toggle : false,toggle2 : false,
    actions : [
      {
          name : '删除',
          width : 100,
          color : '#fff',
          fontsize : '20',
          icon : 'trash',
          background : '#ed3f14'
      },
      
  ],
  press : false,
  loading: true
  },

  listenPress: function (res) {
    this.setData({
      press: true,
    })
    let that = this;
    setTimeout(function(){
      that.setData({
        press: false,
      })
    },15)
  },


  onLoad: function (e) {
    
  },
  onReady: function () { 

  },
  onShow:function(){
    let that = this;
    app.listenLoading(function (res) {
          that.Query()
      })  
  },
  onPullDownRefresh: function () {   
    let that = this;
    app.listenLoading(function (res) {
      that.Query()
    })
   
  },
  stopPullDownRefresh(){
    wx.stopPullDownRefresh()
    $Message({
      content: '拉取数据成功',
      type: 'success'
    });
  },

  Query:function(){
    this.onRESULTS()
  },
  onRESULTS: function () { 
      var that = this
      authRESULT.authRESULTS({
        url : "task",
        success: function (res) {
            console.log("results",res)
            if(res.data!=""){
              var _taskid=[]
              var _taskddlist = []
              var _taskbeginlist = []
              for(var i = 0;i<res.data.taskResultList.length;i++){ 
                  var datee = res.data.taskResultList[i].end;
                  datee = new Date(datee.replace(/-/g, '/'))
                  var y = datee.getFullYear();
                  var m = datee.getMonth()+1;
                  var d = datee.getDate();
                  var h = datee.getHours();
                  var mn= datee.getMinutes();
                  var dateb = res.data.taskResultList[i].begin;
                  dateb = new Date(dateb.replace(/-/g, '/'))
                  var yy = dateb.getFullYear();
                  var mm = dateb.getMonth()+1;
                  var dd = dateb.getDate();
                  var hh = dateb.getHours();
                  var mmnn= dateb.getMinutes();
                  var ddl = y+'-'+m+'-'+d+ " " +formatNumber(h)+':'+formatNumber(mn)
                  var ddl1 = yy+'-'+mm+'-'+dd+ " " +formatNumber(hh)+':'+formatNumber(mmnn)
                  _taskid.push(res.data.taskResultList[i].taskId)
                  _taskddlist.push(ddl)
                  _taskbeginlist.push(ddl1)
              }   
              that.setData({ 
                  loading:false, 
                  taskid:_taskid,
                  taskidstring:_taskid.join(','),
                  taskddlist:_taskddlist,
                  taskbeginlist:_taskbeginlist,
              }) 
              that.onGETDETAIL()
            }
            else{
              that.setData({ 
                loading:false, 
                taskNULL:true,
            }) 
            }
        },
        fail: function (res) {
            console.log(res)
            that.setData({ 
              loading:false, 
          }) 
        }
      })
      authRESULT.authRESULTS({
        url : "plan",
        success: function (res) {
            console.log("resultsP",res)
            if(res.data!=""){
              var _planid=[]
              var _planddlist = []
              var _planbeginlist = []
              for(var i = 0;i<res.data.planResultList.length;i++){ 
                  var datee = res.data.planResultList[i].end;
                  datee = new Date(datee.replace(/-/g, '/'))
                  var y = datee.getFullYear();
                  var m = datee.getMonth()+1;
                  var d = datee.getDate();
                  var h = datee.getHours();
                  var mn= datee.getMinutes();
                  var dateb = res.data.planResultList[i].begin;
                  dateb = new Date(dateb.replace(/-/g, '/'))
                  var yy = dateb.getFullYear();
                  var mm = dateb.getMonth()+1;
                  var dd = dateb.getDate();
                  var hh = dateb.getHours();
                  var mmnn= dateb.getMinutes();
                  var ddl = y+'-'+m+'-'+d+ " " +formatNumber(h)+':'+formatNumber(mn)
                  var ddl1 = yy+'-'+mm+'-'+dd+ " " +formatNumber(hh)+':'+formatNumber(mmnn)
                  _planid.push(res.data.planResultList[i].taskId)
                  _planddlist.push(ddl)
                  _planbeginlist.push(ddl1)
              }   
              that.setData({ 
                  loading:false, 
                  planid:_planid,
                  planidstring:_planid.join(','),
                  planddlist:_planddlist,
                  planbeginlist:_planbeginlist,
              }) 
              that.onGETPLANDETAIL()
            }
            else{
              that.setData({ 
                loading:false, 
                taskNULL:true,
            }) 
            }
        },
        fail: function (res) {
            console.log(res)
            that.setData({ 
              loading:false, 
          }) 
        }
      })
  },

  onGETDETAIL:function(){
      var that = this
      authGET.authGETDETAIL({
        url : "task",
        data:{
          "ids":this.data.taskidstring,
        },
        success: function (res) {
            console.log("taskDetail",res.data)
            that.setData({
              loading:false,
              taskDetail:res.data,
            })
            that.stopPullDownRefresh()
        },
        fail: function (res) {
            console.log(res)
        }
    })
  },
  onGETPLANDETAIL:function(){
    var that = this
    authGET.authGETDETAIL({
      url : "plan",
      data:{
        "ids":this.data.planidstring,
      },
      success: function (res) {
          console.log("planDetail",res.data)
          that.setData({
            loading:false,
            planDetail:res.data,
          })
          that.stopPullDownRefresh()

      },
      fail: function (res) {
          console.log(res)
      }
  })
},

  handleChange ({ detail }) {
      this.setData({
          current: detail.key
      });
  },
  handleChangeScroll ({ detail }) {
      this.setData({
          current_scroll: detail.key
      });
  },

})
