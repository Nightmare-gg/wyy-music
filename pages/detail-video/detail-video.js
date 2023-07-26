// pages/detail-video/detail-video.js
import {getMVUrl,getMVInfo,getMVRelated} from '../../services/video'
Page({
  data: {
    id: 0,
    mvUrl: '',
    danmuList: [
      {text:'初听不知曲中意',color: '#ff00ff',time: 3 },
      {text:'再听已是曲中人',color: '#ff0000',time: 13}
    ],
    mvInfo: {},
    relatedMv: []
  },
  onLoad(options) {
    // 获取id
    const id = options.id
    this.setData({id})
    // 获取数据
    this.fetchMVUrl()
    this.fetchMVInfo()
    this.fetchRelated()
  },
  async fetchMVUrl() {
    const res = await getMVUrl(this.data.id)
    this.setData({mvUrl: res.data.url})
  },
  async fetchMVInfo() {
    const res = await getMVInfo(this.data.id)
    this.setData({mvInfo: res.data})
  },
  async fetchRelated() {
     const res = await getMVRelated(this.data.id)
     this.setData({relatedMv: res.data})
  }
})