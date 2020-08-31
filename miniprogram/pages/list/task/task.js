// pages/plan/plan.js
const app = getApp()
var authGET = require('../../../utils/authGET')
var authPATCH = require('../../../utils/authPATCH')
var authDELETE = require('../../../utils/authDELETE')

Page({
  data: {
    changed:false,
    hiddenmodalput1:true,
    hiddenmodalput2:true,
    hiddenmodalput3:true,
    hiddenmodalput4:true,
    hiddenmodalput5:true,
    taskid:0,
    hh:"\n",
    description:new Array,
    ddl_time:'',
    year:[2020,2021],
    month:['01','02','03','04','05','06','07','08','09','10','11','12'],
    day:['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
    hour:['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
    mniute:['00','30'],
    y:0,m:0,d:0,h:0,mn:0,
    deadline:0,
    importance: ['重要','一般','次要'],
    importantDegree:1,
    preference:['任意','早上','下午','晚上'],
    pref_index:0,
    singleMin:0,singleMax:0x7fffffff,
    duration:0,//所需时间块
    error: ''
    
  },
  onLoad: function (e) {
    console.log(e);
    this.setData({
      taskid:e.taskid
    })
  },
  onReady: function () { 
    this.setData({
      nowTimestamp:new Date().getTime()
    });
    this.onGET()
  },
  onGET: function () {
    var that = this; 
    authGET.authGET({
        url : "task",
        data: {
            "id":this.data.taskid,
        },
        success: function (res) {
            console.log(res)
            that.setData({
              description:res.data.description,

              y:new Date(res.data.deadline.replace(/-/g, '/')).getFullYear()-2020,
              m:new Date(res.data.deadline.replace(/-/g, '/')).getMonth(),
              d:new Date(res.data.deadline.replace(/-/g, '/')).getDate()-1,
              h:(new Date(res.data.deadline.replace(/-/g, '/')).getHours()+new Date(res.data.deadline.replace(/-/g, '/')).getMinutes()/30)%24,
              mn:(new Date(res.data.deadline.replace(/-/g, '/')).getMinutes()/30+1)%2,
              importantDegree:res.data.importantDegree-1,
              pref_index:res.data.preference+1,
              singleMin:res.data.singleMin/2,
              singleMax:res.data.singleMax/2,
              duration:res.data.duration/2,
            })
            console.log("h",that.data.h,"mn",that.data.mn);
        },
        fail: function (res) {
            console.log(res)
        }
    })
  },
  onPATCH: function () { 
    authPATCH.authPATCH({
        url:"task",
        data:{
            'id':parseInt(this.data.taskid),
            'patch':[
              {"op": "replace", "path": "/description", "value": this.data.description },
              {"op": "replace", "path": "/deadline", "value":this.data.deadline },
              {"op": "replace", "path": "/importantDegree", "value": 1*this.data.importantDegree+1 },
              {"op": "replace", "path": "/preference", "value": this.data.pref_index-1 },
              {"op": "replace", "path": "/singleMax", "value": this.data.singleMax*2 },
              {"op": "replace", "path": "/singleMin", "value": this.data.singleMin*2 },
              {"op": "replace", "path": "/duration", "value": this.data.duration*2 },
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
      url:"task",
      data:{
        "id":[parseInt(this.data.taskid)],
      },
      success: function (res) {
          console.log(res)
      },
      fail: function (res) {
          console.log(res)
      }
  
  })
  },
  modalinput1:function(){  
    this.setData({  
       hiddenmodalput1: !this.data.hiddenmodalput1  
    })  
  }, 
  modalinput2:function(){  
    this.setData({  
       hiddenmodalput2: !this.data.hiddenmodalput2  
    })  
  }, 
  modalinput3:function(){  
    this.setData({  
       hiddenmodalput3: !this.data.hiddenmodalput3  
    })  
  }, 
  modalinput4:function(){  
    this.setData({  
       hiddenmodalput4: !this.data.hiddenmodalput4  
    })  
  },  
  modalinput5:function(){  
    this.setData({  
       hiddenmodalput5: !this.data.hiddenmodalput5  
    })  
  },

  cancel: function(){  
    this.setData({  
        hiddenmodalput1: true,
        hiddenmodalput2: true,
        hiddenmodalput3: true,
        hiddenmodalput4: true, 
        hiddenmodalput5: true,
    });  
  },  
  confirm: function(){  //确认  
    this.setData({  
      hiddenmodalput1: true,
      hiddenmodalput2: true,
      hiddenmodalput3: true,
      hiddenmodalput4: true, 
      hiddenmodalput5: true,
      
    })  
  },
  bindDescriptionBlur(e) {
    console.log('description发送改变，携带值为', e.detail.detail.value)
    if(e.detail.detail.value != ''){
        let dscptn = new Array
        dscptn.push(e.detail.detail.value)
        this.setData({
            changed:true,
            description: dscptn,
        })
        console.log('description值为', this.data.description)
    }
  },

  bindYearBlur(e){
    console.log('y发送改变，携带值为', e.detail.value)
    this.setData({
        changed:true,
        y: e.detail.value
    })
    console.log('year值为', this.data.year[this.data.y])
  },
  bindMonthBlur(e){
    console.log('m发送改变，携带值为', e.detail.value)
    this.setData({
        changed:true,
        m: e.detail.value
    })
    console.log('month值为', this.data.month[this.data.m])
  },
  bindDayBlur(e){
    console.log('d发送改变，携带值为', e.detail.value)
    this.setData({
        changed:true,
        d: e.detail.value
    })
    console.log('day值为', this.data.day[this.data.d])
  },
  bindHourBlur(e){
    console.log('h发送改变，携带值为', e.detail.value)
    this.setData({
        changed:true,
        h: e.detail.value
    })
    console.log('hour值为', this.data.hour[this.data.h])
  },
  bindMniuteBlur(e){
    console.log('mn发送改变，携带值为', e.detail.value)
    this.setData({
        changed:true,
        mn: e.detail.value
    })
    console.log('hour值为', this.data.mniute[this.data.mn])
  },
  
  

bindImptChange(e){
    console.log('impt发送选择改变，携带值为', e.detail.value)
    this.setData({
        changed:true,
        importantDegree: e.detail.value
    }) 
    console.log('importantDegree', this.data.importantDegree) 
  },
bindPrefChange(e){
  console.log('pref发送改变，携带值为', e.detail.value)
  this.setData({
      changed:true,
      pref_index: e.detail.value
  })
  console.log('preference值为', this.data.pref_index)
},
bindDurationBlur(e){
  if(e.detail.detail.value != ''){
    if(Number.isInteger(e.detail.detail.value*2)){
        this.setData({
            changed:true,
            duration: e.detail.detail.value
        })
        console.log('duration值为', this.data.duration)
    }
    else{
      this.setData({
        error: '输入必须为0.5的倍数',
      })
    }
  }
},
bindSingleMinBlur(e){
  console.log('singleMin发送改变，携带值为', e.detail.detail.value)
  if(e.detail.detail.value != ''){
    if(Number.isInteger(e.detail.detail.value*2)){

        if(e.detail.detail.value>0){
            this.setData({
                changed:true,
                singleMin: e.detail.detail.value
            })
            console.log('singleMin值为', this.data.singleMin)
        }
        else{
            this.setData({
                changed:true,
                singleMin:0
            })
            console.log('singleMin值为', this.data.singleMin)
        }
    }
    else{
      this.setData({
        error: '输入必须为0.5的倍数',
      })
    }
  }
},
bindSingleMaxBlur(e){
  console.log('singleMax发送改变，携带值为', e.detail.detail.value)
  if(e.detail.detail.value != ''){
    if(Number.isInteger(e.detail.detail.value*2)){
        if (e.detail.detail.value>0){
             this.setData({
                changed:true,
                singleMax: e.detail.detail.value
            })
            console.log('singleMax值为', this.data.singleMax)
        } 
        else if(e.detail.detail.value == 0 || e.detail.detail.value >9999) {
            this.setData({
                changed:true,
                singleMax: 0x7fffffff
            })
            console.log('singleMax值为', this.data.singleMax)
        }
    }
    else{
      this.setData({
        error:  '输入必须为0.5的倍数',
      })
    }
  }
},

deletebutton :function (options) {
    var that = this
    wx.showModal({//弹窗提示二次确认
        title: '提示',
        content: '确定删除吗',
        success: function (res) {
          if (res.confirm) {
            that.onDELETE()
            wx.reLaunch({
                url: '../list',
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
surebutton :function (options) {
    var timestamp = new Date().getTime();
    var ddl =this.data.year[this.data.y]+'-'+this.data.month[this.data.m]+'-'+this.data.day[this.data.d]+' '+this.data.hour[this.data.h-(parseInt(this.data.mn)+1)%2]+':'+this.data.mniute[(parseInt(this.data.mn)+1)%2]
    this.setData({
        "deadline":new Date(ddl.replace(/-/g,"/")).getTime(), 
    })
    if((this.data.deadline-this.data.nowTimestamp)<31536000000){
        var that = this
        wx.showModal({//弹窗提示二次确认
            title: '提示',
            content: '确定修改吗',
            success: function (res) {
            if (res.confirm) {
                that.onPATCH()
                wx.reLaunch({
                    url: '../list',
                })
                wx.showToast({
                    title: '修改成功',
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
    else{
      this.setData({
        error:  '时间跨度需小于一年',
      })
    }
}

})
