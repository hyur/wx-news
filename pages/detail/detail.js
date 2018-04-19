Page({
  data:{
    id:'',
    title:'',
    source:'',
    date:'',
    readCount:0,
    content:''
  },
  onLoad:function(options){
    this.setData({
      id:options.id
    })
    this.getNewDetail();
  },
  // 获取新闻详情
  getNewDetail() {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: this.data.id
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let result = res.data.result;
        let title = result.title;
        let source = result.source===''?'暂无来源':result.source;
        let date = this.setTime(result.date);
        let readCount = result.readCount;
        let content = result.content;
        this.setData({
          title, source, date, readCount, content
        })
      }
    })
  },
  // 返回上一页
  navigatorback(){
    wx.navigateBack()
  },
  // 格式化时间
  setTime(date){
    let time = new Date(date);
    let hours = time.getHours();
    let minus = time.getMinutes();
    if(hours<10){
      hours="0"+hours;
    }
    if (minus < 10) {
      minus = '0' + minus;
    }
    return hours+":"+minus;
  }
})