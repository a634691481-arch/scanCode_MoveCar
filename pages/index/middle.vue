<template>
  <yy-loading />
</template>

<script setup>
  import config from '@/app.config.js'

  onLoad(async () => {
    try {
      let res = await vk.callFunction({
        url: 'client/pub_index.getProductIntroStatus',
        data: {},
      })
      console.log('🚀 middle.vue checkProductIntro res:', res)

      // 获取启动参数（如扫码 scene 等）
      const launchOptions = uni.getLaunchOptionsSync()
      const query = launchOptions?.query || {}
      const queryStr = Object.keys(query).length > 0
        ? '?' + Object.keys(query).map(k => k + '=' + encodeURIComponent(query[k])).join('&')
        : ''

      if (res.code === 0 && res.data && res.data.showIntro === true) {
        vk.reLaunch({ url: '/pages/product-intro/index' })
      } else {
        vk.reLaunch({ url: '/pages/index/index' + queryStr })
      }
    } catch (err) {
      if (config.debug) {
        console.error('middle.vue checkProductIntro error:', err)
      }
      vk.reLaunch({ url: '/pages/index/index' })
    }
  })
</script>
