// pages/list/list.js
const DayMap = [
  '周日','周一','周二','周三','周四','周五','周六'
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    forecast:[],
    city:'广州市'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      city:options.city
    })
    console.log(options.city)
    this.getForecast()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getForecast(wx.stopPullDownRefresh())
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  getForecast(callback) {
    let that = this
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        time: new Date().getTime(),
        city: that.city
      },
      success: function (res) {
        let result = res.data.result
        let forecast = []
        let timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000
        for (let i = 0; i < 7; i += 1) {
          timestamp = timestamp + 24 * 60 * 60
          let date = new Date(timestamp * 1000)
          let y = date.getFullYear()
          let m = date.getMonth()
          let d = date.getDate()
          let w = date.getDay()
          forecast.push({
            date: y + '年' + (m + 1) + '月' + d + '日 ' + DayMap[w],
            icon: '/images/' + result[i].weather + '-icon.png',
            temp: result[i].minTemp + '° - ' + result[i].maxTemp + '°'
          })
        }
        that.setData({
          forecast:forecast
        })
      },
      complete: function () {
        callback && callback()
      }
    })
  }
})