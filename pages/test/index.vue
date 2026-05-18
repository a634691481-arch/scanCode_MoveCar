<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <view class="flex-col gap-3 p-3">
      <view class="flex items-center gap-2 p-3 bg-white rounded-lg">
        <yy-icon name="ri:information-line" size="20" color="#9ca3af" />
        <text class="text-xs text-gray-400">请如实填写投诉信息，我们会尽快为您处理</text>
        <yy-icon name="ri:information-line" size="20" color="#9ca3af"></yy-icon>
      </view>
    </view>
  </yy-paging>
</template>

<script setup>
  const pagingConfig = ref({
    auto: false,
    refresherEnabled: true,
    showRefresherWhenReload: true,
    showTabbar: true,
    hideNav: false,
    showNavBack: true,
    navTitle: '我的',
    // navBackground: '',
    color: uni.$u.color.primary,
    // loadingMoreNoMoreText: '',
    // emptyText: '',
  })

  const state = ref({
    isScroll: false,
    dataList: [],
  })

  const paging = ref()

  onLoad(options => {
    console.log('🚀 页面加载:', options)
    console.log('res==> ', uni.$u.getColor('primary'))
  })

  onShow(options => {
    console.log('🚀 页面加载:', options)
  })

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  async function queryList(page, limit) {
    await new Promise(resolve => setTimeout(resolve, 100))
    paging.value?.complete([1])
  }
</script>

<style lang="scss" scoped></style>
