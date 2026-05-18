<template>
  <u-popup v-model="show" mode="bottom" border-radius="20" width="82%">
    <view class="rounded-2xl p-5 bg-white">
      <view class="flex items-center justify-center gap-2 mb-4">
        <view class="w-6 h-0.5 rounded-full bg-gray-200"></view>
        <view class="text-base font-semibold text-gray-900">{{ title }}</view>
        <view class="w-6 h-0.5 rounded-full bg-gray-200"></view>
      </view>
      <view class="flex flex-col gap-3">
        <view class="rounded-xl bg-gray-50 flex gap-3 p-3" v-for="(item, idx) in list" :key="idx">
          <view
            class="flex items-center justify-center flex-shrink-0 w-5 h-5 text-xs font-bold text-white rounded-full"
            :style="{ backgroundColor: activeColor }"
          >
            {{ idx + 1 }}
          </view>
          <view class="text-sm leading-relaxed text-gray-600">{{ item }}</view>
        </view>
      </view>
      <u-button type="primary" class="mt-5" shape="circle" :customStyle="{ height: '42px' }" @click="onConfirm">
        {{ confirmText }}
      </u-button>
    </view>
  </u-popup>
</template>

<script setup>
  const props = defineProps({
    modelValue: Boolean,
    title: { type: String, default: '提示' },
    list: { type: Array, default: () => [] },
    confirmText: { type: String, default: '我知道了' },
    activeColor: { type: String, default: uni.$u.color.primary },
  })

  const emit = defineEmits(['update:modelValue', 'confirm'])

  const show = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })

  function onConfirm() {
    show.value = false
    emit('confirm')
  }
</script>
