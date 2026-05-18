# Vue 组件规范

- 组件文件命名使用 PascalCase，页面文件使用 kebab-case
- 禁止使用 any 类型，使用 unknown 代替或在必要时添加明确类型注解
- 自定义组件统一使用 yy- 前缀命名（如 yy-paging、yy-empty、yy-loading）
- 第三方 UI 组件使用 u- 前缀（如 u-button、u-navbar）

# z-paging 分页组件使用规范

- 列表页面必须使用 <yy-paging> 或 <z-paging> 组件
- 必须实现 @query 回调函数处理分页逻辑
- 使用 paging.value?.complete(data) 完成数据加载
- 分页参数统一使用 page 和 pageSize
- 空数据必须显示 <yy-empty> 组件
- 无更多数据必须显示 <yy-nomore> 组件

# vk-unicloud 快速开发框架使用规范

- API 调用统一使用 vk.api.xxx() 方式
- 全局状态使用 vk.vuex 管理
- 存储使用 vk.setStorageSync() / vk.getStorageSync()
- 提示使用 vk.toast() / vk.alert() / vk.showLoading() / vk.hideLoading()
- 路由跳转使用 vk.redirectTo() / vk.reLaunch() / vk.navigateTo()
- 用户信息获取使用 vk.vuex.dispatch('$user/getUserInfo')

# vk-uview-ui 组件库使用规范

- 统一使用 u- 前缀的组件（如 u-button, u-navbar, u-icon）
- 优先使用组件库提供的工具函数和组件
- 表单组件必须添加必要的验证规则
- 按钮必须设置 hover-class 或 hover-class="none"

# icon-park 图标使用规范

- **页面中所有图标必须使用 icon-park 组件**，禁止直接使用图片图标或其他图标库
- 组件名加 `i-` 前缀，如 `<i-camera>`、`<i-add>`、`<i-user>`
- 默认使用 `outline` 主题，需要填充时使用 `filled`
- 图标尺寸统一使用 `size="20"` 或按需调整，建议配合 TailwindCSS 规范使用

# 代码风格规范

- 使用单引号而非双引号
- 对象最后一个属性必须有尾随逗号
- 缩进使用 2 个空格
- 方法必须使用 function 关键字定义，禁止使用箭头函数：function methodName() {}
- 每个 function 方法上方必须添加行内注释说明用途：// 获取用户信息
- 使用 const 和 let，禁止使用 var
- 异步函数必须使用 async/await 语法
- 代码结构必须清晰简洁，避免过度嵌套和复杂逻辑
- 单一职责原则：每个函数只做一件事，函数长度不超过 50 行
- 提前返回：使用 guard clauses 减少嵌套层级
- 变量命名要有意义，避免使用 a、b、c 等无意义命名

# 状态管理规范

- 使用 ref() 定义响应式变量，并添加明确类型注解
- 复杂对象状态使用 reactive() 或 interface 定义
- 组件引用使用 ref() 并添加类型：const paging = ref<InstanceType<typeof ZPaging>>()

# API 调用规范

- 所有 API 接口统一定义在 apis/http.api.js 文件中
- 调用方式：api.xxx(params)，例如 api.getUserInfo(params)
- 所有 API 调用必须使用 try-catch 或 Promise 链处理错误
- API 参数必须明确类型，禁止传递 undefined
- 关键操作（登录、支付等）必须添加 loading 提示
- API 返回数据必须进行空值安全检查
- API 方法命名使用驼峰命名法（camelCase）
- 每个 API 方法上方必须添加注释说明用途

# 页面布局与 TailwindCSS 样式规范

## 页面根结构

- 页面内容根容器统一使用：`flex flex-col gap-3 p-3`
- 禁止在根容器直接使用 `m-*` 控制子元素间距，必须通过 `gap-*` 实现

## 卡片模块

- 功能模块/卡片统一使用：`flex flex-col overflow-hidden bg-white rounded-lg shadow-sm`
- 卡片头部统一使用：`flex items-center justify-between p-3 border-b border-gray-100`
- 卡片标题统一使用：`text-sm font-medium text-gray-900`
- 卡片右侧操作区统一使用：`flex items-center text-xs text-gray-400`

## 文字颜色层级

- 主要标题/昵称：`text-base font-medium text-gray-900`
- 模块标题：`text-sm font-medium text-gray-900`
- 列表项名称：`text-sm text-gray-700`
- 辅助说明文字：`text-xs text-gray-600`
- 次要/提示文字：`text-xs text-gray-400`

## 图标使用规范

- 功能图标统一使用 `zero-icon`，尺寸 `size="24"`
- 功能图标颜色统一通过 `:color="uni.$u.color.primary"` 传入主题主色（值为 `uni.$u.color.primary`）
- 列表右侧箭头统一使用：`u-icon name="arrow-right" size="22" color="#ccc"`
- 头部操作箭头统一使用：`u-icon name="arrow-right" size="22" class="ml-0.5 align-middle"`

## 四列网格（金刚区/快捷入口）

- 网格容器：`grid grid-cols-4 py-3`
- 单项布局：`flex flex-col items-center justify-center gap-1`
- 图标：`zero-icon size="24" :color="uni.$u.color.primary"`
- 名称：`text-xs text-gray-600`

## 功能列表

- 列表容器：`flex flex-col overflow-hidden bg-white rounded-lg shadow-sm`
- 列表项：`last:border-b-0 active:bg-gray-50 flex items-center justify-between px-3 py-3 transition-colors border-b border-gray-100`
- 左侧内容：`flex items-center gap-2`
  - 图标：`zero-icon size="24" :color="uni.$u.color.primary"`
  - 文字：`text-sm text-gray-700`
- 右侧箭头：`u-icon name="arrow-right" size="22" color="#ccc"`

## 用户信息横排

- 容器：`flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm`
- 头像占位：`size-12 rounded-full`，背景按需使用主题色或 `bg-slate-200`
- 信息区：`flex flex-col`
  - 主信息：`text-base font-medium text-gray-900`
  - 辅助信息：`text-xs text-gray-400 mt-0.5`

## 间距与尺寸

- 间距单位统一使用 `3`：`p-3`、`gap-3`、`px-3`、`py-3` 等
- 子元素间距优先使用 `gap-*`，禁止使用 `m-*`（如 `mb-3`、`mr-2`）挤开元素
- 等宽高使用 `size-*` 简化：`w-5 h-5` 应简化为 `size-5`

## 颜色与主题

- 主题色统一通过 `uni.$u.color.primary` 获取，禁止硬编码主题色
- 卡片背景统一使用 `bg-white`
- 边框统一使用 `border-gray-100`
- 点击反馈统一使用 `active:bg-gray-50 transition-colors`
- 复杂样式或自定义样式使用 SCSS 并添加 scoped
- 避免内联样式，优先使用 Tailwind 类名

# 安全与最佳实践

- 禁止在代码中硬编码敏感信息（密钥、Token 等）
- 用户输入必须进行校验和转义
- 涉及金额计算使用整数（分）避免浮点精度问题
- 列表渲染必须使用 :key 且 key 值必须唯一
- 组件卸载时必须清理定时器和事件监听

# 文件组织规范

- 页面文件放在 pages 目录下
- 公共组件放在 components 目录下
- 工具函数放在 common/function 或 common/utils 目录
- 样式文件放在 common/css 目录
- API 定义放在 apis 目录

# 公共方法规范

- 所有公共方法统一定义在 common/function/myPubFunction.js 文件中
- 调用方式：vk.myfn.xxx()，例如 vk.myfn.maskPhoneNumber(phone)
- 公共方法命名使用驼峰命名法（camelCase）
- 每个公共方法上方必须添加注释说明用途
- 方法要单一职责，避免过于复杂

# Git 提交规范

- 提交信息格式：type: description
- type 可选：feat（新功能）、fix（修复）、docs（文档）、style（样式）、refactor（重构）、perf（性能）、test（测试）、chore（构建）
- 描述使用中文，简洁明了

# 禁止行为

- 不要主动创建 .md 文档文件（除非明确要求）
- 不要删除用户已有的代码逻辑
- 不要在未确认的情况下执行危险操作（如删除文件）
- 不要忽略 TypeScript 类型错误
