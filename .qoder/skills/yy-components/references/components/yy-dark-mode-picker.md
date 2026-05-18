---
name: 'yy-dark-mode-picker'
description: '深色模式切换底部弹窗，联动 uview-pro 的 useTheme()，在 开启 / 自动（跟随系统）/ 关闭 三个值之间切换。Invoke when user needs to let users toggle dark mode (dark / auto / light).'
url: 'components/yy-dark-mode-picker.vue'
---

# yy-dark-mode-picker 深色模式切换弹窗

从 `开启 / 自动 / 关闭` 三项中单选，调用 uview-pro `useTheme().setDarkMode(value)` 切换当前深色模式策略，并持久化存储。每个选项左侧有一个主题色背景的图标框。

## 平台差异说明

| App | H5  | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

> `auto` 模式依赖 uview-pro 内部对系统主题（`uni.onThemeChange`）的监听，部分端可能无法自动响应系统切换，需 uview-pro 版本支持。

## 基本使用

```vue
<template>
  <view @click="show = true">深色模式</view>
  <yy-dark-mode-picker v-model="show" @change="onChange" />
</template>

<script setup>
  const show = ref(false)
  const onChange = mode => {
    console.log('新模式：', mode.value) // 'dark' | 'auto' | 'light'
  }
</script>
```

## 读取当前模式显示标签

```vue
<script setup>
  import { useTheme } from '@/uni_modules/uview-pro'
  const pickerRef = ref(null)
  const { getDarkMode } = useTheme()
  const currentLabel = computed(() => pickerRef.value?.getModeLabel(getDarkMode()) ?? '关闭')
</script>

<template>
  <yy-dark-mode-picker ref="pickerRef" v-model="show" />
  <text>当前：{{ currentLabel }}</text>
</template>
```

## API

### Props

| 参数        | 说明                | 类型    | 默认值     |
| ----------- | ------------------- | ------- | ---------- |
| modelValue  | 是否显示（v-model） | Boolean | `false`    |
| title       | 弹窗标题            | String  | `深色模式` |
| activeColor | 选中项 / 图标颜色   | String  | `''`       |

### Events

| 事件名            | 说明                                 | 回调参数                 |
| ----------------- | ------------------------------------ | ------------------------ |
| update:modelValue | 显隐变更（v-model）                  | (visible: boolean)       |
| change            | 选中某模式后触发（同时自动关闭弹窗） | `{ label, value, icon }` |

### 暴露方法

| 方法                 | 说明                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------- |
| `getModeLabel(mode)` | 将 `'dark' / 'auto' / 'light'` 映射为中文标签 `开启 / 自动 / 关闭`，找不到时默认 `关闭` |

## 可选值映射

| value   | label | icon               |
| ------- | ----- | ------------------ |
| `dark`  | 开启  | `ri:moon-fill`     |
| `auto`  | 自动  | `ri:contrast-line` |
| `light` | 关闭  | `ri:sun-line`      |

## 内部依赖

| 依赖                                        | 说明                                        |
| ------------------------------------------- | ------------------------------------------- |
| `useTheme()` from `@/uni_modules/uview-pro` | 提供 `setDarkMode(value)` / `getDarkMode()` |
| `yy-icon`                                   | 关闭按钮和各模式图标                        |

## 行为

1. 弹窗打开时通过 `getDarkMode()` 同步当前模式到高亮项；
2. 点击某选项 → `setDarkMode(value)` → 关闭弹窗 → emit `change(item)`；
3. 图标容器使用半透明主题色背景：`rgba(var(--u-type-primary-rgb), 0.1)`。

## 注意事项

- 该组件与 [yy-theme-picker](./yy-theme-picker.md) 是正交维度：主题色（品牌色）与深色模式（亮/暗）互不干扰；
- `setDarkMode` 会持久化并切换所有使用 `var(--u-type-*)` / uview-pro 主题变量的 UI；
- 若需要页面自定义样式也跟随深色模式，请使用 uview-pro 的主题变量或 CSS `prefers-color-scheme` 媒体查询。
