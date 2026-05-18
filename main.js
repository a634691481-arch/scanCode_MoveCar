import App from './App'
import store from './store'
import config from '@/app.config.js'
import themes from './common/function/uview-pro.theme'
import uViewPro from '@/uni_modules/uview-pro'

uni.$zp = {
  config: {
    'default-page-size': 12,
  },
}

// 引入 vk框架前端
import vk from './uni_modules/vk-unicloud'

// 引入 http 拦截器
import httpInterceptor from '@/apis/http.interceptor.js'

// 引入 API 集中管理
import httpApi from '@/apis/http.api.js'

import { createSSRApp } from 'vue'

export function createApp() {
  const app = createSSRApp(App)

  app.use(uViewPro, {
    theme: {
      themes: themes,
      defaultTheme: 'green', // 默认主题名称
      defaultDarkMode: 'light', // 默认暗黑模式：auto、light、dark
    },
  })

  // 引入 vk框架前端
  app.use(vk, config)

  // 引入vuex
  app.use(store)

  // 引入 API 集中管理
  httpApi.install()

  // 引入 http 拦截器
  httpInterceptor.install()

  return { app }
}
