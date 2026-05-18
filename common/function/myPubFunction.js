let myfn = {}

// 单张图片预览
myfn.previewImage = url => {
  uni.previewImage({
    urls: [url],
    current: url,
  })
}
// 多张图片预览
myfn.previewImages = urls => {
  uni.previewImage({
    urls,
    current: urls[0],
  })
}

// 复制到剪贴板（兼容微信小程序 & H5）
myfn.copyToClipboard = text => {
  // #ifdef H5
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        vk.toast('已复制')
      })
      .catch(() => {
        vk.toast('复制失败')
      })
  } else {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    vk.toast('已复制')
  }
  // #endif
  // #ifdef MP-WEIXIN
  wx.setClipboardData({
    data: text,
    success: () => vk.toast('已复制'),
    fail: e => {
      console.log('e==> ', e)
      vk.toast('复制失败')
    },
  })
  // #endif
}

// 构建错误摘要
myfn.buildErrorSummary = res => {
  const config = res.config || {}
  const parts = [
    `URL: ${config.url || config.baseURL || 'N/A'}`,
    `Method: ${(config.method || 'N/A').toUpperCase()}`,
    `Params: ${JSON.stringify(config.params || config.data || {}, null, 2)}`,
    `Response: ${JSON.stringify(res.data || res, null, 2)}`,
  ]
  return parts.join('\n\n')
}

// 退出登录
myfn.logout = async () => {
  vk.showLoading('退出登录中...')
  vk.setStorageSync('uni_id_token_expired', {})
  vk.setStorageSync('uni_id_token', '')
  vk.setVuex('$user', {})
  await new Promise(resolve => setTimeout(resolve, 1000))
  vk.hideLoading()
  vk.reLaunch('/pages/index/index')
}

// 跳转登录页面
myfn.navigateToLogin = url => {
  vk.navigate.setOriginalPage({
    url,
  })
  // vk.navigateTo('/pages/login/index')

  // vk.navigateToLogin({
  //   mode: 'navigateTo',
  // })
}

export default myfn
