---
name: "yy-edit-information"
description: "修改昵称 / 头像 / 性别的底部弹窗，基于 u-popup。头像使用微信小程序 button[open-type=chooseAvatar]，昵称支持 type=nickname 输入。Invoke when user needs a bottom-sheet to edit avatar, nickname and gender in tasi_h5 project."
url: "components/yy-edit-information.vue"
---

# yy-edit-information 编辑个人信息弹窗

底部弹出（`u-popup mode="bottom"`）的用户信息修改面板，包含：

- 头像（微信小程序 `chooseAvatar` 能力）
- 昵称输入框（`type=nickname` 支持微信键盘快捷填写）
- 性别单选（男 / 女，映射为 `1 / 0` 提交）
- 确认按钮（调用 `api.updateUserInfo` 接口）

## 平台差异说明

|微信小程序|H5|APP|
|:-:|:-:|:-:|
|√（头像可用 chooseAvatar）|△（头像按钮需普通文件选择）|△|

> `<button open-type="chooseAvatar">` 仅微信小程序可用；其他端需替换为 `uni.chooseImage` 流程。

## 基本使用

```vue
<template>
  <view class="flex items-center">
    <view @click="show = true">编辑资料</view>
  </view>

  <yy-edit-information v-model="show" :user-info="userInfo" @success="onUpdateSuccess" />
</template>

<script setup>
  const show = ref(false)
  const userInfo = ref({ nickname: '', avatar: '', gender: 1 })

  const onUpdateSuccess = () => {
    vk.toast('修改成功')
    // 重新拉取用户信息
  }
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|------|
| modelValue | 是否显示（v-model） | Boolean | `false` |
| userInfo | 初始用户信息对象，含 `nickname` / `avatar` / `gender(1\|0)` | Object | `{}` |

### Events

| 事件名 | 说明 | 回调参数 |
|------|------|------|
| update:modelValue | 显隐状态变更 | (visible: boolean) |
| success | `api.updateUserInfo` 接口成功后触发 | - |

## 内部依赖

| 依赖 | 说明 |
|------|------|
| `api.updateUserInfo({ nickname, avatar, gender })` | 后端接口，`gender` 以 1/0 提交 |
| `import.meta.env.VITE_UPLOAD_BASE_URL` | 头像上传地址 |
| `import.meta.env.VITE_API_BASE_URL` | 相对头像路径拼接基地址 |
| `uni.vk.getStorageSync('uni_id_token')` | 上传请求头 token |
| `vk.toast` / `vk.showLoading` / `vk.hideLoading` | 过程反馈 |
| `uni.$u.color.primary` | 头像边框高亮色 |

## 字段映射

| UI 单选值 | 提交值 |
|------|------|
| `男` | `1` |
| `女` | `0` |

## 注意事项

- 头像上传成功后 `state.userInfo.avatar` 更新为返回的 URL，但此时还未调接口，需用户点击"确认修改"后一并提交；
- 表单内未对昵称做长度 / 空校验，如需强校验请在 `confirmSubmission` 中自行添加；
- 组件使用 `<button>` 触发微信头像选择，样式在 `<style>` 中将 `button` 重置为透明无边框。
