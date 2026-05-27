<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <view class="page-content">
      <!-- 标题 -->
      <view class="header-section">
        <view class="header-icon" :style="{ background: uni.$u.color.primaryLight }">
          <yy-icon name="ri:shield-check-line" size="28" :color="uni.$u.color.primary" />
        </view>
        <text class="header-title">隐私与协议</text>
        <text class="header-subtitle">我们重视您的隐私，请仔细阅读以下条款</text>
      </view>

      <!-- 用户协议与隐私政策 -->
      <view class="section-card">
        <view class="section-header">
          <yy-icon name="ri:file-text-line" size="18" :color="uni.$u.color.primary" />
          <text class="section-title">用户协议与隐私政策</text>
        </view>
        <text class="section-desc">
          请你务必审慎阅读、充分理解"用户协议"和"隐私政策"各条款，包括但不限于：为了更好的向你提供服务，我们需要收集你的设备标识、操作日志等信息用于分析、优化应用性能。
        </text>
        <view class="link-list">
          <view class="link-item" @click="openUrl('https://www.diaodiandaren.com/api/cms.article/view?code=user_agreement&server=true')">
            <yy-icon name="ri:link-m" size="16" :color="uni.$u.color.primary" />
            <text class="link-text">《用户协议》</text>
            <yy-icon name="ri:external-link-line" size="14" color="#9ca3af" />
          </view>
          <view class="link-item" @click="openUrl('https://www.diaodiandaren.com/api/cms.article/view?code=privacy_policy&server=true')">
            <yy-icon name="ri:link-m" size="16" :color="uni.$u.color.primary" />
            <text class="link-text">《隐私政策》</text>
            <yy-icon name="ri:external-link-line" size="14" color="#9ca3af" />
          </view>
        </view>
      </view>

      <!-- 信息收集与使用 -->
      <view class="section-card">
        <view class="section-header">
          <yy-icon name="ri:database-2-line" size="18" :color="uni.$u.color.primary" />
          <text class="section-title">信息收集与使用</text>
        </view>
        <text class="section-desc">
          为了提供挪车服务，我们会收集和使用以下信息：
        </text>
        <view class="info-list">
          <view v-for="(item, idx) in collectInfoList" :key="idx" class="info-item">
            <view class="info-dot" :style="{ background: uni.$u.color.primary }"></view>
            <view class="info-content">
              <text class="info-label">{{ item.label }}</text>
              <text class="info-desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 隐私保护功能 -->
      <view class="section-card">
        <view class="section-header">
          <yy-icon name="ri:shield-user-line" size="18" :color="uni.$u.color.primary" />
          <text class="section-title">隐私保护功能</text>
        </view>
        <view class="feature-list">
          <view v-for="(item, idx) in privacyFeatures" :key="idx" class="feature-item">
            <view class="feature-icon-wrap" :style="{ background: item.bgColor }">
              <yy-icon :name="item.icon" size="20" :color="item.color" />
            </view>
            <view class="feature-content">
              <text class="feature-label">{{ item.label }}</text>
              <text class="feature-desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 数据安全保障 -->
      <view class="section-card">
        <view class="section-header">
          <yy-icon name="ri:shield-check-line" size="18" :color="uni.$u.color.primary" />
          <text class="section-title">数据安全保障</text>
        </view>
        <view class="security-grid">
          <view v-for="(item, idx) in securityItems" :key="idx" class="security-item">
            <view class="security-icon" :style="{ background: `${item.color}15` }">
              <yy-icon :name="item.icon" size="18" :color="item.color" />
            </view>
            <text class="security-title">{{ item.title }}</text>
            <text class="security-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 挪车码使用说明 -->
      <view class="section-card">
        <view class="section-header">
          <yy-icon name="ri:qr-code-line" size="18" :color="uni.$u.color.primary" />
          <text class="section-title">挪车码使用说明</text>
        </view>
        <text class="section-desc">
          当您生成挪车码并张贴在车窗上时，他人扫码后将看到您的车辆信息。我们提供以下保护措施：
        </text>
        <view class="info-list">
          <view class="info-item">
            <view class="info-dot" :style="{ background: uni.$u.color.primary }"></view>
            <view class="info-content">
              <text class="info-label">隐藏真实手机号</text>
              <text class="info-desc">他人扫码后仅能通过小程序联系，不显示真实号码，保护车主隐私不被泄露</text>
            </view>
          </view>
          <view class="info-item">
            <view class="info-dot" :style="{ background: uni.$u.color.primary }"></view>
            <view class="info-content">
              <text class="info-label">号码全程加密</text>
              <text class="info-desc">您的手机号等个人信息采用AES-256加密存储，所有数据通过加密通道传输</text>
            </view>
          </view>
          <view class="info-item">
            <view class="info-dot" :style="{ background: uni.$u.color.primary }"></view>
            <view class="info-content">
              <text class="info-label">隐私通话模式</text>
              <text class="info-desc">开启后对方只能通过虚拟号码与您通话，全程无法看到您的真实号码</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 首页车牌查询说明 -->
      <view class="section-card">
        <view class="section-header">
          <yy-icon name="ri:search-eye-line" size="18" :color="uni.$u.color.primary" />
          <text class="section-title">车牌查询说明</text>
        </view>
        <text class="section-desc">
          在首页输入车牌号查询车主时，我们仅展示车主允许公开的信息。已注册车主可选择隐藏真实手机号，查询方只能通过小程序发起联系，无法直接获取对方号码。未注册车辆将提示通过其他方式联系（如拨打114）。
        </text>
      </view>

      <!-- 常见隐私问题 -->
      <view class="section-card">
        <view class="section-header">
          <yy-icon name="ri:question-answer-line" size="18" :color="uni.$u.color.primary" />
          <text class="section-title">常见隐私问题</text>
        </view>
        <view class="faq-list">
          <view v-for="(item, idx) in faqList" :key="idx" class="faq-item" @click="toggleFaq(idx)">
            <view class="faq-question">
              <text class="faq-q-text">{{ item.question }}</text>
              <yy-icon :name="item.expanded ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" size="18" color="#9ca3af" />
            </view>
            <view v-if="item.expanded" class="faq-answer">
              <text class="faq-a-text">{{ item.answer }}</text>
            </view>
          </view>
        </view>
      </view>

      <view style="height: 40rpx"></view>
    </view>
  </yy-paging>
</template>

<script setup>
  const pagingConfig = ref({
    auto: false,
    refresherEnabled: false,
    showRefresherWhenReload: false,
    loadingMoreEnabled: false,
    showTabbar: false,
    hideNav: false,
    showNavBack: true,
    navTitle: '隐私与协议',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    dataList: [],
  })

  const paging = ref()

  // ====== 信息收集列表 ======
  const collectInfoList = [
    {
      label: '手机号码',
      desc: '用于挪车联系和账号绑定，仅您授权时向查询方展示（可选择隐藏）',
    },
    {
      label: '车辆信息',
      desc: '车牌号、车辆描述等，用于生成挪车码和他人查询时展示',
    },
    {
      label: '设备标识',
      desc: '设备型号、操作系统版本等，用于分析应用性能、优化用户体验',
    },
    {
      label: '操作日志',
      desc: '页面访问、功能使用等行为数据，用于改进服务质量',
    },
    {
      label: '位置信息（选填）',
      desc: '仅在您授权时获取，用于方便自动填写地址等场景',
    },
  ]

  // ====== 隐私保护功能 ======
  const privacyFeatures = [
    {
      icon: 'ri:shield-user-line',
      label: '隐藏真实手机号',
      desc: '他人扫码后仅能通过小程序联系，不显示真实号码',
      color: '#7c3aed',
      bgColor: '#f5f3ff',
    },
    {
      icon: 'ri:lock-line',
      label: '数据加密存储',
      desc: '真实手机号全程AES-256加密存储，严格保护个人信息',
      color: '#2563eb',
      bgColor: '#eff6ff',
    },
    {
      icon: 'ri:notification-3-line',
      label: '接收挪车通知',
      desc: '开启后他人扫码或搜索您的车辆时推送通知，及时响应',
      color: '#d97706',
      bgColor: '#fffbeb',
    },
    {
      icon: 'ri:shield-user-line',
      label: '虚拟号码通话',
      desc: '通过虚拟号码中转，保护双方真实手机号不被泄露',
      color: '#059669',
      bgColor: '#ecfdf5',
    },
  ]

  // ====== 数据安全 ======
  const securityItems = [
    {
      icon: 'ri:lock-line',
      title: '加密传输',
      desc: '所有数据通过TLS加密通道传输',
      color: '#2563eb',
    },
    {
      icon: 'ri:shield-check-line',
      title: '加密存储',
      desc: '用户信息采用AES-256加密存储',
      color: '#059669',
    },
    {
      icon: 'ri:shield-user-line',
      title: '隐私号码',
      desc: '支持隐藏真实号码，虚拟号沟通',
      color: '#7c3aed',
    },
    {
      icon: 'ri:secure-payment-line',
      title: '安全认证',
      desc: '微信生态认证，安全有保障',
      color: '#d97706',
    },
  ]

  // ====== 常见隐私问题 ======
  const faqList = ref([
    {
      question: '我的个人信息会被泄露吗？',
      answer: '不会。您可以选择"隐藏真实手机号"，他人只能通过小程序联系您，不会看到您的真实号码。所有数据均经过加密存储，严格保障您的隐私安全。',
      expanded: true,
    },
    {
      question: '我的电话号码会被泄露吗？',
      answer: '不会。我们提供隐私保护功能，开启后您的真实手机号将被隐藏，对方只能通过虚拟号码与您通话，全程无法看到您的真实号码。所有数据均采用加密存储。',
      expanded: true,
    },
    {
      question: '挪车助手收集哪些信息？',
      answer: '我们收集的信息包括：手机号码（用于挪车联系）、车辆信息（车牌号等）、设备标识和操作日志（用于优化性能）。所有信息均经过您的授权，并严格按照隐私政策进行保护。',
      expanded: true,
    },
    {
      question: '如何开启隐藏号码功能？',
      answer: '在"我的车辆"页面编辑车辆信息时，找到"隐藏真实手机号"开关，打开即可。开启后他人扫码或搜索您的车辆时将不显示您的真实手机号。',
      expanded: true,
    },
    {
      question: '如何接收挪车通知？',
      answer: '在"我的车辆"页面开启"接收挪车通知"开关，并按照引导配置pushplus推送服务。当有人联系您挪车时，您将及时收到微信消息通知。',
      expanded: true,
    },
  ])

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  async function queryList(page, limit) {
    await new Promise(resolve => setTimeout(resolve, 50))
    paging.value?.complete([])
  }

  function toggleFaq(index) {
    faqList.value[index].expanded = !faqList.value[index].expanded
  }

  function openUrl(url) {
    // #ifdef H5
    window.open(url, '_blank')
    // #endif
    // #ifdef MP-WEIXIN
    vk.toast('请在浏览器中打开查看')
    // #endif
    // #ifdef APP-PLUS
    plus.runtime.openURL(url)
    // #endif
  }
</script>

<style lang="scss" scoped>
  .page-content {
    min-height: 100vh;
    background: #f5f7fb;
    padding-bottom: 24rpx;
  }

  /* 标题区 */
  .header-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px 16px;
  }

  .header-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
  }

  .header-title {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .header-subtitle {
    font-size: 13px;
    color: #9ca3af;
    text-align: center;
  }

  /* 卡片 */
  .section-card {
    margin: 0 16px 12px;
    background: #ffffff;
    border-radius: 20px;
    padding: 18px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
  }

  .section-desc {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.6;
    display: block;
    margin-bottom: 12px;
  }

  /* 链接列表 */
  .link-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .link-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: #f9fafb;
    border-radius: 12px;

    &:active {
      opacity: 0.7;
    }
  }

  .link-text {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  /* 信息列表 */
  .info-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .info-item {
    display: flex;
    gap: 10px;
  }

  .info-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-top: 7px;
    flex-shrink: 0;
  }

  .info-content {
    flex: 1;
  }

  .info-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 2px;
  }

  .info-desc {
    display: block;
    font-size: 12px;
    color: #9ca3af;
    line-height: 1.5;
  }

  /* 功能列表 */
  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .feature-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .feature-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .feature-content {
    flex: 1;
  }

  .feature-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 2px;
  }

  .feature-desc {
    display: block;
    font-size: 12px;
    color: #9ca3af;
    line-height: 1.5;
  }

  /* 安全网格 */
  .security-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .security-item {
    background: #f9fafb;
    border-radius: 14px;
    padding: 14px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .security-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  .security-title {
    font-size: 13px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 2px;
  }

  .security-desc {
    font-size: 11px;
    color: #9ca3af;
    line-height: 1.4;
  }

  /* FAQ */
  .faq-list {
    display: flex;
    flex-direction: column;
  }

  .faq-item {
    border-bottom: 1px solid #f3f4f6;
    padding: 12px 0;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &:first-child {
      padding-top: 0;
    }
  }

  .faq-question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .faq-q-text {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    flex: 1;
    line-height: 1.5;
  }

  .faq-answer {
    margin-top: 8px;
    padding: 10px 12px;
    background: #f9fafb;
    border-radius: 10px;
  }

  .faq-a-text {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.6;
  }
</style>
