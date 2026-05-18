<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <view class="page-content">
      <!-- 用户头像区 -->
      <view class="profile-section" :style="profileSectionStyle">
        <view class="avatar-wrap" :style="avatarWrapStyle">
          <view class="avatar" :style="avatarStyle">
            <yy-icon name="ri:user-3-fill" size="40" color="#ffffff" />
          </view>
        </view>
        <text class="profile-name">{{ form.ownerName || '车主用户' }}</text>
        <text class="profile-stat">已设置 {{ savedCarsCount }} 辆车</text>
      </view>

      <!-- 车辆信息卡片 -->
      <view class="info-card">
        <view class="card-header">
          <view class="card-title-row">
            <view class="card-icon">
              <yy-icon name="ri:car-line" size="20" :color="uni.$u.color.primary" />
            </view>
            <text class="card-title">我的车辆信息</text>
          </view>
          <text v-if="hasSaved" class="card-status">
            <view class="status-dot"></view>
            已保存
          </text>
        </view>

        <!-- 车牌号 -->
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">车牌号码</text>
            <text class="label-required">*</text>
          </view>
          <view class="plate-input-row" @click="showPlateKeyboard">
            <template v-for="(char, idx) in plateChars" :key="idx">
              <view v-if="idx === 2" class="plate-separator-dot"></view>
              <view
                class="plate-cell"
                :class="{
                  'plate-cell-filled': char,
                  'plate-cell-province': idx === 0,
                }"
              >
                <text class="plate-cell-text">{{ char || '' }}</text>
              </view>
            </template>
          </view>
        </view>

        <!-- 车型/颜色（可选） -->
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">车辆描述</text>
            <text class="label-tip">（可选）</text>
          </view>
          <input
            v-model="form.carDesc"
            class="form-input"
            placeholder="例如：白色丰田凯美瑞"
            placeholder-class="form-placeholder"
            maxlength="20"
          />
        </view>

        <!-- 联系电话 -->
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">联系电话</text>
            <text class="label-required">*</text>
          </view>
          <input
            v-model="form.phone"
            class="form-input"
            placeholder="请输入手机号"
            placeholder-class="form-placeholder"
            type="number"
            maxlength="11"
          />
        </view>

        <!-- 联系说明 -->
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">联系说明</text>
            <text class="label-tip">（可选）</text>
          </view>
          <textarea
            v-model="form.note"
            class="form-textarea"
            placeholder="例如：开会中不便接电话，稍后会回电"
            placeholder-class="form-placeholder"
            maxlength="80"
            :show-confirm-bar="false"
            auto-height
          />
          <text class="char-count">{{ form.note.length }}/80</text>
        </view>

        <!-- 保存按钮 -->
        <view
          class="save-btn"
          :class="{ 'save-btn-disabled': !canSave }"
          :style="canSave ? saveBtnStyle : {}"
          @click="saveInfo"
        >
          <yy-icon name="ri:save-line" size="18" color="#ffffff" />
          <text class="save-btn-text">保存车辆信息</text>
        </view>
      </view>

      <!-- 隐私设置 -->
      <view class="privacy-card">
        <view class="card-title-row" style="margin-bottom: 12px">
          <view class="card-icon" style="background: #f0fdf4">
            <yy-icon name="ri:shield-check-line" size="20" color="#16a34a" />
          </view>
          <text class="card-title">隐私保护</text>
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-label">隐藏真实手机号</text>
            <text class="setting-desc">他人扫码后仅能通过小程序联系，不显示真实号码</text>
          </view>
          <u-switch
            v-model="form.hidePhone"
            :activeColor="uni.$u.color.primary"
            size="34"
          />
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-label">允许语音通话</text>
            <text class="setting-desc">允许他人在小程序内向您发起语音通话</text>
          </view>
          <u-switch
            v-model="form.allowVoiceCall"
            :activeColor="uni.$u.color.primary"
            size="34"
          />
        </view>

        <view class="setting-item" style="border-bottom: none">
          <view class="setting-info">
            <text class="setting-label">接收挪车通知</text>
            <text class="setting-desc">他人扫码或搜索您的车辆时推送通知</text>
          </view>
          <u-switch
            v-model="form.receiveNotify"
            :activeColor="uni.$u.color.primary"
            size="34"
          />
        </view>
      </view>

      <!-- 功能列表 -->
      <view class="menu-card">
        <view class="menu-item" @click="toQrcode">
          <view class="menu-icon" style="background: var(--u-type-primary-light)">
            <yy-icon name="ri:qr-code-line" size="20" :color="uni.$u.color.primary" />
          </view>
          <view class="menu-content">
            <text class="menu-label">我的挪车码</text>
            <text class="menu-desc">生成专属二维码贴在车窗</text>
          </view>
          <yy-icon name="ri:arrow-right-s-line" size="20" color="#9ca3af" />
        </view>

        <view class="menu-item" @click="shareApp">
          <view class="menu-icon" style="background: #f0fdf4">
            <yy-icon name="ri:share-forward-line" size="20" color="#16a34a" />
          </view>
          <view class="menu-content">
            <text class="menu-label">分享给朋友</text>
            <text class="menu-desc">推荐挪车助手给好友</text>
          </view>
          <yy-icon name="ri:arrow-right-s-line" size="20" color="#9ca3af" />
        </view>

        <view class="menu-item" @click="showThemePicker">
          <view class="menu-icon" :style="{ background: uni.$u.color.primaryLight }">
            <yy-icon name="ri:palette-line" size="20" :color="uni.$u.color.primary" />
          </view>
          <view class="menu-content">
            <text class="menu-label">主题设置</text>
            <text class="menu-desc">切换应用主题色</text>
          </view>
          <yy-icon name="ri:arrow-right-s-line" size="20" color="#9ca3af" />
        </view>

        <view class="menu-item" @click="showAbout">
          <view class="menu-icon" style="background: #faf5ff">
            <yy-icon name="ri:information-line" size="20" color="#9333ea" />
          </view>
          <view class="menu-content">
            <text class="menu-label">关于我们</text>
            <text class="menu-desc">v1.0.0</text>
          </view>
          <yy-icon name="ri:arrow-right-s-line" size="20" color="#9ca3af" />
        </view>
      </view>

      <view style="height: 40rpx"></view>
    </view>

    <!-- 车牌输入键盘组件 -->
    <yy-plate-keyboard v-model:visible="keyboardVisible" v-model="form.plate" />

    <!-- 主题选择弹框 -->
    <yy-theme-picker v-model="themePickerVisible" />
  </yy-paging>
</template>

<script setup>
  // ====== yy-paging 配置 ======
  const pagingConfig = ref({
    auto: false,
    refresherEnabled: false,
    showRefresherWhenReload: false,
    loadingMoreEnabled: false,
    showTabbar: false,
    hideNav: false,
    showNavBack: true,
    navTitle: '我的',
    color: uni.$u.color.primary,
  })

  const state = ref({
    isScroll: false,
    dataList: [],
  })

  const paging = ref()

  // ====== 业务状态 ======
  const keyboardVisible = ref(false)
  const themePickerVisible = ref(false)

  const form = ref({
    plate: '',
    carDesc: '',
    phone: '',
    note: '',
    ownerName: '',
    hidePhone: false,
    allowVoiceCall: true,
    receiveNotify: true,
  })

  const hasSaved = ref(false)
  const savedCarsCount = computed(() => (form.value.plate ? 1 : 0))

  const plateChars = computed(() => {
    const chars = form.value.plate.split('')
    while (chars.length < 8) chars.push('')
    return chars
  })

  const canSave = computed(() => {
    return form.value.plate.length >= 7 && /^1[3-9]\d{9}$/.test(form.value.phone)
  })

  const profileSectionStyle = computed(() => ({
    background: `linear-gradient(135deg, ${uni.$u.color.primary} 0%, ${uni.$u.color.primaryDark} 60%, ${uni.$u.color.primary} 100%)`,
  }))

  const avatarWrapStyle = computed(() => ({
    boxShadow: `0 8px 24px ${uni.$u.color.primary}40`,
  }))

  const avatarStyle = computed(() => ({
    background: `linear-gradient(135deg, ${uni.$u.color.primaryDisabled}, ${uni.$u.color.primary})`,
  }))

  const saveBtnStyle = computed(() => ({
    background: `linear-gradient(135deg, ${uni.$u.color.primary}, ${uni.$u.color.primaryDark})`,
    boxShadow: `0 6px 16px ${uni.$u.color.primary}4d`,
  }))

  onLoad(() => {
    loadInfo()
  })

  onShow(() => {
    loadInfo()
  })

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  async function queryList(page, limit) {
    await new Promise(resolve => setTimeout(resolve, 50))
    paging.value?.complete([])
  }

  function loadInfo() {
    const saved = vk.getStorageSync('my_car_info')
    if (saved) {
      form.value = { ...form.value, ...saved }
      hasSaved.value = true
    }
  }

  function showPlateKeyboard() {
    keyboardVisible.value = true
  }

  function saveInfo() {
    if (!canSave.value) {
      if (form.value.plate.length < 7) {
        vk.toast('请输入完整车牌号')
        return
      }
      if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
        vk.toast('请输入正确的手机号')
        return
      }
    }

    vk.setStorageSync('my_car_info', form.value)
    hasSaved.value = true

    vk.toast('保存成功', 'success')
  }

  function toQrcode() {
    if (!hasSaved.value) {
      vk.toast('请先保存车辆信息')
      return
    }
    vk.navigateTo('/pages/my/qrcode')
  }

  function shareApp() {
    vk.toast('请点击右上角分享')
  }

  function showAbout() {
    vk.alert('一款便捷的挪车工具，帮助您快速联系车主或被联系，让出行更高效。\n\n版本：v1.0.0', '关于挪车助手', '我知道了')
  }

  function showThemePicker() {
    themePickerVisible.value = true
  }
</script>

<style lang="scss" scoped>
  .page-content {
    min-height: 100vh;
    background: #f5f7fb;
    padding-bottom: 24rpx;
  }

  /* 用户头像区 */
  .profile-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0 24px;
  }

  .avatar-wrap {
    width: 88px;
    height: 88px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    padding: 4px;
  }

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-name {
    margin-top: 12px;
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
  }

  .profile-stat {
    margin-top: 4px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.85);
  }

  /* 信息卡片 */
  .info-card {
    margin: 16px 16px 0;
    background: #ffffff;
    border-radius: 20px;
    padding: 18px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .card-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-icon {
    width: 32px;
    height: 32px;
    background: var(--u-type-primary-light);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }

  .card-status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #16a34a;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    background: #16a34a;
    border-radius: 50%;
  }

  /* 表单 */
  .form-item {
    margin-bottom: 16px;
    position: relative;
  }

  .form-label {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
  }

  .label-text {
    font-size: 13px;
    color: #4b5563;
    font-weight: 500;
  }

  .label-required {
    font-size: 13px;
    color: #ef4444;
  }

  .label-tip {
    font-size: 11px;
    color: #9ca3af;
  }

  .form-input {
    width: 100%;
    height: 44px;
    padding: 0 14px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    font-size: 14px;
    color: #111827;
    box-sizing: border-box;
  }

  .form-placeholder {
    color: #9ca3af;
    font-size: 14px;
  }

  .form-textarea {
    width: 100%;
    min-height: 64px;
    padding: 12px 14px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    font-size: 14px;
    color: #111827;
    box-sizing: border-box;
    line-height: 1.5;
  }

  .char-count {
    position: absolute;
    right: 12px;
    bottom: 8px;
    font-size: 11px;
    color: #9ca3af;
  }

  /* 车牌输入行 */
  .plate-input-row {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 10px;
    background: #f9fafb;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    justify-content: center;
  }

  .plate-cell {
    width: 36px;
    height: 44px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    position: relative;

    &.plate-cell-filled {
      border-color: var(--u-type-primary);
    }

    &.plate-cell-province {
      background: var(--u-type-primary);
      border-color: var(--u-type-primary);

      .plate-cell-text {
        color: #ffffff;
        font-weight: 700;
      }
    }
  }

  .plate-separator-dot {
    width: 7px;
    height: 7px;
    background: var(--u-type-primary);
    border-radius: 50%;
    flex-shrink: 0;
    margin: 0 2px;
  }

  .plate-cell-text {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
  }

  /* 保存按钮 */
  .save-btn {
    margin-top: 8px;
    height: 50px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    &:active {
      opacity: 0.9;
      transform: scale(0.99);
    }

    &.save-btn-disabled {
      background: #d1d5db;
      box-shadow: none;
    }
  }

  .save-btn-text {
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
  }

  /* 隐私设置卡片 */
  .privacy-card {
    margin: 12px 16px 0;
    background: #ffffff;
    border-radius: 20px;
    padding: 18px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  }

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid #f3f4f6;
    gap: 12px;
  }

  .setting-info {
    flex: 1;
  }

  .setting-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .setting-desc {
    display: block;
    font-size: 12px;
    color: #9ca3af;
    line-height: 1.4;
  }

  /* 菜单卡片 */
  .menu-card {
    margin: 12px 16px 0;
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    border-bottom: 1px solid #f3f4f6;
    &:last-child {
      border-bottom: none;
    }
    &:active {
      background: #f9fafb;
    }
  }

  .menu-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu-content {
    flex: 1;
  }

  .menu-label {
    display: block;
    font-size: 15px;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 2px;
  }

  .menu-desc {
    display: block;
    font-size: 12px;
    color: #9ca3af;
  }
</style>
