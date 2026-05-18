<template>
  <u-popup
    v-model="modelVisible"
    mode="bottom"
    :border-radius="24"
    :closeable="false"
    :mask="true"
    :mask-close-able="true"
    @close="onClose"
    @open="onOpen"
  >
    <view class="plate-keyboard">
      <!-- 头部 -->
      <view class="keyboard-header">
        <text class="keyboard-title">输入车牌号</text>
        <text class="keyboard-done" @click="onClose">完成</text>
      </view>

      <!-- 车牌显示 -->
      <view class="plate-display-popup">
        <template v-for="(char, idx) in displayChars" :key="idx">
          <view v-if="idx === 2" class="plate-separator-dot"></view>
          <view
            class="plate-cell"
            :class="{
              'plate-cell-filled': char,
              'plate-cell-active': idx === currentIndex,
              'plate-cell-province': idx === 0,
            }"
          >
            <text class="plate-cell-text">{{ char || '' }}</text>
            <view v-if="!char && idx === currentIndex" class="plate-cursor"></view>
          </view>
        </template>
      </view>

      <!-- 键盘内容 -->
      <view class="keyboard-content">
        <!-- 省份选择 -->
        <view v-if="currentIndex === 0" class="keyboard-row province-row">
          <view v-for="p in provinces" :key="p" class="key-btn" @click="onInput(p)">
            <text class="key-text">{{ p }}</text>
          </view>
        </view>

        <!-- 字母数字键盘 -->
        <template v-else>
          <view class="keyboard-row">
            <view v-for="k in keyboardRow1" :key="k" class="key-btn" @click="onInput(k)">
              <text class="key-text">{{ k }}</text>
            </view>
          </view>
          <view class="keyboard-row">
            <view v-for="k in keyboardRow2" :key="k" class="key-btn" @click="onInput(k)">
              <text class="key-text">{{ k }}</text>
            </view>
          </view>
          <view class="keyboard-row">
            <view
              v-for="k in keyboardRow3"
              :key="k"
              class="key-btn"
              :class="{ 'key-btn-disabled': k === 'I' || k === 'O' }"
              @click="onInput(k)"
            >
              <text class="key-text">{{ k }}</text>
            </view>
            <view class="key-btn key-btn-delete" @click="onDelete">
              <yy-icon name="ri:delete-back-2-line" size="18" color="#374151" />
            </view>
          </view>
          <view class="keyboard-row">
            <view v-for="k in keyboardNums" :key="k" class="key-btn" @click="onInput(k)">
              <text class="key-text">{{ k }}</text>
            </view>
          </view>
        </template>
      </view>
    </view>
  </u-popup>
</template>

<script setup>
  const props = defineProps({
    visible: { type: Boolean, default: false },
    modelValue: { type: String, default: '' },
  })

  const emit = defineEmits(['update:visible', 'update:modelValue', 'change', 'close', 'open'])

  const modelVisible = computed({
    get: () => props.visible,
    set: val => emit('update:visible', val),
  })

  const provinces = [
    '京',
    '津',
    '沪',
    '渝',
    '冀',
    '豫',
    '云',
    '辽',
    '黑',
    '湘',
    '皖',
    '鲁',
    '新',
    '苏',
    '浙',
    '赣',
    '鄂',
    '桂',
    '甘',
    '晋',
    '蒙',
    '陕',
    '吉',
    '闽',
    '贵',
    '粤',
    '川',
    '青',
    '琼',
    '宁',
    '藏',
  ]
  const keyboardRow1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'P']
  const keyboardRow2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
  const keyboardRow3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  const keyboardNums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

  const currentIndex = computed(() => Math.min(props.modelValue.length, 7))

  const displayChars = computed(() => {
    const chars = props.modelValue.split('')
    while (chars.length < 8) chars.push('')
    return chars
  })

  function onInput(char) {
    if (props.modelValue.length >= 8) return
    if (currentIndex.value > 0 && (char === 'I' || char === 'O')) return
    const newValue = props.modelValue + char
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }

  function onDelete() {
    if (props.modelValue.length > 0) {
      const newValue = props.modelValue.slice(0, -1)
      emit('update:modelValue', newValue)
      emit('change', newValue)
    }
  }

  function onClose() {
    emit('update:visible', false)
    emit('close')
  }

  function onOpen() {
    emit('open')
  }
</script>

<style lang="scss" scoped>
  .plate-keyboard {
    padding: 16px 12px calc(20px + env(safe-area-inset-bottom));
  }

  .keyboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 12px;
    border-bottom: 1px solid #f3f4f6;
  }

  .keyboard-title {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
  }

  .keyboard-done {
    font-size: 14px;
    color: #2563eb;
    font-weight: 500;
    padding: 6px 12px;
  }

  .plate-display-popup {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 16px 0;
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

    &.plate-cell-active {
      border-color: #2563eb;
      background: #eff6ff;
    }

    &.plate-cell-filled {
      border-color: #2563eb;
    }

    &.plate-cell-province {
      background: #2563eb;
      border-color: #2563eb;

      .plate-cell-text {
        color: #ffffff;
        font-weight: 700;
      }
    }
  }

  .plate-separator-dot {
    width: 7px;
    height: 7px;
    background: #2563eb;
    border-radius: 50%;
    flex-shrink: 0;
    margin: 0 2px;
  }

  .plate-cell-text {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
  }

  .plate-cursor {
    position: absolute;
    width: 2px;
    height: 22px;
    background: #2563eb;
    border-radius: 1px;
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }

  .keyboard-content {
    padding: 8px 0 4px;
  }

  .keyboard-row {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .province-row {
    gap: 4px;
  }

  .key-btn {
    min-width: 32px;
    height: 40px;
    background: #f1f5f9;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    max-width: 42px;

    &:active {
      background: #e2e8f0;
      transform: scale(0.95);
    }

    &.key-btn-delete {
      background: #fee2e2;
      max-width: 50px;
      min-width: 50px;
    }

    &.key-btn-disabled {
      opacity: 0.3;
    }
  }

  .key-text {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
  }
</style>
