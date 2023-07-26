// pages/music-player/music-player.js
import {throttle} from 'underscore'
import playerStore,{audioContext} from '../../store/playerStore'

const app = getApp()
const modeName = ['order','repeat','random']
Page({
  data: {
    id: 0,
    currentSong: {},
    currentTime: 0,
    durationTime: 0,
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: -1,
    storeKeys: ['id','currentSong','durationTime','currentTime','lyricInfos','currentLyricText','currentLyricIndex','isPlaying','playModeIndex'],

    isPlaying: true,

    playSongList: [],
    playSongIndex: 0,
    isFirstPlay: true,

    playModeName: "order",

    statusBarHeight: 20,
    currentPage: 0,
    contentHeight:500,
    pagesTitle: ['歌曲','歌词'],
    sliderValue:0,
    isSliderChanging: false,
    isWaiting: false,
    lyricScrollTop: 0,
  },
  onLoad(options) {
    // 0.获取状态栏高度
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      contentHeight: app.globalData.contentHeight
    })
    // 1.获取id
    const id = options.id
    // 2.调用播放函数传入id
    // // 监听歌曲播放进度
    if(id) {
      playerStore.dispatch('playSongById',id)
    }

    playerStore.onStates(["playSongList","playSongIndex"],this.handlePlayStore)
    playerStore.onStates(this.data.storeKeys,this.getPlayerInfosHandler)
  },
    
  updateProgress: throttle(function(currentTime) {
    if (this.data.isSliderChanging) return
    // 1.记录当前的时间 2.修改sliderValue
    const sliderValue = currentTime / this.data.durationTime * 100
    this.setData({ currentTime, sliderValue })
  }, 800, { leading: false, trailing: false }),


// 监听事件
  onBackTap(){
    wx.navigateBack()
  },
  onSwiperChange(event) {
    this.setData({currentPage: event.detail.current})
  },
  onItemTap(event) {
    const index = event.currentTarget.dataset.index
    this.setData({currentPage: index})
  },
  // 监听滑块变化
  onSliderChange(event) {
    this.data.isWaiting = true
    setTimeout(()=> {
      this.data.isWaiting = false
    },1500)
    // 点击获取滑块位置对应在值
    const value = event.detail.value
    // 计算播放的位置时间
    const currentTime = value / 100 * this.data.durationTime
    // 设置播放器，播放计算出的时间
    audioContext.seek(currentTime / 1000)
    this.setData({currentTime,isSliderChanging: false})
  },
  onSliderChanging: throttle(function (event) {
    // 1.获取滑动到的位置的value
    const value = event.detail.value
    // 2.根据当前值，计算出对应的时间
    const currentTime = value / 100 * this.data.durationTime
    this.setData({currentTime})
    // 正在滑动时
    this.data.isSliderChanging = true
  },200),
  

  // 播放和暂停
  onPlayorPause() {
    playerStore.dispatch('playSongStatusAction')
  },
  // 点击切换播放模式
  onModeTap() {
    playerStore.dispatch('changeModeAction')
  },

  // 上一首
  onPrevBtnTap() {
    playerStore.dispatch('playNewSongAction',false)
  },
  // 下一首
  onNextBtnTap() {
     playerStore.dispatch('playNewSongAction')
  },

  // 仓库数据
  handlePlayStore({playSongList,playSongIndex}) {
   if(playSongList) {
     this.setData({playSongList})
   }
   if(playSongIndex !== undefined) {
     this.setData({playSongIndex})
   }
  },
  getPlayerInfosHandler({ 
    id, currentSong, durationTime, currentTime,
    lyricInfos, currentLyricText, currentLyricIndex,
    isPlaying,playModeIndex
  }) {
    if (id !== undefined) {
      this.setData({ id })
    }
    if (currentSong) {
      this.setData({ currentSong })
    }
    if (durationTime !== undefined) {
      this.setData({ durationTime })
    }
    if (currentTime !== undefined) {
      // 根据当前时间改变进度
      this.updateProgress(currentTime)
    }
    if (lyricInfos) {
      this.setData({ lyricInfos })
    }
    if (currentLyricText) {
      this.setData({ currentLyricText })
    }
    if (currentLyricIndex !== undefined) { 
      // 修改lyricScrollTop
      this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying })
    }
    if(playModeIndex !== undefined) {
      this.setData({playModeName: modeName[playModeIndex]})
    }
  },

  onUnload() {
    playerStore.offStates(["playSongList","playSongIndex"],this.handlePlayStore)
    playerStore.offStates(this.data.storeKeys,this.getPlayerInfosHandler)
  }
})