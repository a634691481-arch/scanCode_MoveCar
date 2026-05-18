const ENV_MAP = {
  prod: 'https://travel.tasiai.cn/h5/api/tasi_travel_manage_system_prod',
  pre: 'https://travel.tasiai.cn/h5/api/tasi_travel_manage_system_pre',
  test: 'https://travel.tasiai.cn/h5/api/tasi_travel_manage_system_test',
}

const currentEnvironment = 'prod' // 'pre' | 'prod' | 'test' 默认预览环境

const BASE_URL = ENV_MAP[currentEnvironment] || ENV_MAP.pre

const install = app => {
  uni.$u.http.setConfig({ baseUrl: BASE_URL })
  globalThis.api = api
}

// API 封装
const req = (method, url) => p => uni.$u.http[method](url, p)

const api = {
  // 获取openid
  getOpenid: req('post', '/userEntity/wxLogins'),

  // 获取手机号码
  getPhoneNumber: req('post', '/loginWx'),

  // 获取用户信息
  getUserInfo: req('get', '/getSysUserInfo'),
}

export { api }
export default { install, api }
