const TOKEN_KEY = 'uni_id_token'

// 是否启用错误信息复制到剪贴板
const ENABLE_COPY_ERROR = true

// 防重复弹框标记
let isShowingAlert = false

// 统一错误提示方法
function showErrorAlert(res, message) {
  if (isShowingAlert) return Promise.reject(res)
  isShowingAlert = true

  const code = res.code || res.status || ''
  const errorMsg = message || '操作失败'
  const alertMessage = code ? `[${code}] ${errorMsg}` : errorMsg

  const modalOptions = {
    title: '提示',
    content: alertMessage,
    showCancel: ENABLE_COPY_ERROR,
    cancelText: '复制错误',
    confirmText: '我知道了',
    success: modalRes => {
      isShowingAlert = false
      if (!modalRes.confirm && ENABLE_COPY_ERROR) {
        vk.myfn.copyToClipboard(vk.myfn.buildErrorSummary(res))
      }
    },
  }

  uni.showModal(modalOptions)

  return Promise.reject(res)
}

const install = () => {
  // 请求拦截
  uni.$u.http.interceptor.request = config => {
    const token = uni.getStorageSync(TOKEN_KEY)
    if (token) config.header['Authorization'] = token

    config.header['x-timestamp'] = Date.now()
    config.header['x-client-platform'] = uni.getSystemInfoSync().platform

    return config
  }

  // 响应拦截
  uni.$u.http.interceptor.response = res => {
    console.log('🚀 ~ :51 ~ install ~ res:', res)
    // uview-pro 的响应结构：业务数据在 res.data 中
    const businessData = res.data || {}
    const code = businessData.code || businessData.status
    const msg = businessData.msg || businessData.message

    const CODE_HANDLERS = {
      // 业务失败
      0: () => {
        uni.hideLoading()
        return showErrorAlert(res, msg || '操作失败')
      },

      // 业务成功
      1: () => businessData,

      // 业务成功（HTTP 200 兼容）
      200: () => businessData,

      // 未登录或登录过期
      401: () => {
        uni.hideLoading()

        // 如果正在显示弹框，则不重复显示
        // if (isShowingAlert) return Promise.reject(res)

        // isShowingAlert = true
        // uni.showModal({
        //   title: '提示',
        //   content: msg || '登录已过期,请重新登录',
        //   showCancel: false,
        //   success: () => {
        //     isShowingAlert = false
        //     uni.reLaunch({ url: '/pages/login/index' })
        //   },
        // })
        // return Promise.reject(res)

        uni.hideLoading()
        return showErrorAlert(res, '登录已过期,请重新登录')
      },

      // 无权限
      403: () => {
        uni.hideLoading()
        return showErrorAlert(res, msg || '暂无权限访问')
      },

      // 服务器错误
      500: () => {
        uni.hideLoading()
        return showErrorAlert(res, msg || '服务器错误,请稍后重试')
      },
    }

    const handler = CODE_HANDLERS[code]
    if (handler) {
      return handler()
    }

    console.warn(`未处理的响应码: ${code}`, res)
    return res
  }
}
export default { install }
