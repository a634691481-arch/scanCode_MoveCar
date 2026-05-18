<template>
  <u-popup v-model="show" mode="bottom" border-radius="20" :safe-area-inset-bottom="true">
    <view class="flex flex-col" style="max-height: 60vh">
      <view
        class="sticky top-0 z-10 flex items-center justify-between flex-shrink-0 p-3 bg-white border-b border-gray-100"
      >
        <view class="text-base font-semibold text-gray-900">{{ title }}</view>
        <view class="active:bg-gray-100 flex items-center justify-center w-8 h-8 rounded-full" @click="show = false">
          <yy-icon name="ri:close-line" size="20" color="#9ca3af" />
        </view>
      </view>
      <scroll-view scroll-y class="flex-1 w-full">
        <view class="flex flex-col gap-2 p-3">
          <view
            class="flex items-center justify-between p-3.5 rounded-xl transition-all active:scale-[0.98]"
            :class="currentValue === item ? 'bg-primary-light' : 'bg-gray-50 active:bg-gray-100'"
            :style="currentValue === item ? { backgroundColor: `rgba(var(--u-type-primary-rgb), 0.08)` } : {}"
            v-for="item in list"
            :key="item"
            @click="onSelect(item)"
          >
            <view
              class="text-sm"
              :class="currentValue === item ? 'font-semibold' : 'text-gray-700'"
              :style="currentValue === item ? { color: activeColor } : {}"
            >
              {{ item }}
            </view>
            <yy-icon v-if="currentValue === item" name="ri:check-line" size="20" :color="activeColor" />
          </view>
        </view>
      </scroll-view>
    </view>
  </u-popup>
</template>

<script setup>
  const props = defineProps({
    modelValue: Boolean,
    title: { type: String, default: '请选择' },
    list: { type: Array, default: () => [] },
    value: { type: [String, Number], default: '' },
    activeColor: { type: String, default: uni.$u.color.primary },
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const show = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })

  const currentValue = computed(() => props.value)

  function onSelect(item) {
    emit('change', item)
    show.value = false
  }
</script>
