import {HYEventStore} from 'hy-event-store'
import {parseLyric} from '../utils/parse-lyric'
import {getSongDetail,getSongLyric} from '../services/player'

export const audioContext = wx.createInnerAudioContext()
const playerStore = new HYEventStore({
  state: {
    playSongList: [],
    playSongIndex: 0,

    id: 0,
    currentSong: {},
    currentTime: 0,
    durationTime: 0,
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: -1,

    isPlaying: false,
    isFirstPlay: true,

    playModeIndex: 0, //0:顺序播放，1：单曲循环，2：随机播放
  },
  actions: {
    playSongById(ctx,id) {
      // 播放歌曲时清空状态
      ctx.currentSong={},
      ctx.currentTime=0,
      ctx.durationTime=0,
      ctx.currentLyricIndex = 0,
      ctx.currentLyricText = ""
      ctx.lyricInfos = []

      // 1.保存id
      ctx.id = id
      ctx.isPlaying = true
      // 2.调用请求传入Id获取歌曲详情信息
      getSongDetail(id).then(res=> {
        ctx.currentSong = res.songs[0],
        ctx.durationTime = res.songs[0].dt
      })
      // 3.调用请求传入Id获取歌词信息
      getSongLyric(id).then(res=> {
       const lrcString = res.lrc.lyric
       const lyricInfos = parseLyric(lrcString)
        ctx.lyricInfos = lyricInfos
      });
      // 4.播放当前歌曲
      audioContext.stop()
      audioContext.src=`https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true
      // 监听播放进度
      if(ctx.isFirstPlay) {
        ctx.isFirstPlay = false
       
      audioContext.onTimeUpdate(()=> {
        // 1.获取当前播放时间
        ctx.currentTime = audioContext.currentTime * 1000
       // 2.匹配正确的歌词
       if(!ctx.lyricInfos.length) return
       let index = ctx.lyricInfos.length - 1
       for(let i = 0; i < ctx.lyricInfos.length; i++) {
         const info = ctx.lyricInfos[i]
         if(info.time > audioContext.currentTime * 1000) {
           index = i - 1
           break
         }
       }
       if(index === ctx.currentLyricIndex) return

      //  3.获取歌词的所有Index和文本text
      // 4.改变歌词滚动页面的位置
       const currentLyricText = ctx.lyricInfos[index].text
       ctx.currentLyricText=currentLyricText
       ctx.currentLyricIndex = index
      })
       audioContext.onWaiting(()=> {
        audioContext.pause()
        })
        audioContext.onCanplay(()=> {
          audioContext.play()
        })
        audioContext.onEnded(()=> {
          // 如果是单曲循环，不需要切换下一首歌
          if(audioContext.loop) return
          // 不是单曲循环，切换下一首歌
          this.dispatch('playNewSongAction')
        })
      }
    },
    playSongStatusAction(ctx) {
      if(!audioContext.paused) {
        audioContext.pause()
        ctx.isPlaying = false
      }else {
        audioContext.play()
       ctx.isPlaying = true
      }
    },
    changeModeAction(ctx) {
      // 1.计算新的模式
    let modeIndex = ctx.playModeIndex
    modeIndex = modeIndex + 1
    if(modeIndex === 3) modeIndex = 0
    // 2.设置是否是单曲循环
    if(modeIndex === 1) {
      audioContext.loop = true
    }else {
      audioContext.loop = false
    }
    // 3.保存播放模式
    ctx.playModeIndex = modeIndex
    },
    playNewSongAction(ctx,isNext = true) {
      // 1.获取之前的数据
      const len = ctx.playSongList.length
      let  index = ctx.playSongIndex
      
      // 2.计算索引
      switch(ctx.playModeIndex) {
        case 1:
        case 0: //顺序播放
        index = isNext ? index + 1 : index - 1
        if(index === len) index = 0
        if(index === -1) index = len - 1
          break
        // case 1: //单曲循环
        //   break
        case 2: //随机播放
          index = Math.floor(Math.random() * len)
          break
      }
    
      // 3.根据索引获取当前歌曲信息
      const newSong = ctx.playSongList[index]
      // 4.播放新歌时初始化状态
        this.dispatch('playSongById',newSong.id)
      // 5.将索引保存到仓库
      ctx.playSongIndex = index
    },
  }
})

export default playerStore