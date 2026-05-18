<template>
  <view class="bg-white w-screen h-screen fixed !z-[999999999999] inset-0 flex flex-col justify-center items-center gap-6">
    <image src="/static/dddr105.png" mode="aspectFill" class="size-20" />
    <view class="text-[.875rem] text-[#5C6068]">网络连接已断开，请检查网络设置</view>

    <view class="w-[7.625rem] h-[2rem] bg-[#00A9AB] flex justify-center items-center rounded-full" @click="goToSettings">
      <view class="text-[.875rem] text-[#FFFFFF]">点击重试</view>
    </view>
  </view>
</template>

<script setup>
  const isConnected = ref(true)
  const isIOS = ref(false)

  onMounted(() => {
    // 初始化平台信息
    isIOS.value = uni.getSystemInfoSync().platform === 'ios'
    uni.onNetworkStatusChange(res => {
      const connected = res.isConnected
      vk.setVuex('$app.networkType', connected)
      console.log('isConnected==> ', connected)
      if (connected) {
        reconnect()
        vk.myfn.getLocation()
      }
    })
  })

  function goToSettings() {
    // 参考 uView 组件的实现
    // openSystemSettings()
    reconnect()
  }

  function openSystemSettings() {
    // 以下方法来自5+范畴，如需深究，请自行查阅相关文档
    // https://ask.dcloud.net.cn/docs/
    if (isIOS.value) {
      gotoiOSSetting()
    } else {
      gotoAndroidSetting()
    }
  }

  function gotoiOSSetting() {
    const UIApplication = plus.ios.import('UIApplication')
    const application2 = UIApplication.sharedApplication()
    const NSURL2 = plus.ios.import('NSURL')
    const setting2 = NSURL2.URLWithString('App-prefs:root=General')
    application2.openURL(setting2)
    plus.ios.deleteObject(setting2)
    plus.ios.deleteObject(NSURL2)
    plus.ios.deleteObject(application2)
  }

  function gotoAndroidSetting() {
    const Intent = plus.android.importClass('android.content.Intent')
    const Settings = plus.android.importClass('android.provider.Settings')
    const mainActivity = plus.android.runtimeMainActivity()
    const intent = new Intent(Settings.ACTION_SETTINGS)
    mainActivity.startActivity(intent)
  }

  function reconnect() {
    // emit('reconnects')
    vk.myfn.reloadPage()
  }
</script>

<style lang="scss" scoped></style>
