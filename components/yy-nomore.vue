<!-- z-paging自定义的没有更多数据view -->
<template>
  <view class="flex flex-col items-center pb-2" v-if="text">
    <!-- 这里的图片请换成自己项目的图片 -->
    <text class="text-[.75rem] text-[#8E9299] mt-3">{{ text }}</text>
  </view>
</template>

<script setup>
  defineProps({
    text: {
      type: String,
      default: '已经清澈见底啦~',
    },
  })
</script>

<style lang="scss" scoped>
  ::v-deep u-image view,
  .u-image {
    width: 100% !important;
    height: 100% !important;
  }
</style>
