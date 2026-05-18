---
name: 'yy-paging'
description: 'z-paging 的二次封装，一站式集成导航栏（u-navbar）、底部 tabbar（yy-tabbar）、空数据（yy-empty）、加载中（yy-loading）、没有更多（yy-nomore）、刷新、虚拟列表与页面滚动等能力。Invoke when user needs a paginated list page in tasi_h5 project.'
url: 'components/yy-paging.vue'
---

# yy-paging 分页列表容器

基于 `z-paging` 的封装组件，开箱即用地提供：下拉刷新、上拉加载更多、空数据缺省、加载中、没有更多、返回顶部、虚拟列表、顶部导航栏、底部 tabbar 等能力。内部已自动装配 `yy-empty`、`yy-loading`、`yy-nomore`、`yy-tabbar` 四个子组件的默认插槽。

## 平台差异说明

| App | H5  | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基本使用

```vue
<template>
  <yy-paging ref="pagingRef" v-model="list" @query="queryList">
    <template #cell="{ item, index }">
      <view class="p-3 bg-white mb-2">{{ item.title }}</view>
    </template>
  </yy-paging>
</template>

<script setup>
  const pagingRef = ref(null)
  const list = ref([])

  const queryList = (pageNo, pageSize) => {
    api.getList({ pageNo, pageSize }).then(({ data }) => {
      pagingRef.value.complete(data)
    })
  }
</script>
```

## 带导航栏 + 返回按钮

```vue
<yy-paging ref="pagingRef" v-model="list" nav-title="商品列表" show-nav-back @query="queryList" />
```

## 带底部 Tabbar

```vue
<yy-paging ref="pagingRef" v-model="list" :show-tabbar="true" hide-nav @query="queryList" />
```

## 开启虚拟列表（大数据）

```vue
<yy-paging
  v-model="list"
  :use-virtual-list="true"
  :use-inner-list="true"
  cell-key-name="id"
  cell-height-mode="fixed"
  @query="queryList"
/>
```

## API

### Props

| 参数                    | 说明                                                        | 类型            | 默认值             |
| ----------------------- | ----------------------------------------------------------- | --------------- | ------------------ |
| modelValue              | 双向绑定的列表数据（v-model）                               | Array           | `[]`               |
| auto                    | 是否自动触发首次加载                                        | Boolean         | `true`             |
| bgColor                 | 列表背景色（tailwind 类名或色值）                           | String          | `bg-gray-50`       |
| emptyText               | 空数据提示文字（传给 `yy-empty`）                           | String          | `暂无数据`         |
| loadingMoreNoMoreText   | 没有更多时的文字（传给 `yy-nomore`）                        | String          | `没有更多了`       |
| showRefresherWhenReload | 首次加载是否显示下拉刷新动画                                | Boolean         | `false`            |
| loadingMoreEnabled      | 是否启用上拉加载更多                                        | Boolean         | `true`             |
| refresherEnabled        | 是否启用下拉刷新                                            | Boolean         | `true`             |
| retry                   | 请求失败时是否自动重试                                      | Boolean         | `true`             |
| usePageScroll           | 是否使用页面级滚动                                          | Boolean         | `false`            |
| useVirtualList          | 是否启用虚拟列表                                            | Boolean         | `false`            |
| useInnerList            | 是否使用 z-paging 内置列表循环渲染，开启虚拟列表时恒为 true | Boolean         | `false`            |
| cellKeyName             | 虚拟列表 cell 唯一 key 字段名（nvue 必填）                  | String          | `''`               |
| innerListStyle          | 内置列表的样式对象                                          | Object          | `{}`               |
| preloadPage             | 预加载页数（视口高度倍数）                                  | Number / String | `10`               |
| cellHeightMode          | 虚拟列表 cell 高度模式                                      | String          | `fixed`            |
| virtualScrollFps        | 虚拟列表采样帧率                                            | Number / String | `60`               |
| showTabbar              | 是否在底部渲染 `yy-tabbar`                                  | Boolean         | `false`            |
| hideNav                 | 是否隐藏顶部导航栏                                          | Boolean         | `false`            |
| showNavBack             | 是否显示导航栏返回按钮                                      | Boolean         | `false`            |
| navTitle                | 导航栏标题                                                  | String          | `''`               |
| navTitleColor           | 导航栏标题颜色                                              | String          | `#fff`             |
| backIconColor           | 返回按钮颜色                                                | String          | `#fff`             |
| navBackground           | 导航栏背景对象                                              | Object          | 主题色渐变（见下） |

### navBackground 默认值

```js
{
  backgroundColor: 'var(--u-type-primary)',
  backgroundImage: 'linear-gradient(90deg, var(--u-type-primary-dark), var(--u-type-primary-disabled))'
}
```

### Events

| 事件名            | 说明                                             | 回调参数           |
| ----------------- | ------------------------------------------------ | ------------------ |
| query             | 请求分页数据（首次加载/下拉刷新/上拉加载均触发） | (pageNo, pageSize) |
| onRefresh         | 仅下拉刷新触发                                   | (pageNo, pageSize) |
| scrolltolower     | 触底                                             | (pageNo, pageSize) |
| update:modelValue | 内部列表更新时回传父组件                         | (newList)          |

### 暴露方法（通过 `ref` 调用）

| 方法                          | 说明                                     |
| ----------------------------- | ---------------------------------------- |
| `reload(data?)`               | 重置到第一页并重新加载                   |
| `complete(data)`              | 通知 z-paging 本次请求完成，传入本页数据 |
| `refresh(data?)`              | 触发下拉刷新                             |
| `setLocalPaging(data)`        | 本地分页（一次性数据分页显示）           |
| `scrollIntoViewById(x, y, z)` | 滚动到指定 id                            |
| `scrollToTop()`               | 滚动到顶部                               |

### Slots

| 插槽         | 说明                                       |
| ------------ | ------------------------------------------ |
| cell         | 列表单项渲染，作用域参数 `{ item, index }` |
| top          | 导航栏下方额外内容                         |
| bottom       | tabbar 上方额外内容                        |
| left / right | 左右固定内容（用于侧边抽屉等）             |
| f2           | 二楼内容                                   |
| default      | 直接插入 z-paging 的默认内容区             |

## 注意事项

- 默认首次加载**不**显示下拉刷新动画（`showRefresherWhenReload=false`），如需显示请显式设置为 `true`；
- 当 `showTabbar=true` 时通常会同时设置 `showNavBack=false`，避免 tab 页出现返回按钮；
- `bgColor` 字段支持 tailwind 类名（传递给内部 `class` 样式），也可传色值（需 z-paging 兼容）；
- 在使用 `usePageScroll` 时，请记得在页面 `onPageScroll` / `onReachBottom` 内分别调用 `updatePageScrollTop` / `pageReachBottom`（本组件已暴露）。
