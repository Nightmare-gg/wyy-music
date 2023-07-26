// components/nav-bar/nav-bar.js
const app = getApp()
Component({
  options: {
    multipleSlots: true
  },
  data: {
    statusBarHeight: 20
  },

  properties: {
    title: {
      type: String,
      value: '默认标题'
    }
  },

  lifetimes: {
    attached() {
      this.setData({statusBarHeight: app.globalData.statusBarHeight})
    }
  },
  methods: {
    onLeftTap() {
      this.triggerEvent('onLeftTap')
    }
  }
})
