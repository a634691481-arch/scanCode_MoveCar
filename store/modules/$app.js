import config from '@/app.config.js'

let lifeData = uni.getStorageSync('lifeData') || {}

let $app = lifeData.$app || {}

export default {
  namespaced: true,

  state: {
    inited: $app.inited || false,
    config: {
      ...config
    },
    color: $app.color || config.color,
    originalPage: $app.originalPage || null,
    initData: $app.initData || {},
    networkType: $app.networkType || true,
    appAuthorizeSetting: $app.appAuthorizeSetting,
    checkLocationPermission: $app.checkLocationPermission,
    currentLatitudeAndLongitude: $app.currentLatitudeAndLongitude,
    homePageUpdate: $app.homePageUpdate
  },

  getters: {},
  mutations: {},

  actions: {
    // 获取初始化数据    //
    async getInitData({ commit }) {
      let res = await api.init()
      vk.vuex.set('$app.initData', res.data)
    }
  }
}
