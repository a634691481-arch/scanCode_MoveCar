<template>
  <view class="yy-upload">
    <view class="grid" :class="gridClass">
      <!-- 已上传的图片列表 -->
      <view
        v-for="(item, index) in imageList"
        :key="index"
        class="aspect-square rounded-md bg-[#F4F5F6] relative overflow-hidden"
      >
        <!-- 删除按钮 -->
        <view
          v-if="!disabled"
          @click="removeImage(index)"
          class="size-4 absolute top-1 right-1 bg-[#fa3534] rounded-full overflow-hidden flex items-center justify-center z-50"
        >
          <u-icon name="close" size="14" color="#fff"></u-icon>
        </view>
        <!-- 图片/视频预览 -->

        <image
          v-if="mediaType === 'image'"
          :src="formatUrl(typeof item === 'string' ? item : item.url)"
          class="object-cover w-full h-full"
          mode="aspectFill"
          @click="previewImage(index)"
        ></image>

        <!-- @click="previewVideo(index)" -->
        <view v-else class="relative w-full h-full">
          <video
            :src="formatUrl(typeof item === 'string' ? item : item.url)"
            class="w-full h-full"
            :controls="false"
            :show-center-play-btn="false"
          ></video>
          <view class="bg-black/10 absolute inset-0 flex items-center justify-center pointer-events-none">
            <u-icon name="play-right-fill" size="24" color="#fff"></u-icon>
          </view>
        </view>
        <!-- 加载中遮罩 -->
        <view v-if="item.loading" class="bg-black/50 absolute inset-0 flex items-center justify-center">
          <u-loading mode="circle" color="#fff"></u-loading>
        </view>
      </view>

      <!-- 上传按钮 -->
      <view
        v-if="showUploadBtn"
        @click="chooseMedia"
        class="aspect-square rounded-md bg-[#F4F5F6] flex flex-col justify-center gap-2 items-center cursor-pointer"
      >
        <u-icon name="plus" size="40" color="#909399"></u-icon>
        <view class="text-xs text-[#606266]">{{ displayUploadText }}</view>
        <view v-if="maxCount > 1" class="text-xs text-[#909399]">{{ imageList.length }}/{{ maxCount }}</view>
      </view>
    </view>

    <!-- 提示文字 -->
    <view v-if="tips" class="text-xs text-[#909399] mt-2">{{ tips }}</view>
  </view>
</template>
<!-- 图片上传（默认） -->
<!-- <yy-upload v-model="images" :max-count="9" /> -->

<!-- 视频上传 -->
<!-- <yy-upload v-model="videos" mediaType="video" :max-count="1" tips="支持上传1个视频" /> -->

<script setup>
  // Props 定义
  const props = defineProps({
    // v-model 绑定的图片列表
    modelValue: {
      type: Array,
      default: () => []
    },
    // 最大上传数量
    maxCount: {
      type: Number,
      default: 9
    },
    // 最大文件大小(MB)
    maxSize: {
      type: Number,
      default: 3
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 图片压缩类型
    sizeType: {
      type: Array,
      default: () => ['compressed']
    },
    // 图片来源
    sourceType: {
      type: Array,
      default: () => ['album', 'camera']
    },
    // 每行显示数量
    column: {
      type: Number,
      default: 3
    },
    // 上传按钮文字
    uploadText: {
      type: String,
      default: ''
    },
    // 媒体类型 image | video
    mediaType: {
      type: String,
      default: 'image'
    },
    // 提示文字
    tips: {
      type: String,
      default: ''
    }
  })

  // Emits 定义
  const emit = defineEmits(['update:modelValue', 'success', 'error', 'delete'])

  // 图片列表
  const imageList = ref([])

  // 格式化 URL
  const formatUrl = url => {
    if (!url) return ''
    if (url.indexOf('http') === 0 || url.indexOf('blob') === 0) {
      return url
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    return baseUrl + url
  }

  // 监听 modelValue 变化
  watch(
    () => props.modelValue,
    newVal => {
      imageList.value = newVal || []
    },
    { immediate: true, deep: true }
  )

  // 计算网格类
  const gridClass = computed(() => {
    const cols = props.column
    return `grid-cols-${cols} gap-3`
  })

  // 计算显示的上传文字
  const displayUploadText = computed(() => {
    if (props.uploadText) return props.uploadText
    return props.mediaType === 'video' ? '选择视频' : '选择图片'
  })

  // 是否显示上传按钮
  const showUploadBtn = computed(() => {
    return !props.disabled && imageList.value.length < props.maxCount
  })

  // 选择媒体
  const chooseMedia = async () => {
    if (props.disabled) return

    const remainCount = props.maxCount - imageList.value.length
    if (remainCount <= 0) {
      const typeText = props.mediaType === 'video' ? '个视频' : '张图片'
      vk.toast(`最多只能上传${props.maxCount}${typeText}`)
      return
    }

    try {
      if (props.mediaType === 'video') {
        // 选择视频
        const { tempFilePath } = await uni.chooseVideo({
          sourceType: props.sourceType,
          compressed: true
        })
        await uploadImage(tempFilePath)
      } else {
        // 选择图片
        const { tempFilePaths } = await uni.chooseImage({
          count: remainCount,
          sizeType: props.sizeType,
          sourceType: props.sourceType
        })

        // 逐个上传图片
        for (let i = 0; i < tempFilePaths.length; i++) {
          await uploadImage(tempFilePaths[i])
        }
      }
    } catch (error) {
      console.error('选择媒体失败:', error)
    }
  }

  // 上传媒体文件
  const uploadImage = async tempFilePath => {
    const action = import.meta.env.VITE_UPLOAD_BASE_URL
    const MAX_SIZE = props.maxSize * 1024 * 1024

    try {
      // 验证文件大小
      const { size } = await uni.getFileInfo({ filePath: tempFilePath })
      if (size > MAX_SIZE) {
        vk.toast(`文件大小不能超过${props.maxSize}M`)
        emit('error', { message: `文件大小不能超过${props.maxSize}M` })
        return
      }

      // 添加加载状态的临时媒体
      const tempIndex = imageList.value.length
      imageList.value.push({ url: tempFilePath, loading: true })

      // 上传文件
      vk.showLoading('上传中...')
      const { data: uploadData } = await uni.uploadFile({
        url: action,
        filePath: tempFilePath,
        name: 'file',
        header: {
          token: vk.getStorageSync('uni_id_token')
        }
      })

      const result = JSON.parse(uploadData)
      if (result.code === 1 && result.data?.url) {
        // 更新媒体列表
        imageList.value[tempIndex] = result.data.url
        emit('update:modelValue', imageList.value)
        emit('success', { url: result.data.url, index: tempIndex })
        // vk.toast('上传成功')
      } else {
        // 上传失败,移除临时媒体
        imageList.value.splice(tempIndex, 1)
        vk.toast(result.msg || '上传失败')
        emit('error', { message: result.msg || '上传失败' })
      }
    } catch (error) {
      console.error('上传失败:', error)
      // 移除失败的临时媒体
      const failIndex = imageList.value.findIndex(item => item.loading)
      if (failIndex > -1) {
        imageList.value.splice(failIndex, 1)
      }
      vk.toast('上传失败，请重试')
      emit('error', error)
    } finally {
      uni.hideLoading()
    }
  }

  // 移除图片
  const removeImage = index => {
    const removedImage = imageList.value[index]
    imageList.value.splice(index, 1)
    emit('update:modelValue', imageList.value)
    emit('delete', { url: removedImage, index })
  }

  // 预览图片
  const previewImage = index => {
    if (props.mediaType === 'video') return
    const urls = imageList.value
      .filter(item => typeof item === 'string' || (item && item.url))
      .map(item => {
        const url = typeof item === 'string' ? item : item.url
        return formatUrl(url)
      })
    uni.previewImage({
      urls: urls,
      current: index
    })
  }

  // 预览视频
  const previewVideo = index => {
    let url = typeof imageList.value[index] === 'string' ? imageList.value[index] : imageList.value[index].url
    if (!url) return
    url = formatUrl(url)
    if (uni.previewMedia) {
      uni.previewMedia({
        sources: [{ url, type: 'video' }]
      })
    } else {
      uni.previewImage({
        urls: [url],
        current: 0
      })
    }
  }
</script>

<script>
  export default {
    name: 'yy-upload',
    inheritAttrs: false
  }
</script>

<style lang="scss" scoped>
  .yy-upload {
    .cursor-pointer {
      cursor: pointer;
    }
  }
</style>
