// components/menu-area/menu-area.js
const app = getApp()
Component({
  properties: {
    title: {
      type: String,
      value: '默认标题'
    },
    menuList: {
      type: Array,
      value: []
    }
  },
  data: {
    screenWidth: 375
  },
  lifetimes: {
    attached() {
      this.setData({screenWidth: app.globalData.screenWidth})
    }
  },
  methods: {
    onMoreClick() {
      wx.navigateTo({
        url: '/pages/detail-menu/detail-menu',
      })
    }
  }
})
