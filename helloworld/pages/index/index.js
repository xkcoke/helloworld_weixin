const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')

const UNPROMPTED = 0
const UNAUTHORIZED = 1

Page({
  data:{
    city: '广州市',
    nowTemp:'',
    nowWeather:'',
    nowWeatherBackground:'',
    forecastWeatherIcon:'',
    forecast:[],
    nowTime:'',
    tempRange:'',
    locationAuth: UNPROMPTED,
    locationTipsText:'点击获取当前位置',
  },
  onShow(){
    let that = this
    wx.getSetting({
      success: function(res){
        let auth = res.authSetting['scope.userLocation']
        if(auth==true)
          that.setData({
            locationAuth: UNPROMPTED
          })
      }
    })
  },
  onPullDownRefresh(){
    this.getNow(wx.stopPullDownRefresh())
  },
  onLoad(){
    this.qqmapsdk = new QQMapWX({
      key: 'DLOBZ-HJQED-IUF43-PJOMO-PYMC3-TPB2E'
    });
    wx.getSetting({
      success: res=>{
        let auth = res.authSetting['scope.userLocation']
        if(auth)
          this.onTapLocation()
        else
          this.getNow()
      }
    })
    //for test

  },
  getNow(callback){
    var that = this
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: that.data.city
      },
      success: function (res) {
        let result = res.data.result
        let temp = result.now.temp
        let weather = result.now.weather
        that.setData({
          nowTemp: temp,
          nowWeather: weatherMap[weather],
          nowWeatherBackground: '/images/' + weather + '-bg.png'
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })
        //set forecast
        var h = new Date().getHours();
        let forecast = []
        for (let i = 0; i < 8; i+=1){
          let time_fore = h + i * 3
          if(time_fore > 24){
            time_fore = time_fore - 24
            time_fore = "明日" + time_fore
          }
          forecast.push({
            time: time_fore + '时',
            icon: '/images/' + result.forecast[i].weather + '-icon.png',
            temp:result.forecast[i].temp
          })
        }
        forecast[0].time='现在'
        that.setData({
          forecast:forecast
        })
        //set middle item
        let date = new Date()
        let y = date.getFullYear()
        let m = date.getMonth()
        let d = date.getDate()
        let mintemp = result.today['minTemp']
        let maxtemp = result.today['maxTemp']
        that.setData({
          nowTime:y+'年'+(m+1)+'月'+d+'日',
          tempRange:'最低'+mintemp+'°, 最高'+maxtemp+'°',
        })
      },
      complete: function(){
        callback && callback()//if语句简写形式
      }
    })
  },
  onTapSummary(){
    wx.showToast({
      title: '',
    })
    wx.navigateTo({
      url: '/pages/list/list?city='+this.data.city
    })
  },
  onTapLocation(){
    let that = this
    wx.getLocation({
      success: function(res) {
        that.qqmapsdk.reverseGeocoder({
          location:{
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(res){
            let city = res.result.address_component.city
            that.setData({
              city:city,
              locationTipsText:' '
            })
            that.getNow()
          }
        })
      },
      fail: function(){
        that.setData({
          locationAuth: UNAUTHORIZED
        })
      }
    })
  },
})