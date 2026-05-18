---
name: yy-page
description: 基于 Uni-App + Vue3 项目规范创建新页面。当用户需要新增页面、开发分页列表页、或使用 yy-paging / z-paging 组件时自动应用此 skill。涵盖页面模板、pages.json 注册、状态管理、分页查询、TailwindCSS 样式及代码风格规范。
---

# Uni-App 页面开发规范

## 技术栈背景

- **框架**: Uni-App（Vue 3，`<script setup>` 语法）
- **UI 库**: vk-uview-ui（`u-navbar` 等组件）
- **分页组件**: z-paging（通过 `yy-paging` 封装使用）
- **样式**: TailwindCSS + SCSS
- **状态**: 使用 `ref` 定义响应式状态（非 Vuex）
- **默认分页大小**: 12（由 `main.js` 中 `uni.$zp.config['default-page-size']` 配置）

## 创建新页面步骤

### 1. 复制基础模板

新建 `.vue` 文件，以 `pages/test/test.vue` 为基准模板：

```vue
<template>
  <view>
    <yy-paging
      v-model="state.dataList"
      @query="queryList"
      ref="paging"
      :auto="false"
      @scroll="scroll"
      :refresher-enabled="true"
      :showRefresherWhenReload="true"
    >
      <template #top>
        <u-navbar
          :background="{ backgroundColor: state.isScroll ? '#fff' : '#fff' }"
          :title="state.title"
          :border-bottom="false"
          title-color="#000"
          :isBack="false"
          backIconColor="#000"
        ></u-navbar>
      </template>
      <template #empty>
        <yy-empty></yy-empty>
      </template>
      <template #loadingMoreNoMore>
        <yy-nomore></yy-nomore>
      </template>
      <template #bottom></template>
      <!-- 页面内容区域 -->
      <view class="flex flex-col px-3"></view>
    </yy-paging>
  </view>
</template>

<script setup>
  const state = ref({
    isScroll: false,
    dataList: [],
    title: '页面标题',
  })

  const paging = ref()

  onLoad(options => {
    console.log('页面加载:', options)
  })

  onShow(options => {
    console.log('页面显示:', options)
  })

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  async function queryList(page, limit) {
    // 模拟请求
    await new Promise(resolve => setTimeout(resolve, 100))
    paging.value?.complete([1])
  }
</script>

<style lang="scss" scoped></style>
```

### 2. 注册页面到 `pages.json`

在 `pages.json` 的 `pages` 数组中添加：

```json
{
  "path": "pages/模块名/页面名",
  "style": {
    "disableScroll": true,
    "enablePullDownRefresh": false
  }
}
```

**规范**：

- 所有页面必须设置 `disableScroll: true` 和 `enablePullDownRefresh: false`
- 页面滚动由 `yy-paging` 接管，禁用原生滚动

### 3. 修改页面标题与数据

- 修改 `state.title` 为当前页面标题
- 在 `<view class="flex flex-col px-3">` 内添加页面内容
- 按需修改 `queryList` 中的数据请求逻辑

## 状态管理规范

- **页面级状态**：使用 `ref` 定义，放在 `state` 对象中集中管理
- **全局状态**：仅在需要跨页面共享时使用 Vuex（`store/modules/`）
- **分页引用**：通过 `const paging = ref()` 获取组件实例，调用 `paging.value.complete(data)` 完成加载

## 分页查询规范

`queryList(page, limit)` 方法规范：

```javascript
async function queryList(page, limit) {
  try {
    const res = await uni.request({
      url: 'your-api-url',
      data: { page, limit },
    })
    paging.value?.complete(res.data.list)
  } catch (error) {
    paging.value?.complete(false)
  }
}
```

**注意**：

- 请求成功后调用 `paging.value.complete(dataArray)`
- 请求失败调用 `paging.value.complete(false)` 触发重试
- 默认分页大小为 12

## 样式规范

- 优先使用 **TailwindCSS** 类名（如 `flex`, `flex-col`, `px-3`, `items-center`）
- **间距单位统一使用 `3`**：`p-3`、`m-3`、`gap-3`、`px-3`、`py-3` 等，3 单位在移动端显示刚好
- **子元素间距优先使用 `gap-`**：不要使用 `m-`（如 `mb-3`、`mr-2`）去挤开元素，统一使用 `gap-3` 让父容器均匀分配间距
- **等宽高使用 `size-` 简化**：`w-5 h-5` 应简化为 `size-5`
- 复杂样式或需要嵌套时使用 **SCSS**（`<style lang="scss" scoped>`）
- 颜色值尽量使用变量或统一规范

## 图标规范

- **所有图标必须使用 icon-park 组件**，组件名加 `i-` 前缀，如 `<i-camera>`、`<i-add>`
- 默认使用 `outline` 主题，需要填充时使用 `filled`
- 图标尺寸统一使用 `size="20"` 或按需调整

## 代码风格规范

遵循 `.prettierrc` 配置：

| 规则     | 值                       |
| -------- | ------------------------ |
| 行宽     | 155                      |
| 缩进     | 2 空格                   |
| 分号     | 不添加                   |
| 引号     | 单引号                   |
| 尾逗号   | 全部添加                 |
| Vue 缩进 | script 和 style 启用缩进 |

## Git 提交规范

- **单文件粒度**：每次提交仅包含一个文件
- **中文提交信息**：使用 `feat:`, `fix:`, `style:`, `refactor:` 等前缀
- 示例：`feat: 添加订单列表页面`

## 新增页面检查清单

- [ ] 复制基础模板并修改标题
- [ ] 在 `pages.json` 中注册页面（设置 `disableScroll: true`）
- [ ] 实现 `queryList` 数据请求逻辑
- [ ] 添加页面内容到 `flex flex-col px-3` 容器内
- [ ] 按需调整 `yy-paging` 的 props
- [ ] 运行 Prettier 格式化代码
- [ ] 单文件粒度提交 Git
