<template>
  <u-popup v-model="props.modelValue" mode="bottom" border-radius="20" @close="closePopup">
    <view class="flex flex-col gap-3 p-3 bg-white">
      <view class="flex flex-col gap-1">
        <view class="text-lg font-semibold text-gray-900">获取您的昵称、头像</view>
        <view class="text-sm text-gray-400">提供具有辨识度的用户中心界面</view>
      </view>

      <view class="flex items-center justify-center py-2">
        <button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <view
            class="bg-gray-50 flex items-center justify-center w-16 h-16 overflow-hidden border-2 rounded-full"
            :style="{ borderColor: `${uni.$u.color.primary}30` }"
          >
            <u-image
              width="100%"
              height="100%"
              :src="funImage(state?.userInfo?.avatar || '')"
              mode="aspectFill"
              class="size-full"
            ></u-image>
          </view>
        </button>
      </view>

      <view class="flex flex-col gap-3">
        <view class="flex items-center justify-between gap-3">
          <view class="text-sm font-medium text-gray-800">姓名</view>
          <u-input
            v-model="state.userInfo.nickname"
            type="nickname"
            placeholder="请输入姓名"
            clearable
            class="!text-right"
            input-align="right"
          ></u-input>
        </view>
        <view class="flex items-center justify-between gap-3">
          <view class="text-sm font-medium text-gray-800">性别</view>
          <u-radio-group v-model="state.userInfo.gender" direction="horizontal">
            <u-radio name="男">男</u-radio>
            <u-radio name="女">女</u-radio>
          </u-radio-group>
        </view>
      </view>

      <u-button type="primary" shape="circle" :customStyle="{ height: '44px' }" @click="confirmSubmission">
        确认修改
      </u-button>
    </view>
  </u-popup>
</template>

<script setup>
  const emit = defineEmits(['update:modelValue', 'success'])
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: Object,
      default: () => ({}),
    },
  })
  const state = ref({
    userInfo: {},
    action: import.meta.env.VITE_UPLOAD_BASE_URL,
    baseurl: import.meta.env.VITE_API_BASE_URL,
    maxSize: 3, // 3M
  })

  watch(
    () => props.userInfo,
    newValue => {
      state.value.userInfo = {
        nickname: newValue.nickname || '',
        gender: newValue.gender == 1 ? '男' : '女',
        avatar: newValue.avatar || '',
      }
    },
    {
      immediate: true,
      deep: true,
    },
  )

  const confirmSubmission = async () => {
    const { avatar, nickname, gender } = state.value.userInfo

    await api.updateUserInfo({
      nickname,
      avatar: avatar,
      gender: gender === '男' ? 1 : 0,
    })

    emit('update:modelValue', false)
    emit('success')
  }

  const closePopup = () => {
    emit('update:modelValue', false)
  }

  const onChooseAvatar = async e => {
    const { avatarUrl } = e.detail

    const MAX_SIZE = state.value.maxSize * 1024 * 1024 // 3M

    // 验证图片大小
    const { size } = await uni.getFileInfo({ filePath: avatarUrl })
    if (size > MAX_SIZE) {
      return vk.toast('图片大小不能超过3M')
    }

    // 上传图片
    vk.showLoading('上传中...')
    const { data: uploadData } = await uni.uploadFile({
      url: state.value.action,
      filePath: avatarUrl,
      name: 'file',
      header: {
        token: uni.vk.getStorageSync('uni_id_token'),
      },
    })

    const result = JSON.parse(uploadData)

    console.log('🚀 ~ :95 ~ if ~ result:', result)
    state.value.userInfo.avatar = result.data.url

    vk.hideLoading()
  }

  const funImage = url => {
    console.log('🚀 ~ :107 ~ funImage ~ url:', url)
    // 判断是不是 http开头  不是就凭借上 是就不拼接
    return url.startsWith('http') ? url : state.value.baseurl + url
  }
</script>

<style lang="scss" scoped>
  button {
    background: none;
    background-color: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
    --button-hover-bg-color: transparent;
    tap-highlight-color: transparent;
    -webkit-tap-highlight-color: transparent;
    line-height: normal;
    box-sizing: border-box;
  }
  button::after {
    border: none !important;
    border-radius: 0 !important;
  }
</style>
