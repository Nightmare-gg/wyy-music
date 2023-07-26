// pages/detail-menu/detail-menu.js
import { getMenuTags,getHotMenuList} from '../../services/music'
Page({
  data: {
   songMenus: []
  },
  onLoad() {
   this.fetchMenuTags()
  },
  // 封装网络请求
  async fetchMenuTags() {
    // 调用标签的接口拿到标签
    const tagRes = await getMenuTags()
    const tags = tagRes.tags
  // 根据标签，调用歌单的接口拿到数据
  const promiseAll = []
    for(const tag of tags) {
    const promise =  getHotMenuList(tag.name)
    promiseAll.push(promise)
    }
    // 获取到所有数据以后，调用一次setData
    Promise.all(promiseAll).then(res=> {
      this.setData({songMenus: res})
    })
  }
})