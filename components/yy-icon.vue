<template>
  <u-image
    :src="iconSrc"
    :width="iconSize"
    :height="iconSize"
    mode="aspectFill"
    :lazy-load="lazyLoad"
    :fade="fade"
    :show-loading="showLoading"
    :show-error="showError"
    :loading-icon="loadingIcon"
    :error-icon="errorIcon"
    :bg-color="bgColor"
    :border-radius="borderRadius"
    :shape="shape"
    @error="onError"
    @load="$emit('load', $event)"
    @click="$emit('click', $event)"
  />
</template>

<script setup>
  import { ref, computed, watch } from 'vue'

  const props = defineProps({
    /** 图标名称，支持完整写法如 ri:home-line */
    name: { type: String, default: '' },
    /** 图标颜色 */
    color: { type: String, default: '#333333' },
    /** 图标尺寸，支持数字(rpx)或带单位字符串 */
    size: { type: [Number, String], default: 16 },
    /** 默认图标前缀，设置后可简化 name 写法 */
    prefix: { type: String, default: '' },
    /** Iconify API 地址 */
    apiUrl: { type: String, default: 'https://api.iconify.design' },
    /** 加载失败时的兜底图标名 */
    fallbackName: { type: String, default: '' },
    /** 是否懒加载（小程序/App 有效） */
    lazyLoad: { type: Boolean, default: true },
    /** 是否开启淡入效果 */
    fade: { type: Boolean, default: true },
    /** 是否显示加载中提示 */
    showLoading: { type: Boolean, default: true },
    /** 是否显示加载失败提示 */
    showError: { type: Boolean, default: false },
    /** 加载中图标（默认不显示加载状态，避免小图标闪烁） */
    loadingIcon: { type: String, default: 'photo' },
    /** 加载失败图标 */
    errorIcon: { type: String, default: 'error-circle' },
    /** 背景颜色 */
    bgColor: { type: String, default: 'transparent' },
    /** 圆角值 */
    borderRadius: { type: [String, Number], default: 0 },
    /** 形状 circle/square */
    shape: { type: String, default: 'square' },
  })

  defineEmits(['error', 'load', 'click'])

  const hasLoadError = ref(false)

  // 解析图标尺寸
  const iconSize = computed(() => {
    const reg = /^[0-9]*$/g
    return typeof props.size === 'number' || reg.test(String(props.size)) ? `${props.size}px` : props.size
  })

  // 监听 name 变化时重置错误状态
  watch(
    () => [props.name, props.color, props.size, props.prefix, props.apiUrl, props.fallbackName],
    () => {
      hasLoadError.value = false
    },
  )

  // 当前使用的图标名（错误时降级到 fallbackName）
  const currentName = computed(() => {
    return hasLoadError.value && props.fallbackName ? props.fallbackName : props.name
  })

  // 解析图标前缀和名称
  function parseIconName(name, defaultPrefix) {
    const value = String(name || '').trim()
    if (!value) return { prefix: defaultPrefix, icon: '' }
    if (value.includes(':')) {
      const [prefix, ...rest] = value.split(':')
      return { prefix: prefix || defaultPrefix, icon: rest.join(':') || '' }
    }
    return { prefix: defaultPrefix, icon: value }
  }

  const parsedIcon = computed(() => parseIconName(currentName.value, props.prefix))
  const parsedFallbackIcon = computed(() => parseIconName(props.fallbackName, props.prefix))

  // 生成 Iconify SVG URL（与 zero-icon 一致）
  const iconSrc = computed(() => {
    const iconName = parsedIcon.value.icon || parsedFallbackIcon.value.icon
    if (!iconName) return ''

    const iconPrefix = parsedIcon.value.prefix || parsedFallbackIcon.value.prefix
    if (!iconPrefix) return ''

    const apiUrl = String(props.apiUrl || 'https://api.iconify.design').replace(/\/$/, '')
    return `${apiUrl}/${iconPrefix}/${iconName}.svg?color=${encodeURIComponent(props.color)}&height=${encodeURIComponent(iconSize.value)}`
  })

  // 错误处理：内部降级 + 外部通知
  function onError(e) {
    if (!hasLoadError.value && currentName.value !== props.fallbackName && props.fallbackName) {
      hasLoadError.value = true
    }
    emit('error', e)
  }
</script>
