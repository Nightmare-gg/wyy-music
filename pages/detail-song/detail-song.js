// pages/detail-song/detail-song.js
import recommendStore from '../../store/recommendStore'
import rankingStore from '../../store/rankingStore'
import  {getPlayListDetail} from '../../services/music'
import playerStore from '../../store/playerStore'

Page({
  data: {
    type: 'ranking',
    key: 'newRanking',
    songInfo: {},
    id:0
  },
  onLoad(optins) {
    const type = optins.type
    this.setData({type})
  // 如果是点击排行榜进来的才监听仓库中的数据
    if(type==='ranking') {
      const key = optins.key
      this.data.key=key
      rankingStore.onState(key,this.handleRanking)
    }else if(type==='recommend') {
      recommendStore.onState('recomendSongInfo',this.handleRanking)
    }else if(type==='menu') {
      this.data.id = optins.id
      this.fetchMenuSongInfo()
    }
  },

  async fetchMenuSongInfo() {
    const res = await getPlayListDetail(this.data.id)
    this.setData({songInfo: res.playlist})
  },
  // 事件监听
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState('playSongList',this.data.songInfo.tracks)
    playerStore.setState('playSongIndex',index)
  },


  handleRanking(value) {
    if(this.data.type === 'recommend') {
      value.name = "推荐歌曲"
    }
    this.setData({songInfo: value})
    // 动态展示页面标题
    wx.setNavigationBarTitle({
      title: value.name,
    })
  },
  onunload() {
    if(type==='ranking') {
      rankingStore.offState(this.data.key,this.handleRanking)
    }else if(type ==='recommend') {
      recommendStore.offState('recomendSongInfo',this.handleRanking)
    }
  }
})