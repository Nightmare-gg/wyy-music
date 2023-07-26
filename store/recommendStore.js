import {HYEventStore} from 'hy-event-store'
import {getPlayListDetail} from '../services/music'

const recommendStore = new HYEventStore({
  state: {
    recomendSongInfo: {}
  },
  actions:{
   async fetchRecommendSongsAction(ctx) {
      const res = await getPlayListDetail(3778678)
      ctx.recomendSongInfo = res.playlist
    }
  }
})
export default recommendStore