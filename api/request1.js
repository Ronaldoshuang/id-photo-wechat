import settings from "../settings"

class Request1 {
  constructor(params) {
    this.withBaseURL = params.withBaseURL
    this.baseURL = params.baseURL
  }
  post(url, data) {
    return this.request1('POST', url, data)
  }


  request1(method, url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        method,
        data,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: this.withBaseURL ? this.baseURL + url : url,
        success: (res) => {
          if (res.statusCode >= 400) {
            console.log("http code error, code: " + res.statusCode + ", data: "+ res.data)
            wx.showToast({
              title: '[' + res.statusCode + '] 请求异常，请重试或检查网络！',
              icon: 'none'
            })
            return
          }
          if (res.data.status != 2000) {
            console.log("bussiness code error, data: "+ res.data)
            wx.showToast({
              title: '[' + res.data.status + '] ' + res.data.remark,
              icon: 'none'
            })
            return
          }
          resolve(res.data.data)
        },
        fail: (err) => reject(err),
      })
    })
  }
}

export default new Request1({
  withBaseURL: true,
  baseURL: settings.host.photo,
})
