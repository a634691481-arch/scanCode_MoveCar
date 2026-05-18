---
name: 'yy-refresher'
description: '下拉刷新自定义视图组件，适配 z-paging 的 #refresher 插槽，根据不同 status 显示不同动画和文案。Invoke when user needs to customize the pull-to-refresh header of a paginated list.'
url: 'components/yy-refresher.vue'
---

# yy-refresher 下拉刷新视图

z-paging 的自定义下拉刷新组件，接收当前刷新状态 `status`（默认/即将释放/加载中/完成），通过 gif 动图和状态文案展示进度。

## 平台差异说明

| App | H5  | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基本使用

作为 z-paging 的 `refresher` 插槽使用：

```html
<z-paging v-model="list" @query="queryList">
  <template #refresher="{ refresherStatus }">
    <yy-refresher :status="refresherStatus" />
  </template>
</z-paging>
```

## 状态映射

| status 值            | 显示文案                 |
| -------------------- | ------------------------ |
| `default`            | `哎呀，用点力继续下拉！` |
| `release-to-refresh` | `拉疼我啦，松手刷新~~`   |
| `loading`            | `正在努力刷新中...`      |
| `complete`           | `刷新成功啦~`            |

## API

### Props

| 参数   | 说明                               | 类型   | 默认值 |
| ------ | ---------------------------------- | ------ | ------ |
| status | 当前刷新状态，由 z-paging 自动传入 | String | `''`   |

## 注意事项

- 依赖静态图片 `/static/dddr118.gif` 作为下拉动画，可替换为项目自有 gif；
- 容器固定高度 `150rpx`，水平垂直居中；
- 如需与 `yy-paging` 联动，取消 `yy-paging.vue` 中对应插槽的注释即可（默认未启用）。
