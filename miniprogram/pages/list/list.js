// pages/list/list.js
var authGET = require('../../utils/authGET')
var authDELETE = require('../../utils/authDELETE')
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
    taskDetail:new Array,taskddlist:new Array,
    planid:new Array,planidstring:'',
    planDetail:new Array,planddllist:new Array,
    failids:[],failplanids:[],allocstatus:[],Pallocstatus:[],
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
  loading: true,
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
    let that = this;
    
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
    this.onGETALL()

  },
  onRESULTS: function () { 
    var that = this
    authRESULT.authRESULTS({
        url : "task",
        success: function (res) { 
            that.setData({
               failids:res.data.failedIds,
            })
            console.log("failid",that.data.failids)   
        },
        fail: function (res) {
            console.log(res)
        }
    })
    authRESULT.authRESULTS({
      url : "plan",
      success: function (res) { 
          that.setData({
            failplanids:res.data.failedIds,
          })
          console.log("failplanid",that.data.failplanids)   
      },
      fail: function (res) {
          console.log(res)
      }
  })
},
  onGETALL:function () { 
    var that = this
    authGET.authGETALL({
        url : "task",
        data: {
        },
        success: function (res) {
            console.log("返回t",res.data)
            if(res.data.length>0){
                that.setData({
                    loading: false,
                    taskid:res.data,
                    taskidstring:res.data.join(',')
                })
                that.onGETDETAIL();
            }
            else{
                that.setData({
                    loading: false,
                    taskid:res.data,
                    taskidstring:""
                })
            }
        },
        fail: function (res) {
            console.log(res)
        }    
    }),
    authGET.authGETALL({
      url : "plan",
      data: {
      },
      success: function (res) {
            console.log("返回p",res.data)
            if(res.data.length>0){
                that.setData({
                    loading:false,
                    planid:res.data,
                    planidstring:res.data.join(',')
                })
                that.onGETDETAIL();
            }
            else{
                that.setData({
                    loading:false,
                    planid:res.data,
                    planidstring:""
                })
            }
      },
      fail: function (res) {
          console.log(res)
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
            var ddllist = new Array 
            var _alloc =[]
            for(var i = 0;i<res.data.length;i++){
                 var datee = res.data[i].deadline;
                  datee = new Date(datee.replace(/-/g, '/'))
                  var y = datee.getFullYear();
                  var m = datee.getMonth()+1;
                  var d = datee.getDate();
                  var h = datee.getHours();
                  var mn= datee.getMinutes();
                if(mn == 0 || mn == '0'){
                  mn = mn+30;
                  ddllist.push( y+'-'+m+'-'+d+ " " +formatNumber(h)+':'+formatNumber(mn))
                }
                else{
                  mn = 0;
                  h =h+1;
                  ddllist.push( y+'-'+m+'-'+d+ " " +formatNumber(h)+':'+formatNumber(mn))
                }
                var flag = 0
                for(var j = 0;j<that.data.failids.length;j++) {
                    if(res.data[i].id == that.data.failids[j]){flag=1}
                } 
                if(flag){_alloc.push(0)}
                else{_alloc.push(1)}
            }
            that.setData({
                taskDetail:res.data,
                taskddlist:ddllist,
                allocstatus:_alloc
            })
            var that1 = that;
            authGET.authGETDETAIL({
              url : "plan",
              data:{
                "ids":that1.data.planidstring,
              },
              success: function (res) {
                  console.log("planDetail",res.data)
                  var ddllist = new Array
                  var P_alloc=[]
                  for(var i = 0;i<res.data.length;i++){
                    var datee = res.data[i].deadline;
                    datee = new Date(datee.replace(/-/g, '/'))
                    var y = datee.getFullYear();
                    var m = datee.getMonth()+1;
                    var d = datee.getDate();
                    var h = datee.getHours();
                    var mn= datee.getMinutes();
                    if(mn == 0 || mn == '0'){
                      mn = mn+30;
                      ddllist.push( y+'-'+m+'-'+d+ " " +formatNumber(h)+':'+formatNumber(mn))
                    }
                    else{
                      mn = 0;
                      h =h+1;
                      ddllist.push( y+'-'+m+'-'+d+ " " +formatNumber(h)+':'+formatNumber(mn))
                    }
                    var flag = 0
                    for(var j = 0;j<that.data.failplanids.length;j++) {
                        if(res.data[i].id == that.data.failplanids[j]){flag=1}
                    } 
                    if(flag){P_alloc.push(0)}
                    else{P_alloc.push(1)}
                    
                  }
                  that1.setData({
                    planDetail:res.data,
                    planddlist:ddllist,
                    loading: false,
                    Pallocstatus:P_alloc
                  })
                  that1.stopPullDownRefresh()
              },
              fail: function (res) {
                  console.log(res)
              }
            })
        },
        fail: function (res) {
            console.log(res)
        }
    })
  },
  onDELETE: function (e) { 
      var that = this
      authDELETE.authDELETE({
      url:e.target,
      data:{
        "id":[parseInt(e.id)],
      },
      success: function (res) {
          console.log(res)
          that.Query()
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
  goCreateTask :function(){
      this.listenPress();
      wx.navigateTo({
        url: 'createTask/createTask',
      })
  },
  goCreatePlan :function(){
    this.listenPress();
    wx.navigateTo({
      url: 'createPlan/createPlan',
    })
  },
  goTask :function(e){
      console.log(e.currentTarget.dataset.value)
      wx.navigateTo({
        url: 'task/task?taskid='+e.currentTarget.dataset.value,
      })
  },
  goPlan :function(e){
    console.log(e.currentTarget.dataset.value)
    wx.navigateTo({
      url: 'plan/plan?planid='+e.currentTarget.dataset.value,
    })
  },
  deleteTask:function(e){
    var that = this
    wx.showModal({//弹窗提示二次确认
        title: '提示',
        content: '确定删除吗',
        success: function (res) {
          if (res.confirm) {
            that.onDELETE({
                'target':'task',
                'id':e.currentTarget.dataset.value,
            })
            wx.showToast({
                title: '删除成功',
                icon:"success",
                duration: 2000
            })
          } 
          else {
            console.log('弹框后点取消')
          }
        }
    })
  },
  deletePlan:function(e){
    var that = this
    wx.showModal({//弹窗提示二次确认
        title: '提示',
        content: '确定删除吗',
        success: function (res) {
          if (res.confirm) {
            that.onDELETE({
                'target':'plan',
                'id':e.currentTarget.dataset.value,
            })
            wx.showToast({
                title: '删除成功',
                icon:"success",
                duration: 2000
            })
          } 
          else {
            console.log('弹框后点取消')
          }
        }
    })
  }


})
