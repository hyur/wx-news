let util = require('../../utils/util');
const newsTypeMap=['gn','gj','cj','yl','js','ty','other'];
Page({
  data:{
    navbar: ['国内', '国际', '财经', '娱乐', '军事', '体育','其他'],
    currentTab:0,
    hotNews:'',
    news:'',
    hasMore:true,
    scrollHeight:0
  },
  onLoad: function () {
    this.getNews();
    this.getSystemInfo();
  },
  // 滚到顶部
  upper: function () {
    this.getNews();
  }, 
  // 获取系统信息
  getSystemInfo(){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight:res.windowHeight
        });
      }
    });
  },
  //页面跳转
  onNewDetailById(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id,
    })
  },
  // 滑动切换
  swiperTab:function(e){
    this.setData({
      currentTab:e.detail.current
    })
    let changeType = e.detail.source;
    if (changeType=='touch'){
       this.getNews();
    }
  },
  // 点击切换
  clickTab:function(e){
    if(this.data.currentTab===e.target.dataset.current){
      return;
    }else{
      this.setData({
        currentTab:e.target.dataset.current
      })
    }
    this.getNews();
  },
  // 获取新闻
  getNews() {
    this.setData({
      hasMore: true
    });
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: newsTypeMap[this.data.currentTab]
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        let result = res.data.result;
        this.setTimeAndImgUrl(result);
        this.setData({
          hotNews: result[0],
          news: result.slice(1)
        })
      },
      complete: () => {
        this.setData({hasMore:false})
      }
    })
  },
  // 设置时间格式和解决图片路径不全问题
  setTimeAndImgUrl(result){
    result.forEach((item) => {
      item.date = util.formatTime(item.date);
      item.source=item.source===''?'暂无来源':item.source;
      let img = item.firstImage;
      // 默认图片的url
      let defaultImgUrl = '';
      // 判断图片为null或者路径不全
      item.firstImage = img === null ? defaultImgUrl:(!img.split('/')[0]?'http:'+img:img);
    })
  }
})