let lifeData = uni.getStorageSync('lifeData') || {}

let $user = lifeData.$user || {}

export default {
  namespaced: true,
  state: {
    userInfo: $user.userInfo || {},
    permission: $user.permission || [],
    inviteCode: $user.inviteCode || '',
    historyData: $user.historyData || [],
    positioning: $user.positioning,
    preLoginInfo: $user.preLoginInfo,
  },
  getters: {},
  actions: {
    // 获取用户信息
    async getUserInfo(state, userInfo) {
      let res = await api.getUserInfo()
      console.log('🚀 ~ :20 ~ res:', res)
      vk.vuex.set('$user.userInfo', res.data)
    },
  },
  mutations: {},
}
