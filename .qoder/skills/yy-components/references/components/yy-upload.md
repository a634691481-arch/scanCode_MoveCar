---
name: 'yy-upload'
description: '图片/视频上传组件，支持多图九宫格展示、压缩、大小校验、删除、图片预览。基于 uni.chooseImage / chooseVideo + uni.uploadFile，返回服务器 URL 列表。Invoke when user needs to upload images or a video with preview and delete support.'
url: 'components/yy-upload.vue'
---

# yy-upload 图片/视频上传

按九宫格（`grid-cols-{column}`）展示已上传的图片/视频缩略图，点击缩略图预览，点击右上角关闭图标删除，最后一格为 `+` 形状的上传入口。上传走 `uni.uploadFile`，上传地址读取环境变量 `VITE_UPLOAD_BASE_URL`，请求头携带 `uni_id_token`。

## 平台差异说明

| App | H5  | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

> 视频上传使用 `uni.chooseVideo`，非所有端都支持同样的 `sourceType` 配置；图片上传使用 `uni.chooseImage`。预览视频优先使用 `uni.previewMedia`，不支持时降级 `previewImage`。

## 基本使用

### 图片（默认）

```vue
<template>
  <yy-upload v-model="images" :max-count="9" :max-size="3" tips="最多9张，单张不超过3M" />
</template>

<script setup>
  const images = ref([]) // 直接得到 URL 数组
</script>
```

### 视频

```vue
<yy-upload v-model="videos" media-type="video" :max-count="1" tips="支持上传1个视频" />
```

### 禁用 / 只读

```vue
<yy-upload v-model="images" :disabled="true" />
```

### 自定义列数、按钮文字

```vue
<yy-upload v-model="images" :column="4" upload-text="添加照片" />
```

## API

### Props

| 参数       | 说明                                                                      | 类型    | 默认值                  |
| ---------- | ------------------------------------------------------------------------- | ------- | ----------------------- |
| modelValue | v-model 绑定，已上传的 URL 数组（上传中为 `{ url, loading: true }` 对象） | Array   | `[]`                    |
| maxCount   | 最大上传数量                                                              | Number  | `9`                     |
| maxSize    | 单个文件最大体积（单位 MB）                                               | Number  | `3`                     |
| disabled   | 是否禁用（禁用后不显示上传按钮 & 删除按钮）                               | Boolean | `false`                 |
| sizeType   | 图片压缩类型（传入 `uni.chooseImage`）                                    | Array   | `['compressed']`        |
| sourceType | 图片/视频来源                                                             | Array   | `['album', 'camera']`   |
| column     | 每行显示的数量（对应 `grid-cols-{n}`）                                    | Number  | `3`                     |
| uploadText | 上传按钮下方文字，不传时按 mediaType 自动取"选择图片"或"选择视频"         | String  | `''`                    |
| mediaType  | 媒体类型                                                                  | String  | `image`（可选 `video`） |
| tips       | 底部提示文字                                                              | String  | `''`                    |

### Events

| 事件名            | 说明                                | 回调参数                   |
| ----------------- | ----------------------------------- | -------------------------- |
| update:modelValue | URL 列表变化（v-model 更新）        | (list: string[])           |
| success           | 单项上传成功                        | `{ url, index }`           |
| error             | 上传失败（含超出大小 / 服务器错误） | `{ message }` 或原始 error |
| delete            | 用户点击删除                        | `{ url, index }`           |

## 内部依赖

| 依赖                                              | 说明                       |
| ------------------------------------------------- | -------------------------- |
| `import.meta.env.VITE_UPLOAD_BASE_URL`            | 上传接口地址               |
| `import.meta.env.VITE_API_BASE_URL`               | 拼接显示相对路径时的基地址 |
| `vk.getStorageSync('uni_id_token')`               | 附带到请求头 `token`       |
| `vk.toast` / `vk.showLoading` / `uni.hideLoading` | 过程提示                   |
| `u-icon` / `u-loading`                            | uview-pro 图标与加载图标   |

## 接口响应约定

上传接口需返回以下结构：

```json
{
  "code": 1,
  "msg": "成功",
  "data": { "url": "https://xxx/yyy.png" }
}
```

其中 `code === 1` 视为成功，`data.url` 会被写入 modelValue 对应下标。

## 注意事项

- 上传过程中，`imageList` 中对应项为 `{ url: 临时路径, loading: true }` 对象，成功后替换为字符串 URL；因此消费方取 URL 时需判断类型：`typeof item === 'string' ? item : item.url`；
- 视频预览若 `uni.previewMedia` 不可用会降级为 `previewImage`（视频会被当图片预览，体验不佳）；
- `column` 通过拼接 `grid-cols-${cols}` 类名实现，请确保这些类在 Tailwind `safelist` 中或实际使用。
