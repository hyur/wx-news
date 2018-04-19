const newsTypeMap=['gn','gj','cj','yl','js','ty','other'];
Page({
  data:{
    navbar: ['国内', '国际', '财经', '娱乐', '军事', '体育','其他'],
    tabIndex:[0,1,2,3,4,5,6],
    currentTab:0,
    winWidth:0,
    winHeight:0,
    hotnew:'',
    news:'',
    hasMore:true,
    latest_list: [],
    latest_last_id: 0
  },
  onLoad: function () {
    this.getNews();
    this.getSystemInfo();
  },
  // 滑到顶部
  upper: function(e) {
    wx.showNavigationBarLoading()
    this.refresh();
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
    this.setData({
      hasMore:true
    })
    this.getNews();
  },
  refresh: function () {
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 2000
    })
    },
  onPullDownRefresh:function(){
    wx.showLoading({
      title: '正在加载中',
    })
    this.getNews(()=>{
      wx.stopPullDownRefresh();
    });
  },
  // 获取系统信息
  getSystemInfo(){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
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
    this.getNews();
  },
  // 点击切换
  clickTab:function(e){
    this.getNews();
    if(this.data.currentTab===e.target.dataset.current){
      return;
    }else{
      this.setData({
        currentTab:e.target.dataset.current
      })
    }
  },
  // 获取新闻
  getNews(callback) {
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
          hotnew: result[0],
          news: result.slice(1)
        })
      },
      complete: () => {
        callback && callback();
        this.setData({hasMore:false})
      }
    })
  },
  // 设置时间格式和解决图片路径不全问题
  setTimeAndImgUrl(result){
    result.forEach((item) => {
      item.date = this.setTime(item.date);
      item.source=item.source===''?'暂无来源':item.source;
      let first = item.firstImage.split('/')[0];
      if (first === '') {
        item.firstImage = "http:" + item.firstImage;
      }
    })
  },
  // 格式化时间
  setTime(date) {
    let time = new Date(date);
    let hours = time.getHours();
    let minus = time.getMinutes();
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minus<10){
      minus = '0' + minus;
    }
    return hours + ':' + minus;
  }
})