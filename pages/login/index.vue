<template>
  <view class="bg-gray-50 relative flex flex-col min-h-screen overflow-hidden">
    <!-- 背景渐变装饰 -->
    <view
      class="h-96 absolute top-0 left-0 right-0"
      :style="{
        background: `linear-gradient(180deg, ${uni.$u.color.primary}20 0%, transparent 100%)`,
      }"
    ></view>

    <!-- 内容区 -->
    <view class="relative z-10 flex flex-col flex-1 p-6 pt-16">
      <!-- 品牌 Logo -->
      <view class="flex flex-col items-center gap-4 my-8">
        <view
          class="rounded-3xl size-24 flex items-center justify-center shadow-lg"
          :style="{ backgroundColor: uni.$u.color.primary }"
        >
          <yy-icon name="ri:car-line" size="48" color="#ffffff" />
        </view>
        <view class="flex flex-col items-center gap-2">
          <view class="text-2xl font-bold text-gray-900">扫码挪车</view>
          <view class="text-sm text-gray-500">便捷联系车主，文明停车</view>
        </view>
      </view>

      <!-- 功能介绍 -->
      <view class="flex flex-col gap-4 mt-4">
        <view class="rounded-2xl flex items-center gap-4 p-4 bg-white shadow-sm">
          <view
            class="size-12 rounded-xl shrink-0 flex items-center justify-center"
            :style="{ backgroundColor: `${uni.$u.color.primary}15` }"
          >
            <yy-icon name="ri:qr-scan-2-line" size="24" :color="uni.$u.color.primary" />
          </view>
          <view class="flex flex-col gap-1">
            <view class="text-sm font-semibold text-gray-800">扫码通知</view>
            <view class="text-xs text-gray-500">扫描二维码即可快速联系车主挪车</view>
          </view>
        </view>

        <view class="rounded-2xl flex items-center gap-4 p-4 bg-white shadow-sm">
          <view
            class="size-12 rounded-xl shrink-0 flex items-center justify-center"
            :style="{ backgroundColor: `${uni.$u.color.primary}15` }"
          >
            <yy-icon name="ri:shield-check-line" size="24" :color="uni.$u.color.primary" />
          </view>
          <view class="flex flex-col gap-1">
            <view class="text-sm font-semibold text-gray-800">隐私保护</view>
            <view class="text-xs text-gray-500">虚拟号码中转，保护双方真实手机号</view>
          </view>
        </view>

        <view class="rounded-2xl flex items-center gap-4 p-4 bg-white shadow-sm">
          <view
            class="size-12 rounded-xl shrink-0 flex items-center justify-center"
            :style="{ backgroundColor: `${uni.$u.color.primary}15` }"
          >
            <yy-icon name="ri:notification-3-line" size="24" :color="uni.$u.color.primary" />
          </view>
          <view class="flex flex-col gap-1">
            <view class="text-sm font-semibold text-gray-800">消息推送</view>
            <view class="text-xs text-gray-500">微信实时提醒，不错过任何挪车请求</view>
          </view>
        </view>
      </view>

      <!-- 隐私协议入口 -->
      <view class="flex justify-center mt-4">
        <text class="text-xs text-gray-400">
          登录即代表同意
          <text class="underline" :style="{ color: uni.$u.color.primary }" @click="toPrivacy">《隐私与协议》</text>
        </text>
      </view>
    </view>

    <!-- 底部固定按钮 -->
    <yy-fixed-bottom
      :text="loginLoadingText"
      icon="ri:login-circle-line"
      :disabled="loginLoading"
      :btn-style="loginBtnStyle"
      @click="onLogin"
    />
  </view>
</template>

<script setup>
  const loginLoading = ref(false)
  const loginLoadingText = ref('立即登录')

  const loginBtnStyle = computed(() => ({
    background: `linear-gradient(135deg, ${uni.$u.color.primary}, ${uni.$u.color.primaryDark})`,
    boxShadow: `0 6px 16px ${uni.$u.color.primary}4d`,
  }))

  // 点击登录按钮
  function onLogin() {
    doLogin()
  }

  // 跳转到隐私协议页面
  function toPrivacy() {
    vk.navigateTo('/pages/privacy/index')
  }

  // 执行登录
  async function doLogin() {
    loginLoading.value = true
    loginLoadingText.value = '登录中...'
    vk.showLoading({ title: '登录中...', mask: true })

    try {
      const data = await new Promise((resolve, reject) => {
        vk.userCenter.loginByWeixin({
          data: {
            type: '',
          },
          success: res => {
            resolve(res)
          },
          fail: err => {
            reject(err)
          },
        })
      })

      const tokenData = data.vk_uni_token || data

      vk.showLoading({ title: '登录成功，正在跳转...', mask: true })

      const originalPage = vk.navigate.getOriginalPage()
      vk.redirectTo(originalPage?.url || '/pages/index/index')
    } catch (error) {
      vk.toast('登录失败，请稍后重试', 'none', 2000)
    } finally {
      loginLoading.value = false
      loginLoadingText.value = '立即登录'
      vk.hideLoading()
    }
  }
</script>

<style lang="scss" scoped></style>
