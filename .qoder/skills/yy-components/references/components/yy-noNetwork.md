---
name: 'yy-noNetwork'
description: "无网络断网提示组件。监听网络状态变化、点击重试可调用 vk.myfn.reloadPage 重新加载页面，APP 端可跳转系统网络设置。Invoke when user needs a full-screen 'no network' page with retry."
url: 'components/yy-noNetwork.vue'
---

# yy-noNetwork 无网络提示

全屏断网占位页，展示断网图标 + 文案 + "点击重试"按钮。内部通过 `uni.onNetworkStatusChange` 监听网络状态，恢复后自动调用 `vk.myfn.reloadPage()` 与 `vk.myfn.getLocation()` 重连。

## 平台差异说明

| App | H5  | 微信小程序 | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :--------: | :----------: | :--------: |
|  √  |  √  |     √      |      √       |     √      |

> 仅在 **APP 平台** 可通过 `plus.ios/android` 跳转到系统网络设置页。当前默认行为是 "点击重试" 调用 `reconnect()`，而非跳转设置；如需跳转设置请把 `goToSettings` 内的 `reconnect()` 改为 `openSystemSettings()`。

## 基本使用

通常作为全局断网守卫组件使用，放在 `App.vue` 或页面级根节点：

```html
<template>
  <yy-no-network v-if="!networkType" />
  <router-view v-else />
</template>

<script setup>
  const networkType = computed(() => vk.getVuex('$app.networkType'))
</script>
```

## API

### Props

该组件无 Props。

### 内部依赖

| 依赖                                        | 说明                         |
| ------------------------------------------- | ---------------------------- |
| `vk.setVuex('$app.networkType', connected)` | 将连网状态写入 vuex 全局状态 |
| `vk.myfn.reloadPage()`                      | 断网恢复后的重载方法         |
| `vk.myfn.getLocation()`                     | 断网恢复后重新获取定位       |
| `/static/dddr105.png`                       | 断网图标资源                 |

## 样式与布局

- 固定铺满整个视口（`fixed inset-0`），`z-index: 999999999999` 确保在最顶层；
- 重试按钮固定颜色 `#00A9AB`，如需跟随主题请改为 `var(--u-type-primary)`。

## 注意事项

- 依赖全局变量 `vk` 与 `vk.myfn.reloadPage`，必须在 `vk-unicloud` 初始化完成后挂载；
- 组件不 emit 任何事件，重试逻辑全部内置；外部无需额外处理。
