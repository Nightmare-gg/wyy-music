import {hyRequest} from './index'

export  function getMusicBanner(type=0) {
  return hyRequest.get({
    url: '/banner',
    data: {
      type
    }
  })
}
export function  getPlayListDetail(id) {
  return hyRequest.get({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}
export function  getHotMenuList(cat="全部",limit=6,offset=0) {
  return hyRequest.get({
    url: '/top/playlist',
    data: {
      cat,
      limit,
      offset
    }
  })
}
export function  getMenuTags() {
  return hyRequest.get({
    url: '/playlist/hot'
  })
}