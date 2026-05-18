---
name: "yy-theme-picker"
description: "主题色切换底部弹窗，联动 uview-pro 的 useTheme() 钩子，从预设主题列表中单选并调用 setTheme 全局切换。Invoke when user needs to let users switch the primary theme color of the app."
url: "components/yy-theme-picker.vue"
---

# yy-theme-picker 主题切换弹窗

从预设的主题列表（默认取 `@/common/function/uview-pro.theme`）中单选一项，调用 uview-pro `useTheme().setTheme(name)` 实时切换全局主题色。列表项左侧显示该主题 `primary` 颜色的色板圆点。

## 平台差异说明

|App|H5|微信小程序|支付宝小程序|
|:-:|:-:|:-:|:-:|
|√|√|√|√|

## 基本使用

```vue
<template>
  <view @click="show = true">切换主题</view>
  <yy-theme-picker v-model="show" @change="onThemeChange" />
</template>

<script setup>
  const show = ref(false)
  const onThemeChange = theme => {
    console.log('新主题：', theme.name)
  }
</script>
```

## 自定义主题列表

```vue
<yy-theme-picker
  v-model="show"
  title="更换主题"
  :themes="customThemes"
  active-color="#ff6a00"
/>
```

`themes` 数组项结构：

```ts
type ThemeItem = {
  name: string   // 主题唯一标识（setTheme 使用）
  label: string  // 列表显示文案
  color: {
    primary: string // 用于渲染色板的主色
    // ...其它 uview-pro theme 字段
  }
}
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|------|
| modelValue | 是否显示（v-model） | Boolean | `false` |
| title | 弹窗标题 | String | `选择主题` |
| themes | 可选主题数组 | Array | `defaultThemes`（来自 `@/common/function/uview-pro.theme`） |
| activeColor | 选中项文字与对勾颜色 | String | `''` |

### Events

| 事件名 | 说明 | 回调参数 |
|------|------|------|
| update:modelValue | 显隐变更（v-model） | (visible: boolean) |
| change | 选中某主题后触发（同时自动关闭弹窗） | (theme: ThemeItem) |

## 内部依赖

| 依赖 | 说明 |
|------|------|
| `useTheme()` from `@/uni_modules/uview-pro` | 提供 `setTheme(name)` / `getCurrentTheme()` |
| `@/common/function/uview-pro.theme` | 项目默认主题列表 |
| `yy-icon` | 关闭 / 对勾图标 |

## 行为

1. 弹窗打开时，会调用 `getCurrentTheme()` 同步当前选中态到 `currentThemeName`；
2. 点击主题项 → `setTheme(item.name)` → 关闭弹窗 → emit `change(item)`；
3. 整体高度约束 60vh，超出滚动。

## 注意事项

- `setTheme` 会持久化主题并更新 CSS 变量，立即影响所有 uview-pro 组件；
- 项目内主题必须先在 `@/common/function/uview-pro.theme` 中注册后才能出现在默认列表；
- 与 [yy-dark-mode-picker](./yy-dark-mode-picker.md) 是独立的两个维度：主题色 ≠ 深色模式。
