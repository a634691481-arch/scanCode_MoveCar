---
name: 'yy-empty'
description: '空数据缺省页组件。跨端（H5 / 微信小程序 / APP）显示自定义 SVG 图标与提示文字，SVG 主题色通过 data:image/svg+xml + encodeURIComponent 适配微信小程序 currentColor 不继承的问题。Invoke when user needs to show an empty state with a theme-colored illustration.'
url: 'components/yy-empty.vue'
---

# yy-empty 空数据缺省页

用于列表加载第一页为空时的占位展示。内置一张 SVG 插画，主题色会跟随 uview-pro 主题主色自动变化；支持点击整块区域触发 `reload` 事件以便重新拉取数据。

## 平台差异说明

| App | H5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ小程序 |
| :-: | :-: | :--------: | :----------: | :--------: | :--------: | :------: |
|  √  |  √  |     √      |      √       |     √      |     √      |    √     |

> 微信小程序不支持 SVG 中 `currentColor`，本组件通过构造 SVG 字符串 + `data:image/svg+xml;utf8,encodeURIComponent(svg)` 的方式注入主题色后渲染到 `<image>` 标签，实现全端一致。

## 基本使用

```html
<yy-empty />
```

## 自定义文本 / 上边距 / 颜色

```html
<yy-empty text="暂无订单数据" margin="12vh" color="#ff6a00" />
```

## 点击重载

```html
<template>
  <yy-empty text="加载失败，点击重试" @reload="fetchList" />
</template>

<script setup>
  const fetchList = () => {
    // 重新请求数据
  }
</script>
```

## API

### Props

| 参数   | 说明                                                                                      | 类型   | 默认值      | 可选值     |
| ------ | ----------------------------------------------------------------------------------------- | ------ | ----------- | ---------- |
| text   | 提示文字，传空串可隐藏整块（仅渲染为空 view）                                             | String | `暂无数据~` | -          |
| margin | 插画距离顶部的距离（任意合法 CSS 长度单位）                                               | String | `8vh`       | -          |
| color  | 插画主题色，替代 SVG 中的 `currentColor`；不传时取 `uni.$u.color.primary`，兜底 `#3c9cff` | String | `''`        | 合法颜色值 |

### Events

| 事件名 | 说明                                      | 回调参数 |
| ------ | ----------------------------------------- | -------- |
| reload | 点击整块区域时触发，通常用于刷新/重拉数据 | -        |

## 注意事项

- 当 `text` 为空字符串时，组件仅渲染一个空的 `<view>`，可用于无文字场景下仅保留结构。
- 颜色优先级：`props.color` > `uni.$u.color.primary` > `#3c9cff`。
- SVG 体积较大，内联到组件中是为了避免静态资源在不同端的路径差异；若需替换插画，请同步修改 `buildSvg` 函数。
