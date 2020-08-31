const app = getApp()
var authPOST = require('../../utils/authPOST')
var authGET = require('../../utils/authGET')
var authPATCH = require('../../utils/authPATCH')
var authDELETE = require('../../utils/authDELETE')
var authRESULT = require('../../utils/authRESULT')
var util = require('../../utils/util.js')

var USERPREF = {
    availableTime:Array(),
    forbiddenTime:Array(),
    preferTime:0,//上午下午晚上
    remindAdvance:5,//提前几分钟提醒
};
var USERPLAN = {
    planlist:Array(),
    AssignedPlanlist:Array(),
    UnassignedPlanlist:Array(),
}
var USERTASK = {
    tasklist:Array(),
    AssignedTasklist:Array(),
    UnassignedTasklist:Array(),
}
function PLAN(){
    this.description=Array();
    this.toDoDays=-1;
    this.doneDays=-1;
    this.eachTimeConsume=-1;
    this.totalTimeConsume=-1;
    this.completeProgress=-1;//完成进度
    this.bookingTime=Array();
}
function TASK(){
    this.description=Array();
    this.deadLine=-1;
    this.expectTimeConsume=-1;//剩余需分配时间
    this.iscompleted=0;//完成进度
    this.importantDegree=-1;//重要程度
    this.bookingTime=Array();
    this.preference=0;//偏好
}

Page({
    data: {
        queryResult:[],//数据库记录查询存储
        userpref:USERPREF,
        userplan:USERPLAN,
        usertask:USERTASK,
    },

  onLoad: function () {//当加载页面时执行的程序，执行用户信息获取，数据库查找
    this.onQuery();//数据库查找是否已经有过创建记录
  },
  onReady:function(){
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时
    var h = date.getHours();
    //分
    var m = date.getMinutes();
    //秒
    var s = date.getSeconds();
    console.log(Y+M+D+h+m+s)
  },
  onQuery: function () {
    console.log(new Date('2018-09-04 15:46:13'.replace(/-/g,"/")).getTime())
  },
  onPOST: function () { 
    let that = this;
    authPOST.authPOST({    
        url : "plan",
        data: {
            "description":["模电作业"],
            "deadline":1536047173000,
            "importantDegree":1.0,
            "preference":0,
            "singleMin":0,
            "singleMax":2,
            "duration":1,
            "mutexPeriod":1,
        },
        success: function (res) {
            console.log(res)
        },
        fail: function (res) {
            console.log(res)
        }
    })
  },
  onGET: function () { 
    authGET.authGET({
        url : "plan",
        data: {
            "id":88,
        },
        success: function (res) {
            console.log(res)
        },
        fail: function (res) {
            console.log(res)
        }
    })
  },
  onGETALL: function () { 
    authGET.authGETALL({
        url : "plan",
        data: {
        },
        success: function (res) {
            console.log(res)
        },
        fail: function (res) {
            console.log(res)
        }
    })
  },
  onPATCH: function () { 
    authPATCH.authPATCH({
        url:"plan",
        data:{
            'id':88,
            'patch':[
              {"op": "replace", "path": "/importantDegree", "value": 55 },
              {"op": "replace", "path": "/singleMax", "value": 7 },
          ],
        },
        success: function (res) {
            console.log(res)
        },
        fail: function (res) {
            console.log(res)
        }
    
    })
  },
  onDELETE: function () { 
    authDELETE.authDELETE({
      url:"plan",
      data:{
        "id":[89],
      },
      success: function (res) {
          console.log(res)
      },
      fail: function (res) {
          console.log(res)
      }
  
  })
  },
  onTODAY: function () { 
    authRESULT.authTODAY({
        url : "task",
        success: function (res) {
            console.log(res)
        },
        fail: function (res) {
            console.log(res)
        }
    })
  },
  buttonPOST:function(){
    this.onPOST()
  },
  buttonGET:function(){
    this.onGET()
  },
  buttonGETALL:function(){
    this.onGETALL()
  },
  buttonPATCH:function(){
    this.onPATCH()
  },
  buttonDELETE:function(){
    this.onDELETE()
  },
  buttonTODAY:function(){
    this.onTODAY()
  },
  
})