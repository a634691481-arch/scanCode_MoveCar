---
name: vk-jsapi
description: >
  强制使用 vk 框架封装的 JSAPI 替代 uni-app 原生 API。
  适用于所有 uni-app + Vue3 项目中的弹窗提示、页面跳转、加载状态等交互操作。
  当用户要求写提示、弹窗、跳转、加载等交互代码时，必须优先使用 vk.alert / vk.toast / vk.navigateTo 等封装 API，而非 uni.showToast / uni.showModal / uni.navigateTo 等原生 API。
---

# vk JSAPI 封装规范

## 核心原则

**禁止使用** `uni.showToast`、`uni.showModal`、`uni.navigateTo`、`uni.redirectTo`、`uni.reLaunch`、`uni.switchTab`、`uni.navigateBack`、`uni.showLoading`、`uni.hideLoading`、`uni.showActionSheet`、`uni.getStorageSync`、`uni.setStorageSync` 等原生 API。

**必须使用** `vk` 框架已封装的对应 API。

## API 对照表

| 功能 | 禁止使用的原生 API | 必须使用的 vk 封装 |
|---|---|---|
| 提示弹窗（仅确定） | `uni.showModal({ showCancel: false })` | `vk.alert(content, title, confirmText, callback)` |
| 确认弹窗（确定+取消） | `uni.showModal` | `vk.confirm(content, title, confirmText, cancelText, callback)` |
| 输入弹窗 | `uni.showModal` + editable | `vk.prompt(content, title, confirmText, cancelText, callback)` |
| 轻提示 | `uni.showToast` | `vk.toast(title, icon, duration/mask/callback)` |
| 操作菜单 | `uni.showActionSheet` | `vk.showActionSheet(itemList, callback)` |
| 显示加载 | `uni.showLoading` | `vk.showLoading(title, mask)` |
| 隐藏加载 | `uni.hideLoading` | `vk.hideLoading()` |
| 页面跳转 | `uni.navigateTo` | `vk.navigateTo(url)` 或 `vk.navigateTo({ url, events, success, fail })` |
| 关闭当前页跳转 | `uni.redirectTo` | `vk.redirectTo(url)` |
| 关闭所有页面跳转 | `uni.reLaunch` | `vk.reLaunch(url)` |
| 切换 Tab | `uni.switchTab` | `vk.switchTab(url)` |
| 返回上一页 | `uni.navigateBack` | `vk.navigateBack(delta)` |
| 返回首页 | `uni.reLaunch({ url: '/pages/index/index' })` | `vk.navigateToHome()` |
| 跳转登录 | `uni.navigateTo({ url: '/pages/login/index' })` | `vk.navigateToLogin()` |
| 读取本地存储 | `uni.getStorageSync(key)` | `vk.getStorageSync(key)` |
| 写入本地存储 | `uni.setStorageSync(key, value)` | `vk.setStorageSync(key, value)` |

## 常用 API 详细用法

### vk.alert

```js
// 简写
vk.alert('操作成功')

// 完整
vk.alert('内容', '标题', '确定', () => {
  // 点击确定后回调
})

// 多行内容
vk.alert('第一行\n第二行\n第三行')
```

### vk.toast

```js
// 纯文字（icon 默认为 none）
vk.toast('提示内容')

// 成功图标
vk.toast('保存成功', 'success')

// 自定义时长
vk.toast('提示内容', 'none', 2000)

// 带回调
vk.toast('提示内容', 'none', () => {
  // toast 结束后执行
})

// 完整参数
vk.toast(title, icon, duration, mask, callback)
```

### vk.navigateTo

```js
// 简写（字符串 url）
vk.navigateTo('/pages/my/index')

// 对象形式（支持事件通信）
vk.navigateTo({
  url: '/pages/my/index?id=123',
  events: {
    update: (data) => { console.log(data) }
  },
  success: (res) => {
    res.eventChannel.emit('data', { foo: 'bar' })
  }
})
```

### vk.showActionSheet

```js
vk.showActionSheet(['选项一', '选项二', '选项三'], (res) => {
  console.log('选中了第' + (res.tapIndex + 1) + '个')
})
```

### vk.showLoading / vk.hideLoading

```js
vk.showLoading('加载中...')
// ...异步操作
vk.hideLoading()
```

## 页面跳转特殊说明

`vk.navigateTo` 相比 `uni.navigateTo` 的优势：
- 自动判断目标页面是否需要登录
- 自动处理 tabBar 页面（无需手动区分 `switchTab`）
- 支持 `checkTokenPages` 配置拦截

## 边界情况处理

以下场景**允许**保留原生 API：

1. `uni.makePhoneCall` — vk 无电话拨打封装
2. `uni.setClipboardData` — vk 无剪贴板封装
3. `uni.scanCode` — vk 无扫码封装
4. `uni.getSystemInfoSync` — 系统信息
5. `uni.canvasToTempFilePath` / `uni.saveImageToPhotosAlbum` — 图片操作

## 代码审查检查项

当编写或审查交互相关代码时，检查：
- [ ] 所有 toast 使用 `vk.toast`
- [ ] 所有 alert/confirm 使用 `vk.alert` / `vk.confirm`
- [ ] 所有页面跳转使用 `vk.navigateTo` / `vk.redirectTo` / `vk.reLaunch` / `vk.switchTab` / `vk.navigateBack`
- [ ] 所有 loading 使用 `vk.showLoading` / `vk.hideLoading`
- [ ] 所有 actionSheet 使用 `vk.showActionSheet`
- [ ] 无遗漏的 `uni.showToast`、`uni.showModal`、`uni.navigateTo`、`uni.getStorageSync`、`uni.setStorageSync` 等原生调用
