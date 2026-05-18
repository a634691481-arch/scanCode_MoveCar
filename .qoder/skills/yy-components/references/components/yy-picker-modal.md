---
name: "yy-picker-modal"
description: "底部选项列表选择器。从数组中单选一项，支持主题色高亮 + 勾选图标，基于 u-popup + scroll-view 实现最多 60vh 高度滚动。Invoke when user needs a bottom-sheet single-select list picker."
url: "components/yy-picker-modal.vue"
---

# yy-picker-modal 选项选择弹窗

从简单的字符串/数字数组中单选一项的底部弹出选择器。含固定标题栏 + 关闭按钮 + 滚动选项列表，选中项以主题色背景 + 对勾图标高亮显示。

## 平台差异说明

|App|H5|微信小程序|支付宝小程序|
|:-:|:-:|:-:|:-:|
|√|√|√|√|

## 基本使用

```vue
<template>
  <view @click="show = true">选择地区：{{ currentArea }}</view>
  <yy-picker-modal
    v-model="show"
    title="选择地区"
    :list="areaList"
    :value="currentArea"
    @change="val => (currentArea = val)"
  />
</template>

<script setup>
  const show = ref(false)
  const currentArea = ref('北京')
  const areaList = ['北京', '上海', '广州', '深圳', '杭州', '成都']
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|------|
| modelValue | 是否显示（v-model） | Boolean | `false` |
| title | 标题栏文字 | String | `请选择` |
| list | 可选项数组（字符串或数字） | Array | `[]` |
| value | 当前选中的值（受控） | String / Number | `''` |
| activeColor | 选中项文字与对勾颜色 | String | `uni.$u.color.primary` |

### Events

| 事件名 | 说明 | 回调参数 |
|------|------|------|
| update:modelValue | 显隐变更（v-model） | (visible: boolean) |
| change | 选中某项后触发（同时自动关闭弹窗） | (selected) |

## 行为约定

- 点击任一项 → emit `change(item)` → 自动关闭弹窗（`show.value = false`）；
- 点击标题栏右上角 `×` → `show.value = false`（不触发 change）；
- 选中项背景使用半透明主题色：`rgba(var(--u-type-primary-rgb), 0.08)`；
- 整体最大高度 `60vh`，超出范围自动滚动。

## 注意事项

- `value` 是受控 prop，组件本身不维护选中态；使用方需在 `@change` 回调中更新外部状态；
- `list` 目前仅支持扁平的字符串/数字数组，如需 `label/value` 对象结构请基于此组件二次封装；
- 依赖 `yy-icon` 渲染关闭与对勾图标（`ri:close-line` / `ri:check-line`）。
