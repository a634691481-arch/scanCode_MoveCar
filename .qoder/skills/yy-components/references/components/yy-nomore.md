---
name: 'yy-nomore'
description: "列表加载完毕的 '没有更多数据' 提示组件，适配 z-paging 的 #loadingMoreNoMore 插槽。Invoke when user needs to customize the 'no more data' footer of a paginated list."
url: 'components/yy-nomore.vue'
---

# yy-nomore 没有更多数据

列表上拉加载触底后展示的 footer 提示文本，常作为 z-paging 的 `#loadingMoreNoMore` 插槽内容使用。`yy-paging` 组件内部已自动装配。

## 平台差异说明

| App | H5  | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基本使用

```html
<yy-nomore text="没有更多了~" />
```

## 在 z-paging 中自定义

```html
<z-paging v-model="list" @query="queryList">
  <template #loadingMoreNoMore>
    <yy-nomore text="到底啦，休息一下" />
  </template>
</z-paging>
```

## API

### Props

| 参数 | 说明                                          | 类型   | 默认值            |
| ---- | --------------------------------------------- | ------ | ----------------- |
| text | 底部提示文字，传空字符串 / false 时整块不渲染 | String | `已经清澈见底啦~` |

## 注意事项

- 当 `text` 为假值时组件返回空（`v-if="text"`），可用于条件性隐藏。
- 文字默认灰色 `#8E9299`、字号 `12px (.75rem)`，如需调整请自行封装或修改源码。
