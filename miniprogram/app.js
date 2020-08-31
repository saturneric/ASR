//app.js
var config = require('./config')
var auth = require('./utils/auth')

App({
    globalData:{    
        token : null,
        openid : null,
        clientCode : '965cda1983f569b03abfb80dc9af8dd8',
        hh:"\n",
        loading: true,
        registerListens: [],
    },
    onLaunch: function () {
        this.login();
    },

    // 认证访问
    authRequest: function(object){
        var that = this;
        var authObj = auth.authCodeGenerator;
        authObj.updateTimestamp();
        wx.request({
            url: object.url,
            header:{
                'openid': that.globalData.openid,
                'X-Requested-With': '',
                'timestamp': authObj.timestamp,
                'signed': authObj.signed(that.globalData.openid, that.globalData.token)
            },

            data: object.data,

            success: object.success,

            fail:object.fail,
       });
    },

    listenLoading:function(method){
        if(this.globalData.loading == false) method();
        else this.globalData.registerListens.push(method)
     },

    login: function(){
        let that = this;
        // 尝试登录
        wx.login({
            complete: (res) => {
                console.log(res);
                wx.request({
                  url: config.loginUrl,
                  method: "GET",
                  data: {
                      code : res.code
                  },
                  success: function(res){
                      // 设置SessionKey
                      that.globalData.token = res.data.token;
                      that.globalData.openid = res.data.openid;
                      console.log("success",that.globalData);
                      console.log("sdaa",res)
                      that.globalData.loading = false;
                      for (const f of that.globalData.registerListens){
                        f();
                      }
                      that.globalData.registerListens = []
                      
                    /*
                      that.authRequest({
                        url : "https://compute.bktus.com",
                        success: function (res) {
                            console.log(res)
                        },
                        fail: function (res) {
                            console.log(res)
                        }
                        });*/
                  },
                  fail: function(res){
                      console.log(res)
                  }
                })
            }
        });
    }
})