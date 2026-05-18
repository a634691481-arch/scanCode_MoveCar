---
name: yy-components
description: 'tasi_h5 项目业务组件库（yy-* 前缀）。基于 uview-pro + z-paging + TailwindCSS 封装。Invoke when developing tasi_h5 uni-app pages, using yy-* prefixed components (yy-paging, yy-empty, yy-loading, yy-upload, yy-icon, yy-tip-modal, yy-theme-picker 等), or needing project-level business components like list pagination, empty state, upload, theme switching, modal popups.'
---

# yy-components 业务组件库技能

## 触发条件

**在以下场景中自动调用此技能：**

1. 开发 tasi_h5 项目的 uni-app 页面时
2. 使用 `yy-` 前缀的组件时（如 `yy-paging`、`yy-empty`、`yy-loading`、`yy-icon` 等）
3. 需要列表分页、下拉刷新、上拉加载更多等功能时
4. 需要空数据、加载中、无网络、没有更多等状态反馈时
5. 需要图片/视频上传、头像裁剪、用户信息编辑等表单功能时
6. 需要主题切换、深色模式切换等主题管理功能时
7. 需要底部弹出选择器、提示弹窗等弹窗交互时
8. 需要 Iconify 图标（跨端 SVG 图标）时

## 组件快速索引

### 反馈状态组件

| 组件         | 说明                                      | 文档                                                  |
| ------------ | ----------------------------------------- | ----------------------------------------------------- |
| yy-empty     | 空数据缺省页（跨端 SVG + 主题色）         | [yy-empty](references/components/yy-empty.md)         |
| yy-loading   | 全屏加载动画（锥形渐变 Loader）           | [yy-loading](references/components/yy-loading.md)     |
| yy-noNetwork | 断网提示页（含重试与跳转系统设置）        | [yy-noNetwork](references/components/yy-noNetwork.md) |
| yy-nomore    | 没有更多数据提示（z-paging footer）       | [yy-nomore](references/components/yy-nomore.md)       |
| yy-refresher | 下拉刷新自定义 view（z-paging refresher） | [yy-refresher](references/components/yy-refresher.md) |

### 列表/导航组件

| 组件      | 说明                                                | 文档                                            |
| --------- | --------------------------------------------------- | ----------------------------------------------- |
| yy-paging | z-paging 二次封装，集成导航栏/tabbar/空态/加载/刷新 | [yy-paging](references/components/yy-paging.md) |
| yy-tabbar | 基于 u-tabbar + vuex 的全局底部导航                 | [yy-tabbar](references/components/yy-tabbar.md) |

### 表单交互组件

| 组件                | 说明                                        | 文档                                                                |
| ------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| yy-upload           | 图片/视频上传（多图九宫格 + 压缩 + 预览）   | [yy-upload](references/components/yy-upload.md)                     |
| yy-edit-information | 修改头像昵称弹窗（微信小程序 chooseAvatar） | [yy-edit-information](references/components/yy-edit-information.md) |

### 基础组件

| 组件    | 说明                                 | 文档                                        |
| ------- | ------------------------------------ | ------------------------------------------- |
| yy-icon | 基于 Iconify API 的跨端 SVG 图标组件 | [yy-icon](references/components/yy-icon.md) |

### 弹窗选择器组件

| 组件            | 说明               | 文档                                                        |
| --------------- | ------------------ | ----------------------------------------------------------- |
| yy-tip-modal    | 编号列表式提示弹窗 | [yy-tip-modal](references/components/yy-tip-modal.md)       |
| yy-picker-modal | 底部选项列表选择器 | [yy-picker-modal](references/components/yy-picker-modal.md) |

### 主题管理组件

| 组件                | 说明                                 | 文档                                                                |
| ------------------- | ------------------------------------ | ------------------------------------------------------------------- |
| yy-theme-picker     | 主题色切换选择器（联动 useTheme）    | [yy-theme-picker](references/components/yy-theme-picker.md)         |
| yy-dark-mode-picker | 深色模式切换选择器（开启/自动/关闭） | [yy-dark-mode-picker](references/components/yy-dark-mode-picker.md) |

## 使用约定

- 所有 `yy-*` 组件均已通过 `set.components.prefix.js` 在 `pages.json` 的 `easycom` 规则中注册，**无需手动 import**，直接在模板中使用
- 颜色默认取 uview-pro 主题主色 `uni.$u.color.primary` 或 CSS 变量 `var(--u-type-primary)`，支持主题联动
- 反馈类组件（empty/loading/nomore/refresher）通常由 `yy-paging` 内部通过插槽自动装配，页面级使用时也可独立调用
- 弹窗类组件统一使用 `u-popup` + `v-model` 控制显隐

## 典型使用示例

### 列表分页页面

```vue
<template>
  <yy-paging ref="pagingRef" v-model="list" nav-title="商品列表" show-nav-back @query="queryList">
    <template #cell="{ item, index }">
      <view class="p-3 mb-2 bg-white">{{ item.title }}</view>
    </template>
  </yy-paging>
</template>

<script setup>
  const pagingRef = ref(null)
  const list = ref([])

  const queryList = (pageNo, pageSize) => {
    api.getList({ pageNo, pageSize }).then(res => {
      pagingRef.value.complete(res.data)
    })
  }
</script>
```

### 图片上传

```vue
<template>
  <yy-upload v-model="images" :max-count="9" :max-size="3" tips="最多9张，单张不超过3M" />
</template>
```

### 主题切换

```vue
<template>
  <yy-theme-picker v-model="showTheme" @change="onThemeChange" />
  <yy-dark-mode-picker v-model="showDark" />
</template>
```

### 图标

```vue
<yy-icon name="ri:home-line" size="24" color="#333" />
```

## 完整组件列表

### 反馈状态类

- [yy-empty](references/components/yy-empty.md) - 空数据缺省页
- [yy-loading](references/components/yy-loading.md) - 全屏加载
- [yy-noNetwork](references/components/yy-noNetwork.md) - 断网提示
- [yy-nomore](references/components/yy-nomore.md) - 没有更多数据
- [yy-refresher](references/components/yy-refresher.md) - 下拉刷新视图

### 列表导航类

- [yy-paging](references/components/yy-paging.md) - 分页列表容器
- [yy-tabbar](references/components/yy-tabbar.md) - 全局底部导航

### 表单交互类

- [yy-upload](references/components/yy-upload.md) - 图片/视频上传
- [yy-edit-information](references/components/yy-edit-information.md) - 编辑昵称头像弹窗

### 基础类

- [yy-icon](references/components/yy-icon.md) - Iconify SVG 图标

### 弹窗选择类

- [yy-tip-modal](references/components/yy-tip-modal.md) - 提示弹窗
- [yy-picker-modal](references/components/yy-picker-modal.md) - 选项选择器

### 主题管理类

- [yy-theme-picker](references/components/yy-theme-picker.md) - 主题色切换
- [yy-dark-mode-picker](references/components/yy-dark-mode-picker.md) - 深色模式切换
