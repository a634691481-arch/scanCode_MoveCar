---
name: 'yy-loading'
description: '全屏加载动画组件。纯 CSS 锥形渐变 + 遮罩实现的半透明全屏 loading，主色自动跟随 uview-pro 主题色 var(--u-type-primary)。Invoke when user needs a full-screen loading overlay during page/data loading.'
url: 'components/yy-loading.vue'
---

# yy-loading 全屏加载

使用纯 CSS（`conic-gradient` + `mask`）实现的环形加载指示器，叠加 `fixed inset-0` 的半透明白色遮罩，默认铺满整个视口。常用于首屏加载、接口 loading、`yy-paging` 的 `#loading` 插槽。

## 平台差异说明

| App | H5  | 微信小程序 | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :--------: | :----------: | :--------: |
|  √  |  √  |     √      |      √       |     √      |

> 由于使用 `conic-gradient` + `mask-composite`，部分极老版本的浏览器可能降级显示为空白环，但在主流 uni-app 目标平台均可正常渲染。

## 基本使用

```html
<yy-loading v-if="loading" />
```

## 作为 z-paging 的 loading 插槽

在 `yy-paging` 内部已默认通过 `#loading` 插槽装配：

```html
<template #loading>
  <yy-loading />
</template>
```

## API

### Props

该组件无 Props，所有显示逻辑由外层控制（`v-if` / `v-show`）。

### Slots

无插槽。

## 样式变量

| 变量               | 说明                            | 默认来源        |
| ------------------ | ------------------------------- | --------------- |
| `--u-type-primary` | 加载环主色，取自 uview-pro 主题 | uview-pro theme |

## 注意事项

- 组件默认文字："努力加载中..."，如需修改请直接改组件源码或基于此封装新版本。
- 覆盖层默认 `bg-white/90`，会遮住下层内容但可透出背景；如需完全遮罩可调整为 `bg-white`。
- 依赖 TailwindCSS 原子类（`size-full animate-fadeIn fixed inset-0` 等），请确保项目已集成 TailwindCSS。
