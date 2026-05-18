---
name: 'yy-icon'
description: "基于 Iconify API 的跨端 SVG 图标组件。通过 https://api.iconify.design 动态加载任意图标集（如 ri:, mdi:, tabler: 等），以 u-image 承载，支持懒加载、淡入、错误兜底。Invoke when user needs a vector icon not included in uview-pro's built-in icon set."
url: 'components/yy-icon.vue'
---

# yy-icon Iconify 跨端图标

使用 Iconify 在线 SVG API (`https://api.iconify.design/{prefix}/{name}.svg`) 动态渲染图标，本质是一张带颜色和尺寸参数的 SVG 图片，通过 `u-image` 渲染。支持 100+ 图标集（Remix Icon / Material Design Icons / Tabler 等）。

## 平台差异说明

| App | H5  | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

> 所有端均通过网络请求远程 SVG URL（iconify api），离线环境下需要自己替换 `apiUrl` 为私有镜像。

## 基本使用

```html
<!-- 完整 name：prefix:name -->
<yy-icon name="ri:home-line" size="24" color="#333" />

<!-- 指定默认 prefix -->
<yy-icon prefix="ri" name="user-line" size="20" color="#00A9AB" />

<!-- 错误兜底 -->
<yy-icon name="ri:unknown-icon" fallback-name="ri:question-line" size="24" />
```

## 名称解析规则

| 写法                               | 实际请求           |
| ---------------------------------- | ------------------ |
| `ri:home-line`                     | `ri/home-line.svg` |
| `prefix="ri"` + `name="home-line"` | `ri/home-line.svg` |
| `name="home-line"` 无默认 prefix   | 返回空串，不渲染   |

## API

### Props

| 参数         | 说明                                                  | 类型            | 默认值                       |
| ------------ | ----------------------------------------------------- | --------------- | ---------------------------- |
| name         | 图标名称，支持 `prefix:name` 完整写法                 | String          | `''`                         |
| color        | 图标颜色（通过 URL 参数 `?color=` 传给 iconify）      | String          | `#333333`                    |
| size         | 图标尺寸，数字/纯数字字符串按 `px` 处理，否则原值输出 | Number / String | `16`                         |
| prefix       | 默认图标集前缀（当 name 不包含 `:` 时使用）           | String          | `''`                         |
| apiUrl       | Iconify API 基地址（用于私有镜像）                    | String          | `https://api.iconify.design` |
| fallbackName | 加载失败时的兜底图标名（可带 prefix）                 | String          | `''`                         |
| lazyLoad     | 是否懒加载（小程序/App 有效）                         | Boolean         | `true`                       |
| fade         | 是否开启淡入动画                                      | Boolean         | `true`                       |
| showLoading  | 是否显示加载占位                                      | Boolean         | `true`                       |
| showError    | 是否显示加载失败占位                                  | Boolean         | `false`                      |
| loadingIcon  | 加载占位图标                                          | String          | `photo`                      |
| errorIcon    | 加载失败占位图标                                      | String          | `error-circle`               |
| bgColor      | 背景颜色                                              | String          | `transparent`                |
| borderRadius | 圆角（数字或带单位字符串）                            | String / Number | `0`                          |
| shape        | 形状：`square` / `circle`                             | String          | `square`                     |

### Events

| 事件名 | 说明                                      | 回调参数 |
| ------ | ----------------------------------------- | -------- |
| load   | 图标加载成功                              | 事件对象 |
| error  | 加载失败（会先尝试切换到 `fallbackName`） | 事件对象 |
| click  | 点击                                      | 事件对象 |

## 错误降级流程

1. 首次请求 `name` 对应的 SVG 失败 → 触发 `onError`；
2. 若设置了 `fallbackName` 且当前未降级，则 `hasLoadError = true`，切换到 `fallbackName` 再请求一次；
3. 最终仍失败时，视 `showError` 决定是否展示 `errorIcon`。

## URL 构造规则

```
{apiUrl}/{prefix}/{name}.svg?color=encodeURIComponent(color)&height=encodeURIComponent(size)
```

示例：

```
https://api.iconify.design/ri/home-line.svg?color=%23333333&height=24px
```

## 注意事项

- 默认 API 走外网，若项目需要部署到纯内网/离线场景，需要搭建 Iconify 私有镜像并通过 `apiUrl` 覆盖；
- 纯数字或字符串数字会自动拼接 `px`，如需用 `rpx`，请直接传带单位字符串 `"40rpx"`；
- 颜色通过 query 参数传给 iconify，只对单色图标生效（多色图标不受 `color` 控制）。
