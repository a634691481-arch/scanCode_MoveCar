<template>
  <u-tabbar
    v-model="activeIndex"
    :list="tabbarList"
    :borderTop="false"
    :active-color="$u.color.primary"
    inactive-color="#E0E0E0"
    :hideTabBar="true"
    @change="onChange"
  ></u-tabbar>
</template>

<script>
  let vk = uni.vk

  export default {
    computed: {
      tabbarList() {
        return vk.getVuex('$tabbar.list')
      },
      activeIndex: {
        get() {
          return vk.getVuex('$tabbar.activeIndex')
        },
        set(val) {
          vk.vuex.dispatch('$tabbar/switchTab', val)
        },
      },
    },
    methods: {
      // tab 切换回调
      onChange(index) {
        vk.vuex.dispatch('$tabbar/switchTab', index)
      },
    },
  }
</script>
