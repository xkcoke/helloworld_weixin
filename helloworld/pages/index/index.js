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
  },
  onPullDownRefresh(){
    this.getNow(wx.stopPullDownRefresh())
  },
  onLoad(){
    this.getNow()
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
        console.log(result)
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
      url: '/pages/list/list',
    })
  }
})