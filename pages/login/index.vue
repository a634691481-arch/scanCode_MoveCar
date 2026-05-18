<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <view class="flex flex-col overflow-hidden">
      <!-- 背景渐变装饰 -->
      <view
        class="h-80 absolute top-0 left-0 right-0"
        :style="{
          background: `linear-gradient(180deg, ${uni.$u.color.primary}15 0%, transparent 100%)`,
        }"
      ></view>

      <!-- 内容区 -->
      <view class="relative z-10 flex flex-col flex-1 px-6 pt-12">
        <!-- 品牌 Logo -->
        <view class="flex flex-col items-center gap-4 mt-8 mb-10">
          <view
            class="rounded-3xl size-20 flex items-center justify-center shadow-lg"
            :style="{ backgroundColor: uni.$u.color.primary }"
          >
            <yy-icon name="ri:landscape-line" size="40" color="#ffffff" />
          </view>
          <view class="flex flex-col items-center gap-1">
            <view class="text-2xl font-bold text-gray-900">欢迎使用</view>
            <view class="text-sm text-gray-500">登录后享受更多专属权益</view>
          </view>
        </view>

        <!-- 功能亮点 -->
        <view class="grid grid-cols-3 gap-3 mb-10">
          <view class="rounded-xl flex flex-col items-center gap-2 p-3 bg-white shadow-sm">
            <view
              class="size-10 flex items-center justify-center rounded-lg"
              :style="{ backgroundColor: `${uni.$u.color.primary}15` }"
            >
              <yy-icon name="ri:coupon-3-line" size="20" :color="uni.$u.color.primary" />
            </view>
            <view class="text-xs text-gray-600">会员优惠</view>
          </view>
          <view class="rounded-xl flex flex-col items-center gap-2 p-3 bg-white shadow-sm">
            <view
              class="size-10 flex items-center justify-center rounded-lg"
              :style="{ backgroundColor: `${uni.$u.color.primary}15` }"
            >
              <yy-icon name="ri:gift-line" size="20" :color="uni.$u.color.primary" />
            </view>
            <view class="text-xs text-gray-600">积分兑换</view>
          </view>
          <view class="rounded-xl flex flex-col items-center gap-2 p-3 bg-white shadow-sm">
            <view
              class="size-10 flex items-center justify-center rounded-lg"
              :style="{ backgroundColor: `${uni.$u.color.primary}15` }"
            >
              <yy-icon name="ri:vip-crown-line" size="20" :color="uni.$u.color.primary" />
            </view>
            <view class="text-xs text-gray-600">专属客服</view>
          </view>
        </view>

        <!-- 其他登录方式 -->
        <!-- <view class="flex flex-col items-center gap-4 mt-auto mb-40">
          <view class="flex items-center gap-3 text-xs text-gray-400">
            <view class="w-12 h-px bg-gray-200"></view>
            <text>其他登录方式</text>
            <view class="w-12 h-px bg-gray-200"></view>
          </view>
          <view class="flex items-center gap-8">
            <view
              class="size-12 active:opacity-70 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm"
              @click="onWechatLogin"
            >
              <yy-icon name="ri:wechat-fill" size="26" color="#07C160" />
            </view>
            <view
              class="size-12 active:opacity-70 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm"
              @click="onAppleLogin"
            >
              <yy-icon name="ri:apple-fill" size="26" color="#000000" />
            </view>
            <view
              class="size-12 active:opacity-70 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm"
              @click="onVisitorLogin"
            >
              <yy-icon name="ri:user-smile-line" size="26" color="#6b7280" />
            </view>
          </view>
        </view> -->
      </view>
    </view>
  </yy-paging>

  <!-- 底部固定按钮 -->
  <view class="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100">
    <view class="flex flex-col gap-2 p-3 pb-4">
      <view class="flex items-center justify-center">
        <u-button
          type="primary"
          shape="circle"
          :custom-style="{ height: '44px', width: '60%' }"
          ripple
          :loading="loginLoading"
          :disabled="loginLoading"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          <view class="flex items-center justify-center gap-2">
            <!-- <yy-icon name="ri:smartphone-line" size="18" color="#ffffff" /> -->
            <text class="text-sm font-medium">{{ loginLoadingText }}</text>
          </view>
        </u-button>
      </view>

      <!-- 用户协议 -->
      <view class="flex items-center justify-center">
        <u-checkbox v-model="state.agree" shape="circle" size="28" :active-color="uni.$u.color.primary"></u-checkbox>
        <view class="text-xs text-gray-500">
          我已阅读并同意
          <text :style="{ color: uni.$u.color.primary }" @click="viewAgreement('user')">《用户协议》</text>
          和
          <text :style="{ color: uni.$u.color.primary }" @click="viewAgreement('privacy')">《隐私政策》</text>
        </view>
      </view>
    </view>
  </view>

  <!-- 登录协议确认弹框 -->
  <u-modal
    v-model="state.showAgreeModal"
    title="温馨提示"
    :show-cancel-button="true"
    cancel-text="不同意"
    confirm-text="同意并登录"
    :confirm-color="uni.$u.color.primary"
    @cancel="onAgreeCancel"
    @confirm="onAgreeConfirm"
  >
    <view class="px-4 py-3 text-sm leading-relaxed text-gray-600">
      登录即表示您已阅读并同意
      <text :style="{ color: uni.$u.color.primary }" @click="viewAgreement('user')">《用户协议》</text>
      和
      <text :style="{ color: uni.$u.color.primary }" @click="viewAgreement('privacy')">《隐私政策》</text>
      ，我们将依据上述协议为您提供服务。
    </view>
  </u-modal>
</template>

<script setup>
  const pagingConfig = ref({
    auto: false,
    refresherEnabled: false,
    showRefresherWhenReload: false,
    showTabbar: false,
    hideNav: false,
    showNavBack: true,
    navTitle: '登录',

    color: uni.$u.color.primary,
    loadingMoreNoMoreText: '',
  })

  const state = ref({
    isScroll: false,
    dataList: [],
    agree: false,
    showAgreeModal: false,
  })

  // 缓存待登录的授权 event（用户同意协议后继续使用）
  const pendingLoginEvent = ref(null)

  const paging = ref()

  onLoad(options => {
    console.log('🚀 页面加载:', options)

    // let originalPage = vk.navigate.getOriginalPage()
    // console.log('🚀 ~ :151 ~ originalPage:', originalPage)
  })

  onShow(options => {
    console.log('🚀 页面显示:', options)
  })

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  async function queryList(page, limit) {
    await new Promise(resolve => setTimeout(resolve, 100))
    paging.value?.complete([1])
  }

  // 登录 loading 状态
  const loginLoading = ref(false)
  const loginLoadingText = ref('手机号登录')

  // 手机号一键登录入口：先校验授权 event，再判断是否需弹协议框
  function getPhoneNumber(event) {
    console.log('🚀 ~ getPhoneNumber ~ event:', event)

    // 未勾选协议 → 弹框让用户确认
    if (!state.value.agree) {
      pendingLoginEvent.value = event
      state.value.showAgreeModal = true
      return
    }

    if (event.detail.errno == 104) {
      vk.toast('小程序隐私协议未授权, 请稍后重试。', 'none', 1000)
      return
    }
    if (event.detail.errMsg !== 'getPhoneNumber:ok') {
      vk.toast('授权失败，请点击手机号授权后登录', 'none', 1000)
      return
    }

    doLogin(event)
  }

  // 协议弹框：不同意
  function onAgreeCancel() {
    state.value.showAgreeModal = false
    pendingLoginEvent.value = null
  }

  // 协议弹框：同意并登录
  function onAgreeConfirm() {
    state.value.agree = true
    state.value.showAgreeModal = false
    const event = pendingLoginEvent.value
    pendingLoginEvent.value = null
    if (event) doLogin(event)
  }

  // 执行登录核心流程
  async function doLogin(event) {
    console.log('🚀 ~ :237 ~ doLogin ~ event:', event)
    loginLoading.value = true
    loginLoadingText.value = '正在获取微信授权...'
    vk.showLoading({ title: '正在获取微信授权...', mask: true })

    try {
      // const wechatLoginResult = await uni.login()

      // loginLoadingText.value = '正在验证身份...'
      // vk.showLoading({ title: '正在验证身份...', mask: true })
      // const { data: authData } = await api.getOpenid({
      //   wxCode: wechatLoginResult.code,
      //   channelCode: '05',
      // })

      // loginLoadingText.value = '正在获取手机号...'
      // vk.showLoading({ title: '正在获取手机号...', mask: true })
      // const phoneAuthResult = await api.getPhoneNumber({
      //   openId: authData.openId,
      //   unionId: authData.unionId,
      //   phoneCode: event?.detail?.code,
      //   channelCode: '05',
      // })

      // console.log('phoneAuthResult==> ', phoneAuthResult)

      // vk.setStorageSync('uni_id_token', phoneAuthResult.data)
      vk.setStorageSync('uni_id_token', '5555555555555')
      vk.setStorageSync('uni_id_token_expired', Date.now() + 365 * 24 * 60 * 60 * 1000) // 过期时间设置为一年后

      loginLoadingText.value = '正在获取用户信息...'
      vk.showLoading({ title: '正在获取用户信息...', mask: true })
      // await vk.vuex.dispatch('$user/getUserInfo')

      loginLoadingText.value = '登录成功，正在跳转...'
      vk.showLoading({ title: '登录成功，正在跳转...', mask: true })

      const originalPage = vk.navigate.getOriginalPage()
      vk.redirectTo(originalPage?.url || '/pages/index/index')

      // vk.navigate.originalTo()
    } catch (error) {
      // console.error('登录失败:', error)
      // vk.toast('登录失败，请稍后重试', 'none', 2000)
    } finally {
      loginLoading.value = false
      loginLoadingText.value = '手机号登录'
      vk.hideLoading()
    }
  }

  // 查看协议
  function viewAgreement(type) {
    const url = type === 'user' ? '/pages/my/privacy-policy' : '/pages/my/privacy-policy'
    uni.navigateTo({ url })
  }
</script>

<style lang="scss" scoped></style>
