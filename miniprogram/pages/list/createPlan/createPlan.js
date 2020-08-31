// pages/create/create.js
const app = getApp()
var authPOST = require('../../../utils/authPOST')
var authGET = require('../../../utils/authGET')
var authPATCH = require('../../../utils/authPATCH')
var util = require('../../../utils/util.js')
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minitue = ['00分','30分'];
//获取年
for (let i = date.getFullYear(); i <= date.getFullYear() + 1; i++) {
    years.push("" + i+'年');
  }
for (let i = 1; i <= 12; i++) {
    if (i < 10) {
      i = "0" + i;
    }
    months.push("" + i+'月');
}
for (let i = 1; i <= 31; i++) {
    if (i < 10) {
      i = "0" + i;
    }
    days.push("" + i+'日');
}
for (let i = 0; i < 24; i++) {
    if (i < 10) {
      i = "0" + i;
    }
    hours.push("" + i+'时'); 
}
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
Page({
    data: {
      multiArray: [years, months,days, hours, minitue],
      multiIndex: [0, 9, 16, 10, 17],
      choose_year: '',
      hh:"\n",
      description:new Array,
      dscp:'',

      ddl_time:'',
      deadline:0,
      importance: [{id: 1,name: '重要',}, {id: 2,name: '一般'}, {id: 3,name: '次要'}],
      current: '一般',importantDegree:1,
      prefer_time: [{id: 0,name: '任意'},{id: 1,name: '早上',}, {id: 2,name: '中午'}, {id: 3,name: '晚上'}],
      pt_current: '任意',pref_index:-1,

      singleMin:0,
      dd:0,duration:0,//所需时间块
      mutexPeriod:0,

      position: 'left',
      checked: false,
      disabled: false,
      error: '',

    },
    onLoad: function(options) {
        //设置默认的年份
        this.setData({
          choose_year: this.data.multiArray[0][0]
        })
    },
    onReady:function(){
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        var n = timestamp * 1000;
        var date = new Date(n);
        this.setData({ 
            multiIndex:[date.getFullYear(),date.getMonth(),date.getDate(),date.getHours()+1, 0],
            ddl_time:[date.getFullYear(),date.getMonth()+1,date.getDate()].map(formatNumber).join('-')+' '+[date.getHours()+1, 00].map(formatNumber).join(':'),
        })
        console.log(this.data.ddl_time)
    },
    bindDescriptionBlur(e) {
        console.log('description发送改变，携带值为', e.detail.detail.value)
        let dscptn = new Array
        dscptn.push(e.detail.detail.value)
        this.setData({
            description: dscptn
        })
        console.log('description值为', this.data.description)
    },
    bindMultiPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          multiIndex: e.detail.value
        })
        const index = this.data.multiIndex;
        const year = this.data.multiArray[0][index[0]].slice(0,4);
        const month = this.data.multiArray[1][index[1]].slice(0,2);
        const day = this.data.multiArray[2][index[2]].slice(0,2);
        const hour = this.data.multiArray[3][index[3]].slice(0,2);
        const minute = this.data.multiArray[4][index[4]].slice(0,2);
        //console.log(`${year}-${month}-${day} ${hour}:${minute}`);
        this.setData({
          ddl_time: year + '-' + month + '-' + day + ' ' + hour + ':' + minute
        })
        console.log(this.data.ddl_time);
    },
      
    bindMultiPickerColumnChange: function(e) {
        //获取年份
        if (e.detail.column == 0) {
          let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
          console.log(choose_year);
          this.setData({
            choose_year
          })
        }
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        if (e.detail.column == 1) {
          let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
          let temp = [];
          if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
            for (let i = 1; i <= 31; i++) {
              if (i < 10) {
                i = "0" + i;
              }
              temp.push("" + i+'日');
            }
            this.setData({
              ['multiArray[2]']: temp
            });
          } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
            for (let i = 1; i <= 30; i++) {
              if (i < 10) {
                i = "0" + i;
              }
              temp.push("" + i+'日');
            }
            this.setData({
              ['multiArray[2]']: temp
            });
          } else if (num == 2) { //判断2月份天数
            let year = parseInt(this.data.choose_year);
            console.log(year);
            if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
              for (let i = 1; i <= 29; i++) {
                if (i < 10) {
                  i = "0" + i;
                }
                temp.push("" + i+'日');
              }
              this.setData({
                ['multiArray[2]']: temp
              });
            } else {
              for (let i = 1; i <= 28; i++) {
                if (i < 10) {
                  i = "0" + i;
                }
                temp.push("" + i+'日');
              }
              this.setData({
                ['multiArray[2]']: temp
              });
            }
          }
          //console.log(this.data.multiArray[2]);
        }
        var data = {
          multiArray: this.data.multiArray,
          multiIndex: this.data.multiIndex
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        this.setData(data);
    },

    handleImportantChange({ detail = {} }) {
        var imptdg=0
        if(detail.value == "重要") imptdg=0
        else if (detail.value == "一般") imptdg=1
        else imptdg=2
        this.setData({
            current: detail.value,
            importantDegree:imptdg,
        });
        console.log('importantDegree', this.data.importantDegree) 
    },
    
    handlePrefChange({ detail = {} }) {
        var pref=-1
        if(detail.value == "任意") pref=-1
        else if (detail.value == "早上") pref=0
        else if (detail.value == "中午") pref=1
        else pref=2
        this.setData({
            pt_current: detail.value,
            pref_index:pref,
        });
        console.log('pref_index', this.data.pref_index) 
    },
    
    bindDurationBlur(e){
        console.log('pref发送改变，携带值为', e.detail.detail.value)
        if(Number.isInteger(e.detail.detail.value*1)){
            this.setData({
                dd: e.detail.detail.value
            })
            console.log('dd值为', this.data.dd)
        }
        else{
          this.setData({
            error:  '输入必须为整数',  
          })
        }
    },
    bindSingleMinBlur(e){
        console.log('singleMin发送改变，携带值为', e.detail.detail.value)
        if(Number.isInteger(e.detail.detail.value*2)){
            if (e.detail.detail.value>0){
                this.setData({
                    singleMin: e.detail.detail.value*2
                })
                console.log('singleMin值为', this.data.singleMin)
            }
        }
        else{
          this.setData({
            error:  '输入必须为0.5的倍数', 
          })
        }
        
    },
    bindMutexPeriodBlur(e){
        console.log('mutexPeriod发送改变，携带值为', e.detail.detail.value)
        if(Number.isInteger(e.detail.detail.value*48)){
            if (e.detail.detail.value>0){
                 this.setData({
                    mutexPeriod: e.detail.detail.value*48
                })
                console.log('mutexPeriod值为', this.data.mutexPeriod)
            }    
        }
        else{
          this.setData({
            error: '输入必须为0.5的倍数',   
          })
        }
    },
    onPOST: function () { 
        let that = this
        authPOST.authPOST({    
            url : "plan",
            data: {
                "description":this.data.description,
                "deadline":this.data.deadline,
                "importantDegree":this.data.importantDegree+1,
                "preference":this.data.pref_index,
                "singleMin":this.data.singleMin,
                "duration":this.data.duration,
                "mutexPeriod":this.data.mutexPeriod,
            },
            success: function (res) {
                console.log(res)
            },
            fail: function (res) {
                console.log(res)
            }
        })
      },
    surebutton :function (options) {
        var timestamp = Date.parse(new Date());
        this.setData({
            duration:this.data.dd*this.data.singleMin,
            deadline:new Date(this.data.ddl_time.replace(/-/g,"/")).getTime(),
        })
        if(this.data.duration<=0 || this.data.mutexPeriod <= 0){
          this.setData({
            error:  '请完善计划信息！',   
          })
        }
        else if((this.data.deadline-timestamp)<31536000000){
            var that = this
            wx.showModal({//弹窗提示二次确认
                title: '提示',
                content: '确定创建吗',
                success: function (res) {
                  if (res.confirm) {
                    that.onPOST()
                    wx.reLaunch({
                        url: '../list',
                    })
                    wx.showToast({
                        title: '创建成功',
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
            error: '时间跨度需小于一年',
          })
        }
    }
})
