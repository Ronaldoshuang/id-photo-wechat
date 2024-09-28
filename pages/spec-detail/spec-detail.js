const { generateBase64AlphaPhoto } = require("../../api/photo.js");
const { compress } = require("../../utils")
var app = getApp()

Page({
    data: {},
    onLoad: function(e) {
        app.globalData.spec.bg_colors= ["white", "lightblue", "blue", "red", "gray"];
        this.setData({
            data: app.globalData.spec
        });
    },
    takeAPhoto: function() {
        wx.navigateTo({
            url: "../camera/camera"
        });
    },
    pickAPhoto: function() {
      console.log("1")
        wx.chooseMedia({
            count: 1,
            mediaType: 'image',
            sourceType: [ "album" ],
            success: result => {
                wx.showLoading({
                    title: "图片检测中"
                });
                const {
                  pix_height,
                  pix_width
                } = this.data.data
                var file = result.tempFiles[0];
                compress(file.tempFilePath, 1024*1024, 80, path=> {
                    wx.uploadFile({
                        url: 'https://ai-zjz.cn/api/idphoto',
                        filePath: path, //imgSrc是微信小程wx.chooseImage等图片选择接口生成图片的tempFilePaths，无论后端能接收多少个这里都只能放一个，这是这个接口的限制
                        name: 'input_image',   //后端接收图片的字段名
                        //请求头
                        header: {
                            'content-type': 'multipart/form-data',
                        },
                        //携带的其他参数可以放在这
                        formData: {
                            width: pix_width,
                            height: pix_height,
                        },
                        success(res) {
                            app.globalData.alphaImage =JSON.parse(res.data).image_base64_hd;
                            wx.hideLoading()
                            wx.redirectTo({
                                url: "../preview/preview"
                            });
                        }
                    })
                })
            }
        })
    }
});