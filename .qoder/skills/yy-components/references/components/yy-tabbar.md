---
name: 'yy-tabbar'
description: '全局底部 Tabbar 组件，基于 u-tabbar + vuex ($tabbar) 统一管理 tab 数据和当前激活项。Invoke when user needs to render a unified bottom tab bar driven by vuex state.'
url: 'components/yy-tabbar.vue'
---

# yy-tabbar 全局底部导航

项目级底部导航组件，封装 `u-tabbar`，通过 vuex 模块 `$tabbar`（`vk.vuex`）统一获取 tab 列表与当前激活项，点击后触发 `$tabbar/switchTab` action 完成切换。

## 平台差异说明

| App | H5  | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基本使用

直接放置在页面底部，或由 `yy-paging` 的 `showTabbar` 属性自动挂载：

```html
<!-- 页面级 -->
<yy-tabbar />

<!-- 或通过 yy-paging -->
<yy-paging v-model="list" :show-tabbar="true" hide-nav @query="queryList" />
```

## API

### Props

无 Props，所有数据均来自 vuex。

### Events

无自定义事件。组件内部 `onChange` 直接 dispatch `$tabbar/switchTab`。

## Vuex 依赖

| 状态/Action           | 说明                                                                            |
| --------------------- | ------------------------------------------------------------------------------- |
| `$tabbar.list`        | tab 列表数据，需符合 u-tabbar 的 `list` 字段结构（含 icon、title、pagePath 等） |
| `$tabbar.activeIndex` | 当前激活的下标                                                                  |
| `$tabbar/switchTab`   | 切换 tab 的 vuex action（内部处理 `uni.switchTab` / 路由跳转）                  |

## 样式约定

- `active-color` 自动取 `$u.color.primary`（uview-pro 主题色）；
- `inactive-color` 固定 `#E0E0E0`；
- `border-top: false`、`hideTabBar: true`（隐藏原生 tabBar，由 JS 模拟）。

## 注意事项

- 组件写法仍为 **Options API**（`export default`），因为需要使用 `vk = uni.vk` 闭包变量；使用时与 `<script setup>` 无冲突；
- 使用前需先在 `store/modules/$tabbar.js` 中初始化好 tab 列表；
- 若与 `yy-paging` 同时使用，建议通过 `yy-paging` 的 `showTabbar` 统一管理，避免重复渲染。
