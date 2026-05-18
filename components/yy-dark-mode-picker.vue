<template>
  <u-popup :modelValue="modelValue" @update:modelValue="onInput" mode="bottom" border-radius="16">
    <view class="flex flex-col h-full">
      <view class="sticky top-0 z-10 flex items-center justify-between p-3">
        <view class="text-base font-medium text-gray-900">{{ title }}</view>
        <yy-icon name="ri:close-line" size="24" color="#999" @click="close" />
      </view>
      <scroll-view scroll-y class="flex flex-col gap-2 p-3">
        <view
          class="active:bg-gray-50 flex items-center justify-between p-3 rounded-md"
          v-for="item in options"
          :key="item.value"
          @click="selectMode(item)"
        >
          <view class="flex items-center gap-3">
            <view
              class="flex items-center justify-center rounded-lg"
              style="width: 36px; height: 36px; background-color: rgba(var(--u-type-primary-rgb), 0.1)"
            >
              <yy-icon :name="item.icon" size="20" :color="activeColor" />
            </view>
            <view class="text-sm text-gray-700">{{ item.label }}</view>
          </view>
          <yy-icon name="ri:check-line" size="20" :color="activeColor" v-if="currentMode === item.value" />
        </view>
      </scroll-view>
    </view>
  </u-popup>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useTheme } from '@/uni_modules/uview-pro'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '深色模式',
    },
    activeColor: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const { setDarkMode, getDarkMode } = useTheme()
  const currentMode = ref('')

  const options = [
    { label: '开启', value: 'dark', icon: 'ri:moon-fill' },
    { label: '自动', value: 'auto', icon: 'ri:contrast-line' },
    { label: '关闭', value: 'light', icon: 'ri:sun-line' },
  ]

  const modeLabelMap = {
    dark: '开启',
    auto: '自动',
    light: '关闭',
  }

  watch(
    () => props.modelValue,
    val => {
      if (val) {
        currentMode.value = getDarkMode()
      }
    },
  )

  function onInput(val) {
    emit('update:modelValue', val)
  }

  function close() {
    emit('update:modelValue', false)
  }

  function selectMode(item) {
    setDarkMode(item.value)
    currentMode.value = item.value
    close()
    emit('change', item)
  }

  function getModeLabel(mode) {
    return modeLabelMap[mode] || '关闭'
  }

  defineExpose({
    getModeLabel,
  })
</script>

<style lang="scss" scoped></style>
