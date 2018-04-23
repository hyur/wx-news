let util = require('../../utils/util');
Page({
  data:{
    id:'',
    title:'',
    source:'',
    date:'',
    readCount:0,
    content:'',
    nodes: []
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
        let date = util.formatTime(result.date);
        let readCount = result.readCount;
        let content = result.content;
        let nodes = this.getNodes(content);
        this.setData({
          title, source, date, readCount, nodes
        })
      }
    })
  },
  // 获取节点
  getNodes(content){
    let nodes = [];
    for (let i = 0; i < content.length; i++) {
      let contentObj = content[i];
      let obj = {
        name: contentObj.type,
        attrs: {
          class: "news-content-" + contentObj.type
        },
        children: [{
          type: "text",
          text: contentObj.text
        }]
      }
      if (contentObj.type == 'image') {
        obj.name = 'img';
        obj.attrs.src = contentObj.src;
      }
      nodes[i] = obj;
    }
    return nodes;
  },
  // 返回上一页
  navigatorback(){
    wx.navigateBack()
  }
})