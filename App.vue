<script>
  import config from '@/app.config.js'
  import { version } from './package.json'
  export default {
    // 监听 - 页面404
    onPageNotFound: function (e) {
      uni.redirectTo({
        url: config.error.url,
      })
    },
    onLaunch: function () {
      if (config.debug) {
        // #ifndef APP-PLUS
        console.log(
          `%c vk-client %c v${version} `,
          'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
          'background:#007aff ;padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; font-weight: bold;',
        )
        // #endif
        console.log('App Launch')
      }
      // #ifdef MP
      uni.vk.updateManager.updateReady()
      // #endif

      // 产品介绍页判断逻辑已移至 pages/index/middle.vue
    },

    onShow: function () {
      // #ifdef APP-PLUS
      uni.vk.vuex.dispatch('$app/getInitData')
      // #endif
    },
    onHide: function () {
      if (config.debug) console.log('App Hide')
    },
  }
</script>

<style lang="scss">
  @import '@/uni_modules/uview-pro/index.scss';
  @import 'tailwindcss/base';
  @import 'tailwindcss/utilities';
  @import 'tailwindcss/components';

  @import './common/css/core.scss';
</style>
