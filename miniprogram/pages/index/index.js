//index.js
var config = require('../../config')
var util = require('../../utils/util.js')
var authRESULT = require('../../utils/authRESULT')
var authGET = require('../../utils/authGET')
var authTIME = require('../../utils/authTIME')
const { $Message } = require('../../dist/base/index');

var app = getApp();
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
Page({
    data: {
        userInfo: {},
        logged: false,taskNULL:false,todayNULL:false,todayPNULL:false,
        takeSession: false,
        requestResult: '',button:"success",
        loading: true,clearTimer: false,taskidstring:'',
        nowTimestamp:0,deadline:[],beginline:[],deadline_P:[],beginline_P:[],
        taskToday:{
            id:[],
            beginTimestamp:[],
            endTimestamp:[],
            Detail:new Array,
        },
        planToday:{
            id:0,
            beginTimestamp:0,
            endTimestamp:0,
            Detail:new Array,
        },
        importance: ['重要','一般','次要'],
    },

    onLoad: function(){
        wx.getSetting({
            success: function(res) {
                console.log(res)
                if(res.authSetting["scope.userInfo"] != true)
                    wx.reLaunch({
                        url: '../init/init',
                    })
            }
        })
        let that = this
        app.listenLoading(function (res) {
            console.log("cadsfaa",app.globalData.token)
            that.setData({
                loading: false,
            })
            if(app.globalData.token == null){
                $Message({
                    content: '服务器维护中',
                    type: 'error'
                });
            }
            
        })
    },
    onReady:function(){
        this.setData({
            nowTimestamp:new Date().getTime()
         });
        console.log("now",this.data.nowTimestamp)
    },
    onPullDownRefresh: function () {   
        let that = this;
        app.listenLoading(function (res) {
            that.onTODAY() 
         }) 
       
      },
    stopPullDownRefresh(){
        wx.stopPullDownRefresh()
     },
    onShow:function(){
        var that = this
        app.listenLoading(function (res) {
           that.onTODAY() 
           //that.onRESULTS()
           that.onPOST()
        }) 
    },
    onPOST:function(){
        var that = this
        authTIME.authGET({
            url : "",
            data: {
                "dow":1,
            },
            success: function (res) {
                //console.log("get",res)
                if(res.data.periods.length<=0){
                    for(var i =1;i<8;i++){
                        authTIME.authPOST({
                            data: {
                                "dayOfWeek": i,
                                "periods": [{startScale: 2, endScale: 10}]
                            },
                            success: function (res) {
                                console.log("post",res)
                            },
                            fail: function (res) {
                                console.log(res)
                            }
                        })
                    }
                }
            },
            fail: function (res) {
                console.log(res)
            }
        })            
        
        },
      onTODAY: function () { 
        var that = this
        authRESULT.authTODAY({
            url : "task",
            success: function (res) {
                var _taskid=[],_beginline=[],_endline=[],_begin_wxml=[],_dead_wxml=[]
                if(res.statusCode <300 && res.data.length>0){
                    for(var i =0;i < res.data.length;i++){
                        var datee = res.data[i].end;
                        datee = new Date(datee.replace(/-/g, '/'))
                        var y = datee.getFullYear();
                        var m = datee.getMonth()+1;
                        var d = datee.getDate();
                        var h = datee.getHours();
                        var mn= datee.getMinutes();
                        var dateb = res.data[i].begin;
                        dateb = new Date(dateb.replace(/-/g, '/'))
                        var yy = dateb.getFullYear();
                        var mm = dateb.getMonth()+1;
                        var dd = dateb.getDate();
                        var hh = dateb.getHours();
                        var mmnn= dateb.getMinutes();
                        if(dd == new Date(that.data.nowTimestamp).getDate()){
                            var ddl1 = '今天'+formatNumber(hh)+':'+formatNumber(mmnn)
                        }
                        else{
                            var ddl1 = '明天'+formatNumber(hh)+':'+formatNumber(mmnn)
                        }
                        if(d == new Date(that.data.nowTimestamp).getDate()){
                            var ddl = '今天 '+formatNumber(h)+':'+formatNumber(mn)
                        }
                        else{
                            var ddl = '明天 '+formatNumber(h)+':'+formatNumber(mn)
                        }                     
                        _beginline.push(new Date(res.data[i].begin.replace(/-/g, '/')).getTime())
                        _endline.push(new Date(res.data[i].end.replace(/-/g, '/')).getTime())
                        _taskid.push(res.data[i].taskId)
                        _begin_wxml.push(ddl1)
                        _dead_wxml.push(ddl)
                    }
                    that.setData({
                        'taskToday.id':_taskid,
                        taskidstring:_taskid.join(','),
                        'taskToday.beginTimestamp': _beginline,
                        'taskToday.endTimestamp':_endline,
                        deadline:_dead_wxml,
                        beginline:_begin_wxml,
                    })
                    //console.log("beginT",that.data.taskToday.beginTimestamp)
                    //console.log("end",that.data.taskToday.endTimestamp)
                    console.log('todayTask',that.data.taskToday)
                    that.onGETDETAIL()
                }
                else{
                    that.setData({
                        todayNULL:true,
                        'taskToday.id':'',
                        'taskToday.beginTimestamp': [],
                        'taskToday.endTimestamp':[],
                        deadline:0,
                        beginline:0,
                    })
                    console.log("NULL")
                }
            },
            fail: function (res) {
                console.log(res)
            }
        })
        authRESULT.authTODAY({
            url : "plan",
            success: function (res) {
                var _planid=[],_beginline=[],_endline=[],_begin_wxml=[],_dead_wxml=[]
                if(res.statusCode <300 && res.data.length>0){
                    for(var i =0;i < res.data.length;i++){
                        var datee =res.data[i].end;
                        datee = new Date(datee.replace(/-/g, '/'))
                        var y = datee.getFullYear();
                        var m = datee.getMonth()+1;
                        var d = datee.getDate();
                        var h = datee.getHours();
                        var mn= datee.getMinutes();
                        var dateb = res.data[i].begin;
                        dateb = new Date(dateb.replace(/-/g, '/'))
                        var yy = dateb.getFullYear();
                        var mm = dateb.getMonth()+1;
                        var dd = dateb.getDate();
                        var hh = dateb.getHours();
                        var mmnn= dateb.getMinutes();
                        if(dd == new Date(that.data.nowTimestamp).getDate()){
                            var ddl1 = '今天'+formatNumber(hh)+':'+formatNumber(mmnn)
                        }
                        else{
                            var ddl1 = '明天'+formatNumber(hh)+':'+formatNumber(mmnn)
                        }
                        if(d == new Date(that.data.nowTimestamp).getDate()){
                            var ddl = '今天 '+formatNumber(h)+':'+formatNumber(mn)
                        }
                        else{
                            var ddl = '明天 '+formatNumber(h)+':'+formatNumber(mn)
                        }
                        _beginline.push(new Date(res.data[i].begin.replace(/-/g, '/')).getTime())
                        _endline.push(new Date(res.data[i].end.replace(/-/g, '/')).getTime())
                        _planid.push(res.data[i].taskId)
                        _begin_wxml.push(ddl1)
                        _dead_wxml.push(ddl)
                    }
                    that.setData({
                        'planToday.id':_planid,
                        planidstring:_planid.join(','),
                        'planToday.beginTimestamp':_beginline,
                        'planToday.endTimestamp':_endline,
                        deadline_P:_dead_wxml,
                        beginline_P:_begin_wxml,
                    })
                    //console.log("beginP",that.data.planToday.beginTimestamp)
                    //console.log("end",that.data.planToday.endTimestamp)
                    //console.log("开始",new Date(res.data[0].begin).getHours(), new Date(res.data[0].begin).getMinutes())
                    console.log('todayPlan',that.data.planToday)
                    that.onGETDETAILP()
                }
                else{
                    that.setData({
                        todayPNULL:true,
                        'planToday.id':'',
                        'planToday.beginTimestamp': 0,
                        'planToday.endTimestamp':0,
                        deadline_P:[],
                        beginline_P:[],
                    })
                    console.log("PNULL")
                }
            },
            fail: function (res) {
                console.log(res)
            }
        })
      },
      /*
      onRESULTS: function () { 
        var that = this
        authRESULT.authRESULTS({
            url : "task",
            success: function (res) {
                console.log("results",res)
                var _taskid=[],_beginline_R=[]
                if(res.data != "" ){
                    for(var i = 0;i<res.data.taskResultList.length;i++){ 
                        var yy =  new Date(res.data.taskResultList[i].begin).getFullYear();
                        var mm = new Date(res.data.taskResultList[i].begin).getMonth()+1;
                        var dd = new Date(res.data.taskResultList[i].begin).getDate();
                        var hh = new Date(res.data.taskResultList[i].begin).getHours();
                        var mmnn= new Date(res.data.taskResultList[i].begin).getMinutes();
                        ddl1 = yy+'年'+mm+'月'+dd+'日'+hh+'时'+mmnn+'分'
                        _taskid.push(res.data.taskResultList[i].taskId)
                        _beginline_R.push(ddl1)
                    }    
                    that.setData({
                        'taskResult.id':_taskid,  
                        
                        beginline_R:_beginline_R,
                    })
                    //console.log(that.data.taskResult.id,that.data.beginline_R)
                    that.onGETDETAIL()
                }
                else{
                    that.setData({
                        loading:false,
                        taskNULL:true,
                        'taskResult.id':'',  
                        taskidstring:'',
                        beginline_R:0,
                    })
                }
               
            },
            fail: function (res) {
                console.log(res)
            }
        })
        authRESULT.authRESULTS({
            url : "plan",
            success: function (res) {
                console.log("resultsPlan",res)
                var _planid=[],_beginline_P=[]
                if(res.data != "" ){
                    for(var i = 0;i<res.data.planResultList.length;i++){ 
                        var yy =  new Date(res.data.planResultList[i].begin).getFullYear();
                        var mm = new Date(res.data.planResultList[i].begin).getMonth()+1;
                        var dd = new Date(res.data.planResultList[i].begin).getDate();
                        var hh = new Date(res.data.planResultList[i].begin).getHours();
                        var mmnn= new Date(res.data.planResultList[i].begin).getMinutes();
                        ddl1 = yy+'年'+mm+'月'+dd+'日'+hh+'时'+mmnn+'分'
                        _planid.push(res.data.planResultList[i].taskId)
                        _beginline_P.push(ddl1)
                    }    
                    that.setData({
                        'planResult.id':_planid,  
                        planidstring:_planid.join(','),
                        beginline_P:_beginline_P,
                    })
                    //console.log(that.data.taskResult.id,that.data.beginline_R)
                    that.onGETDETAILP()
                }
                else{
                    that.setData({
                        loading:false,
                        taskNULL:true,
                        'planResult.id':'',  
                        planidstring:'',
                        beginline_P:0,
                    })
                }
               
            },
            fail: function (res) {
                console.log(res)
            }
        })
      },*/
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
                'taskToday.Detail':res.data,
              })
              that.stopPullDownRefresh()
          },
          fail: function (res) {
              console.log(res)
          }
      })
    },
    onGETDETAILP:function(){
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
                'planToday.Detail':res.data,
              })
              that.stopPullDownRefresh()
          },
          fail: function (res) {
              console.log(res)
          }
      })
    },
    handleClick:function(){
        if(this.data.button == "success") {
            var that = this
            authRESULT.authMARK({
            url : "task",
            data:{
                "id":this.data.taskToday.id[0],
                "date":this.data.taskToday.beginTimestamp[0]
              },
              success: function (res) {
                  console.log("mark",res.data)
              },
              fail: function (res) {
                  console.log(res)
              }
        })
            wx.showToast({
                title: "已完成",
                icon:"success",
                duration: 2000
            })
            this.setData({
                button:"disabled"
            })
        }
    },
    handleClickP:function(){
        if(this.data.button == "success") {
            var that = this
            authRESULT.authMARK({
            url : "plan",
            data:{
                "id":this.data.planToday.id[0],
                "date":this.data.planToday.beginTimestamp[0]
              },
              success: function (res) {
                  console.log("mark",res.data)
              },
              fail: function (res) {
                  console.log(res)
              }
        })
            wx.showToast({
                title: "已完成",
                icon:"success",
                duration: 2000
            })
            this.setData({
                button:"disabled"
            })
        }
    }
})

    /*// 用户登录示例
    bindGetUserInfo: function () {
        if (this.data.logged) return;
        if(app.globalData.token != null){
            wx.getUserInfo({
                success: function(res){
                    console.log(res.rawData);
                }
            });
        }
    },

    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },

    doRequest: function () {
        util.showBusy('请求中...')
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success (result) {
                util.showSuccess('请求成功完成')
                console.log('request success', result)
                that.setData({
                    requestResult: JSON.stringify(result.data)
                })
            },
            fail (error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        }
        if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
            qcloud.request(options)
        } else {    // 使用 wx.request 则不带登录态
            wx.request(options)
        }
    },

    // 上传图片接口
    doUpload: function () {
        var that = this

        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res){
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]

                // 上传图片
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',

                    success: function(res){
                        util.showSuccess('上传图片成功')
                        console.log(res)
                        res = JSON.parse(res.data)
                        console.log(res)
                        that.setData({
                            imgUrl: res.data.imgUrl
                        })
                    },

                    fail: function(e) {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function(e) {
                console.error(e)
            }
        })
    },

    // 预览图片
    previewImg: function () {
        wx.previewImage({
            current: this.data.imgUrl,
            urls: [this.data.imgUrl]
        })
    },

    // 切换信道的按钮
    switchChange: function (e) {
        var checked = e.detail.value

        if (checked) {
            this.openTunnel()
        } else {
            this.closeTunnel()
        }
    },

    openTunnel: function () {
        util.showBusy('信道连接中...')
        // 创建信道，需要给定后台服务地址
        var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

        // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
        tunnel.on('connect', () => {
            util.showSuccess('信道已连接')
            console.log('WebSocket 信道已连接')
            this.setData({ tunnelStatus: 'connected' })
        })

        tunnel.on('close', () => {
            util.showSuccess('信道已断开')
            console.log('WebSocket 信道已断开')
            this.setData({ tunnelStatus: 'closed' })
        })

        tunnel.on('reconnecting', () => {
            console.log('WebSocket 信道正在重连...')
            util.showBusy('正在重连')
        })

        tunnel.on('reconnect', () => {
            console.log('WebSocket 信道重连成功')
            util.showSuccess('重连成功')
        })

        tunnel.on('error', error => {
            util.showModel('信道发生错误', error)
            console.error('信道发生错误：', error)
        })

        // 监听自定义消息（服务器进行推送）
        tunnel.on('speak', speak => {
            util.showModel('信道消息', speak)
            console.log('收到说话消息：', speak)
        })

        // 打开信道
        tunnel.open()

        this.setData({ tunnelStatus: 'connecting' })
    },


     //点击「发送消息」按钮，测试使用信道发送消息
    
    sendMessage() {
        if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
        // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
        if (this.tunnel && this.tunnel.isActive()) {
            // 使用信道给服务器推送「speak」消息
            this.tunnel.emit('speak', {
                'word': 'I say something at ' + new Date(),
            });
        }
    },

 
    //点击「关闭信道」按钮，关闭已经打开的信道
 
    closeTunnel() {
        if (this.tunnel) {
            this.tunnel.close();
        }
        util.showBusy('信道连接中...')
        this.setData({ tunnelStatus: 'closed' })
    }*/
