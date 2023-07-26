// pages/main-music/main-music.js
import {getMusicBanner,getHotMenuList} from '../../services/music'
import {querySelector} from '../../utils/query-selector'
import {throttle} from 'underscore'
import recommendStore from '../../store/recommendStore'
import rankingStore from '../../store/rankingStore'
import playerStore from '../../store/playerStore'
const app = getApp()

const querySelectThrottle = throttle(querySelector,100)
Page({
  data: {
    searchValue:"",
    banners: [],
    bannerHeight: 150,
    recommendSongs: [],
    hotMenuList: [],
    recMenuList: [],
    screenWidth: 375,
    rankingInfos: {},

    currentSong: {},
    isPlaying: false
  },

  onLoad() {
     // 发送网络请求
  this.fetchBanners()
  this.fetchHotList()
  // 调用仓库拿到数据，发起action
  recommendStore.onState('recomendSongInfo',this.handleRecomendSongs),
  recommendStore.dispatch("fetchRecommendSongsAction")

  rankingStore.onState('newRanking',this.hanleNewRanking),
  rankingStore.onState('originRanking',this.handleOriginRanking)
  rankingStore.onState('upRanking',this.handleUpRanking),
  
  playerStore.onStates(['currentSong','isPlaying'],this.handlePlayInfos)

  rankingStore.dispatch("fetchRankingDataAction")
   // 获取屏幕宽度
   this.setData({screenWidth: app.globalData.screenWidth})
  },

  // 监听事件
  onSearchTap() {
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },
  onRecomendMoreClick() {
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=recommend',
    })
  },
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState('playSongList',this.data.recommendSongs)
    playerStore.setState('playSongIndex',index)
  },
  onPlayTap() {
    playerStore.dispatch('playSongStatusAction')
  },
  onPlayBarAlbumTap() {
    wx.navigateTo({
      url: '/pages/music-player/music-player',
    })
  },
  // 封装网络请求方法
  async fetchBanners() {
    const res = await getMusicBanner()
    this.setData({banners: res.banners})
  },
  fetchHotList() {
    getHotMenuList().then(res=> {
      this.setData({hotMenuList: res.playlists})
    }),
    getHotMenuList("流行").then(res=> {
      this.setData({recMenuList: res.playlists})
    })
  },

  onBannerImageLoad(event) {
    querySelectThrottle('.banner-image').then(res=> {
      // console.log(res);
      this.setData({ bannerHeight: res[0].height})
    })
  },
  // 调用仓库
  handleRecomendSongs(value){
      if(!value.tracks) return
      this.setData({recommendSongs: value.tracks.slice(0,6)})
  },
  hanleNewRanking(value) {
    const newRankingInfos = {...this.data.rankingInfos,newRanking: value}
    this.setData({rankingInfos: newRankingInfos})
  },
  handleOriginRanking(value) {
    const newRankingInfos = {...this.data.rankingInfos,originRanking: value}
    this.setData({rankingInfos: newRankingInfos})
  },
  handleUpRanking(value) {
    const newRankingInfos = {...this.data.rankingInfos,upRanking: value}
    this.setData({rankingInfos: newRankingInfos})
  },
  handlePlayInfos({currentSong,isPlaying}) {
    if(currentSong) {
      this.setData({currentSong})
    }
    if(isPlaying !== undefined) {
      this.setData({isPlaying})
    }
  },

  // 页面卸载时移除监听
  onUnLoad() {
    recommendStore.offState('recomendSongInfo',this.handleRecomendSongs),
    rankingStore.offState('newRanking',this.hanleNewRanking),rankingStore.offState('originRanking',this.hanleOriginRanking),rankingStore.offState('upRanking',this.hanleUpRanking),
  playerStore.offStates(['currentSong','isPlaying'],this.handlePlayInfos)

  },

})