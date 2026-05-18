<template>
  <u-popup
    :modelValue="modelValue"
    @update:modelValue="onInput"
    mode="bottom"
    border-radius="20"
    :safe-area-inset-bottom="true"
  >
    <view class="flex flex-col" style="max-height: 60vh">
      <view
        class="sticky top-0 z-10 flex items-center justify-between flex-shrink-0 p-3 bg-white border-b border-gray-100"
      >
        <view class="text-base font-semibold text-gray-900">{{ title }}</view>
        <view class="active:bg-gray-100 flex items-center justify-center w-8 h-8 rounded-full" @click="close">
          <yy-icon name="ri:close-line" size="20" color="#9ca3af" />
        </view>
      </view>
      <scroll-view scroll-y class="flex-1 w-full">
        <view class="flex flex-col gap-2 p-3">
          <view
            class="flex items-center justify-between p-3.5 rounded-xl transition-all active:scale-[0.98]"
            :class="currentThemeName === item.name ? 'bg-primary-light' : 'bg-gray-50 active:bg-gray-100'"
            :style="currentThemeName === item.name ? { backgroundColor: `rgba(var(--u-type-primary-rgb), 0.08)` } : {}"
            v-for="item in themes"
            :key="item.name"
            @click="selectTheme(item)"
          >
            <view class="flex items-center gap-3">
              <view
                class="w-6 h-6 border border-gray-200 rounded-full"
                :style="{ backgroundColor: item.color.primary }"
              ></view>
              <view
                class="text-sm"
                :class="currentThemeName === item.name ? 'font-semibold' : 'text-gray-700'"
                :style="currentThemeName === item.name ? { color: activeColor } : {}"
              >
                {{ item.label }}
              </view>
            </view>
            <yy-icon name="ri:check-line" size="20" :color="activeColor" v-if="currentThemeName === item.name" />
          </view>
        </view>
      </scroll-view>
    </view>
  </u-popup>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import defaultThemes from '@/common/function/uview-pro.theme'
  import { useTheme } from '@/uni_modules/uview-pro'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '选择主题',
    },
    themes: {
      type: Array,
      default: () => defaultThemes,
    },
    activeColor: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const { setTheme, getCurrentTheme } = useTheme()
  const currentThemeName = ref('')

  // 同步当前主题名称
  watch(
    () => props.modelValue,
    val => {
      if (val) {
        const theme = getCurrentTheme()
        if (theme) currentThemeName.value = theme.name
      }
    },
  )

  function onInput(val) {
    emit('update:modelValue', val)
  }

  function close() {
    emit('update:modelValue', false)
  }

  function selectTheme(item) {
    setTheme(item.name)
    currentThemeName.value = item.name
    close()
    emit('change', item)
  }
</script>

<style lang="scss" scoped></style>
