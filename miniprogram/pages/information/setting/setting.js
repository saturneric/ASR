// pages/information/setting/setting.js
var app = getApp();
var authTIME = require('../../../utils/authTIME')
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
Page({
  data: {
    hiddenmodalput: true,
    current: 'tab1',
    hour:['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],beginhour_index:0,endhour_index:0,
    minute:["00","30"],beginmin_index:0,endmin_index:0,
    week:["","周一","周二","周三","周四","周五","周六","周日"],
    week_index:1,
    FBTimeList:[[{startScale: 0, endScale: 12}],[{startScale: 0, endScale: 12}],[{startScale: 0, endScale: 12}],[{startScale: 0, endScale: 12}],[{startScale: 0, endScale: 12}],[{startScale: 0, endScale: 12}],[{startScale: 0, endScale: 12}],[{startScale: 0, endScale: 12}]],
    actions : [{
        name : '删除',
        width : 100,
        color : '#fff',
        fontsize : '20',
        icon : 'trash',
        background : '#ed3f14'
    }]
  },
  onLoad:function(){
    this.onGET()
  },
  onGET:function(){
    var that = this
    authTIME.authGET({
        url : "",
        data: {
            "dow":this.data.week_index,
        },
        success: function (res) {
            console.log("get",res)
            var FBTL =that.data.FBTimeList
            FBTL.splice(res.data.dayOfWeek,1,res.data.periods)
            that.setData({
                FBTimeList:FBTL
            })
            console.log("FB",that.data.FBTimeList)
        },
        fail: function (res) {
            console.log(res)
        }
    })
  },
  onPOST:function(){
    var that = this
    authTIME.authPOST({
        data: {
            "dayOfWeek": this.data.week_index,
            "periods": this.data.FBTimeList[this.data.week_index]
        },
        success: function (res) {
            console.log("post",res)
            that.onGET()
        },
        fail: function (res) {
            console.log(res)
        }
    })
  },
  handleChange ({ detail }) {
    this.setData({
        current: detail.key,
        week_index:detail.key.substr(-1),
    });
    this.onGET()
  },
  modalinput:function(){  
    this.setData({  
       hiddenmodalput: !this.data.hiddenmodalput  
    })  
  }, 
  cancel: function(){  
    this.setData({  
        hiddenmodalput: true,
    });  
  },  
  confirm: function(){  //确认  
    this.setData({  
      hiddenmodalput: true,    
    })  
    this.goCreateFBtime()
  },
  bindBeginhourChange:function(e){
    this.setData({
        beginhour_index:e.detail.value
    })
    console.log('beginhour值为', this.data.beginhour_index)
  },
  bindEndhourChange:function(e){
    this.setData({
        endhour_index:e.detail.value
    })
    console.log('endhour值为', this.data.endhour_index)
  },
  bindBeginminChange:function(e){
    this.setData({
        beginmin_index:e.detail.value
    })
    console.log('beginmin值为', this.data.beginmin_index)
  },
  bindEndminChange:function(e){
    this.setData({
        endmin_index:e.detail.value
    })
    console.log('endmin值为', this.data.endmin_index)
  },
  goCreateFBtime(e){
    var dayFBTime=this.data.FBTimeList
    var a={
        "startScale":this.data.beginhour_index*2+this.data.beginmin_index*1,
        "endScale":this.data.endhour_index*2+this.data.endmin_index*1,
    }
    dayFBTime[this.data.week_index].push(a)
    this.setData({
        FBTimeList:dayFBTime,
    })
    console.log("FBTimeList",this.data.FBTimeList)
    this.onPOST()
  },
  deleteTime:function(e){
    console.log(e.currentTarget.dataset.value)
    var dayFBTime=this.data.FBTimeList
    dayFBTime[this.data.week_index].splice(e.currentTarget.dataset.value,1)
    this.setData({
        FBTimeList:dayFBTime
    })
    this.onPOST()
  }

})
