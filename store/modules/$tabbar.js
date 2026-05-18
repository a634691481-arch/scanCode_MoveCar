let lifeData = uni.getStorageSync('lifeData') || {}

let tabbar = lifeData.$tabbar || {}

export default {
  namespaced: true,

  state: {
    // 当前激活索引
    activeIndex: tabbar.activeIndex || 0,
    // tabbar 列表配置
    list: tabbar.list || [
      {
        iconPath: 'ri:home-smile-2-line',
        selectedIconPath: 'ri:home-smile-2-fill',
        text: '首页',
        pagePath: '/pages/index/index',
      },
      {
        iconPath: 'ri:compass-3-line',
        selectedIconPath: 'ri:compass-3-fill',
        text: '旅游',
        pagePath: '/pages/tourGuide/index',
      },
      {
        iconPath: 'ri:chat-smile-2-line',
        selectedIconPath: 'ri:chat-smile-2-fill',
        text: '咨询',
        pagePath: '/pages/consult/index',
      },
      {
        iconPath: 'ri:user-smile-line',
        selectedIconPath: 'ri:user-smile-fill',
        text: '我的',
        pagePath: '/pages/my/index',
      },
    ],
  },

  getters: {
    // 获取当前 tab 项
    currentTab(state) {
      return state.list[state.activeIndex] || null
    },
  },

  mutations: {},

  actions: {
    // 切换 tab
    switchTab({ state }, index) {
      if (index < 0 || index >= state.list.length) return
      vk.vuex.set('$tabbar.activeIndex', index)
    },

    // 更新角标数字
    updateBadge({ state }, { index, count }) {
      if (index < 0 || index >= state.list.length) return
      const newList = JSON.parse(JSON.stringify(state.list))
      newList[index].count = count
      vk.vuex.set('$tabbar.list', newList)
    },

    // 更新红点状态
    updateIsDot({ state }, { index, isDot }) {
      if (index < 0 || index >= state.list.length) return
      const newList = JSON.parse(JSON.stringify(state.list))
      newList[index].isDot = isDot
      vk.vuex.set('$tabbar.list', newList)
    },

    // 更新 tabbar 列表
    setList({ state }, list) {
      vk.vuex.set('$tabbar.list', list)
    },
  },
}
