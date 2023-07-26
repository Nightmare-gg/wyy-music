// pages/main-video/main-video.js
import {getTopMV} from '../../services/video'
Page({
  data: {
    videoList: [],
    offset: 0,
    hasMore: true
  },
  onLoad() {
// 发送网络请求
this.fetchTopMV()
  },
  // 发送网络请求的方法
 async fetchTopMV() {
    //  获取数据
    const res = await getTopMV(this.data.offset)
    // 将获取到的数据追加到之前的数据后面
    const newVideoList = [...this.data.videoList,...res.data]
    // 设置全新的数据
    this.setData({videoList: newVideoList})
    this.data.offset = this.data.videoList.length
    this.data.hasMore = res.hasMore
  },
  // 上拉加载和下拉刷新
  onReachBottom() {
    // 判断是否有更多数据
    if(!this.data.hasMore) return
    // 如果有再请求新的数据
    this.fetchTopMV()
  },
  async onPullDownRefresh() {
    // 清空数据
    this.setData({videoList: []})
    this.data.offset = 0
    this.data.hasMore = true
    // 重新请求数据
    await this.fetchTopMV()
    // 数据加载完成停止加载效果
    wx.stopPullDownRefresh()
  },
  // 监听事件
  onVideoItemTap(event) {
    // const item = event.currentTarget.dataset.item
    // wx.navigateTo({
    //   url: `../../pages/detail-video/detail-video?id=${item.id}`,
    // })
  }
})