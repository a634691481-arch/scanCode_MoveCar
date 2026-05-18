
type PageOptions = {
	needLogin?: boolean
	style: {
		h5?: object
		"app-jd"?: object
		"app-qq"?: object
		maxWidth?: number
		topWindow?: boolean
		"app-lark"?: object
		"app-plus"?: object
		titleImage?: string
		"mp-baidu"?: object
		leftWindow?: boolean
		"mp-alipay"?: object
		"mp-weixin"?: object
		rightWindow?: boolean
		"mp-toutiao"?: object
		"mp-kuaishou"?: object
		disableScroll?: boolean
		titlePenetrate?: string
		navigationStyle?: string
		backgroundColor?: string
		usingComponents?: object
		transparentTitle?: string
		disableSwipeBack?: boolean
		backgroundColorTop?: string
		navigationBarShadow?: { colorType?: string }
		backgroundTextStyle?: string
		enablePullDownRefresh?: boolean
		onReachBottomDistance?: number
		backgroundColorBottom?: string
		navigationBarTextStyle?: string
		navigationBarTitleText?: string
		navigationBarBackgroundColor?: string
	}
};

/**
 * @description [根据页文件路径自动生成 `pages.json` 配置](https://ext.dcloud.net.cn/plugin?id=17727)
 * @param { string } options.tabBar 主包文件名
 * @param { boolean | string[] } options.subPackages 是否开启分包/分包路径；如：`['pages/home', 'home']`
 * @param { PageOptions } options.pageConfig `uniapp` [主包页面配置](https://uniapp.dcloud.net.cn/collocation/pages.html#page
 * @param { PageOptions } options.tabBarPageConfig `uniapp` [主包页面配置](https://uniapp.dcloud.net.cn/collocation/pages.html#pages)
 * @param { string | string[] } options.exclude 排除文件|文件夹；如：`[pages/test, pages/home]`；默认排除根目录里面的所有 `components` 文件夹；
 * @param { PageOptions } options.subPackagesConfig `uniapp` [分包页面配置](https://uniapp.dcloud.net.cn/collocation/pages.html#subpackages)
 * @param { boolean } options.autoAormat 是否自动格配置；注：`根据主包文件名/分包规则重新排序。如：{ pages: [{ path: 'pages/index/index' }] } 自动转 { subPackages: [{ root: 'pages/index', pages: [{ path: 'index' }] }] }`
 * @param { boolean } options.customTabBar 是否自定义 tabBar；注：`开启自定义 tabBar 时，会读取主包下的文件生成 { tabBar: { list: [{ pagePath: 'pages/index/index' }] } }；因为 uniapp 不管是不是自定义如果有 tabBar 页 pages.json 需要必须存在 tabBar 配置`
 */
declare function autoPagesJson(options?: {
	tabBar?: string
	autoAormat?: boolean
	customTabBar?: boolean
	pageConfig?: PageOptions
	exclude?: string | string[]
	tabBarPageConfig?: PageOptions
	subPackagesConfig?: PageOptions
	subPackages?: boolean | string[]

}): { name: string, enforce: string };


export default autoPagesJson;