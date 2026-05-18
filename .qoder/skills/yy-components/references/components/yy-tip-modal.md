---
name: "yy-tip-modal"
description: "编号列表式提示弹窗，常用于展示多条规则 / 提示 / 注意事项。基于 u-popup 底部弹出，编号圆点使用主题色。Invoke when user needs to show a numbered list of tips in a modal."
url: "components/yy-tip-modal.vue"
---

# yy-tip-modal 编号提示弹窗

底部弹出的 "标题 + 编号列表 + 确认按钮" 提示组件。常用于展示活动规则、使用须知、注意事项等多条文本信息。

## 平台差异说明

|App|H5|微信小程序|支付宝小程序|
|:-:|:-:|:-:|:-:|
|√|√|√|√|

## 基本使用

```vue
<template>
  <u-button @click="show = true">查看须知</u-button>
  <yy-tip-modal v-model="show" title="活动须知" :list="tipList" @confirm="onConfirm" />
</template>

<script setup>
  const show = ref(false)
  const tipList = [
    '活动时间为 2026-01-01 至 2026-03-31',
    '同一账号仅可参与一次',
    '最终解释权归主办方所有'
  ]
  const onConfirm = () => {
    console.log('用户已阅读')
  }
</script>
```

## 自定义主题色与按钮文案

```vue
<yy-tip-modal
  v-model="show"
  title="发布须知"
  :list="tipList"
  confirm-text="我已知晓"
  active-color="#ff6a00"
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|------|
| modelValue | 是否显示（v-model） | Boolean | `false` |
| title | 弹窗标题 | String | `提示` |
| list | 提示内容数组，每一项一条文本 | Array | `[]` |
| confirmText | 确认按钮文字 | String | `我知道了` |
| activeColor | 编号圆点的背景色 | String | `uni.$u.color.primary` |

### Events

| 事件名 | 说明 | 回调参数 |
|------|------|------|
| update:modelValue | 显隐变更（v-model） | (visible: boolean) |
| confirm | 点击确认按钮后触发，同时会自动关闭弹窗 | - |

## 样式特性

- 标题两侧有装饰性的短横线 `---- 标题 ----`；
- 编号圆点直径 20rpx（w-5 h-5），使用 `activeColor` 作为背景；
- 每项文本使用浅灰背景卡片包裹，间距 `gap-3`；
- 确认按钮使用 `u-button type="primary" shape="circle"`，高度 42px。

## 注意事项

- 点击确认后，组件会先 `show.value = false` 再 emit `confirm`，因此在 `confirm` 处理函数中无需再手动关闭弹窗；
- `list` 为空数组时，仅显示标题和按钮，中间区域为空；
- 弹窗宽度为 82%，居中底部弹出（实际为 `mode="bottom"` + 宽度约束）。
