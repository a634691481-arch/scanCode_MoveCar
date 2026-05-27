<template>
	<yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
		<view class="page-content">
			<!-- 用户头像区 -->
			<view class="hero-section"
				:style="{ background: `linear-gradient(135deg, ${uni.$u.color.primary}, ${uni.$u.color.primaryDark})` }">
				<view class="hero-content">
					<view class="hero-icon-wrap" :style="{ background: 'rgba(255,255,255,0.2)' }">
						<yy-icon name="ri:user-3-fill" size="40" color="#ffffff" />
					</view>
					<text class="hero-title">车主用户</text>
					<text class="hero-desc">{{ carPlateDesc || '绑定车辆后可快速管理' }}</text>
					<view v-if="carStat" class="hero-stats">
						<view class="hero-stat-item">
							<text class="hero-stat-num">{{ carStat.count }}</text>
							<text class="hero-stat-label">已绑定车辆</text>
						</view>
						<view class="hero-stat-divider"></view>
						<view class="hero-stat-item">
							<text class="hero-stat-num">{{ carStat.defaultPlate }}</text>
							<text class="hero-stat-label">默认车辆</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 车辆信息入口卡片 -->
			<view class="info-entry-card" @click="toCarManage">
				<view class="info-entry-left">
					<view class="card-icon">
						<yy-icon name="ri:car-line" size="20" :color="uni.$u.color.primary" />
					</view>
					<view class="info-entry-content">
						<text class="info-entry-title">我的车辆</text>
						<text class="info-entry-desc">{{ carBoundDesc }}</text>
					</view>
				</view>
				<yy-icon name="ri:arrow-right-s-line" size="20" color="#9ca3af" />
			</view>

			<!-- 功能宫格 -->
			<view class="grid-card">
				<view class="grid-item" @click="toGuide">
					<view class="grid-icon" style="background: #ecfdf5">
						<yy-icon name="ri:book-open-line" size="22" color="#10b981" />
					</view>
					<text class="grid-label">使用教程</text>
				</view>
				<view class="grid-item" @click="toStatistics">
					<view class="grid-icon" style="background: #fef3c7">
						<yy-icon name="ri:bar-chart-box-line" size="22" color="#d97706" />
					</view>
					<text class="grid-label">使用统计</text>
				</view>
				<view class="grid-item" @click="toQrcode">
					<view class="grid-icon" style="background: var(--u-type-primary-light)">
						<yy-icon name="ri:qr-code-line" size="22" :color="uni.$u.color.primary" />
					</view>
					<text class="grid-label">我的挪车码</text>
				</view>
				<view class="grid-item" @click="toContactHistory">
					<view class="grid-icon" style="background: #eff6ff">
						<yy-icon name="ri:history-line" size="22" :color="uni.$u.color.primary" />
					</view>
					<text class="grid-label">联系历史</text>
				</view>
				<view class="grid-item" @click="showThemePicker">
					<view class="grid-icon" :style="{ background: uni.$u.color.primaryLight }">
						<yy-icon name="ri:palette-line" size="22" :color="uni.$u.color.primary" />
					</view>
					<text class="grid-label">主题设置</text>
				</view>
				<view class="grid-item" @click="toFeedback">
					<view class="grid-icon" style="background: #fef3c7">
						<yy-icon name="ri:feedback-line" size="22" color="#d97706" />
					</view>
					<text class="grid-label">用户反馈</text>
				</view>
				<view class="grid-item" @click="toPrivacy">
					<view class="grid-icon" style="background: #f0f9ff">
						<yy-icon name="ri:shield-check-line" size="22" color="#0284c7" />
					</view>
					<text class="grid-label">隐私与协议</text>
				</view>
				<view class="grid-item" @click="showAbout">
					<view class="grid-icon" style="background: #faf5ff">
						<yy-icon name="ri:information-line" size="22" color="#9333ea" />
					</view>
					<text class="grid-label">关于我们</text>
				</view>
			</view>

			<!-- 注销账号 -->
			<view class="logout-card" @click="handleLogout">
				<yy-icon name="ri:logout-box-r-line" size="18" color="#ef4444" />
				<text class="logout-text">注销账号</text>
			</view>

			<view style="height: 40rpx"></view>
		</view>

		<!-- 主题选择弹框 -->
		<yy-theme-picker v-model="themePickerVisible" />
	</yy-paging>
</template>

<script setup>
	// ====== yy-paging 配置 ======
	const pagingConfig = ref({
		auto: false,
		refresherEnabled: false,
		showRefresherWhenReload: false,
		loadingMoreEnabled: false,
		showTabbar: false,
		hideNav: false,
		showNavBack: true,
		navTitle: '我的',
		color: uni.$u.color.primary,
	})

	const state = ref({
		isScroll: false,
		dataList: [],
	})

	const paging = ref()

	// ====== 业务状态 ======
	const themePickerVisible = ref(false)
	const carPlateDesc = ref('')

	const carBoundDesc = computed(() => carPlateDesc.value || '点击添加或管理车牌信息')

	const carStat = computed(() => {
		const desc = carPlateDesc.value
		if (!desc) return null
		const match = desc.match(/已绑定 (\d+) 辆车：(.+)/)
		if (!match) return null
		return { count: match[1], label: '已绑定车辆', defaultPlate: match[2] }
	})

	onLoad(() => {
		loadCarDesc()
	})

	onShow(() => {
		loadCarDesc()
	})

	onShareAppMessage(() => {
		return {
			title: '扫码挪车 - 便捷联系车主',
			path: '/pages/index/index',
			imageUrl: '/static/logo.png',
		}
	})

	onShareTimeline(() => {
		return {
			title: '扫码挪车 - 便捷联系车主',
			path: '/pages/index/index',
			imageUrl: '/static/logo.png',
		}
	})

	function scroll(e) {
		state.value.isScroll = e.detail.scrollTop > 0
	}

	async function queryList(page, limit) {
		await new Promise(resolve => setTimeout(resolve, 50))
		paging.value?.complete([])
	}

	// 加载车辆简要信息（用于入口描述展示）
	async function loadCarDesc() {
		const uid = vk.getStorageSync('uni_id_token')
		if (!uid) {
			carPlateDesc.value = ''
			return
		}
		try {
			const res = await vk.callFunction({
				url: 'client/pub_index.getMyCarList',
				data: { uid },
			})
			console.log(333333333, res)
			if (res.code === 0 && res.data && res.data.carList && res.data.carList.length > 0) {
				const list = res.data.carList
				const defaultCar = list.find(c => c.isDefault) || list[0]
				if (defaultCar && defaultCar.plate) {
					vk.setStorageSync('my_car_plate', defaultCar.plate)
				}
				const plates = list.map(c => c.plate).filter(Boolean)
				carPlateDesc.value =
					plates.length > 0 ?
					`已绑定 ${plates.length} 辆车：${plates.slice(0, 2).join('、')}${plates.length > 2 ? '...' : ''}` :
					''
			} else {
				carPlateDesc.value = ''
			}
		} catch (err) {
			carPlateDesc.value = ''
		}
	}

	function toCarManage() {
		vk.navigateTo('/pages/my/car-manage')
	}

	function toGuide() {
		vk.navigateTo('/pages/my/guide')
	}

	function toStatistics() {
		vk.navigateTo('/pages/my/statistics')
	}

	function toQrcode() {
		vk.navigateTo('/pages/my/qrcode')
	}

	function toContactHistory() {
		vk.navigateTo('/pages/my/contact-history')
	}

	function toFeedback() {
		vk.navigateTo('/pages/my/feedback')
	}

	function toPrivacy() {
		vk.navigateTo('/pages/privacy/index')
	}

	function showAbout() {
		vk.alert(
			'一款便捷的挪车工具，帮助您快速联系车主或被联系，让出行更高效。\n\n版本：v1.0.0   \n\n作者微信：YovoeL--0326',
			'关于挪车助手',
			'我知道了',
		)
	}

	function showThemePicker() {
		themePickerVisible.value = true
	}

	function handleLogout() {
		vk.confirm({
			title: '退出登录',
			content: '确定要退出登录吗？',
			confirmText: '确定退出',
			cancelText: '取消',
			success: async res => {
				if (res.confirm) {
					try {
						await new Promise((resolve, reject) => {
							vk.userCenter.logout({
								success: () => resolve(),
								fail: err => reject(err),
							})
						})

						vk.removeStorageSync('uni_id_token')
						vk.removeStorageSync('uni_id_token_expired')
						vk.removeStorageSync('my_car_plate')

						carPlateDesc.value = ''
						vk.toast('已退出登录')
						vk.redirectTo('/pages/index/index')
					} catch (err) {
						vk.toast('退出失败')
					}
				}
			},
		})
	}
</script>

<style lang="scss" scoped>
	.page-content {
		min-height: 100vh;
		background: #f5f7fb;
		padding-bottom: 24rpx;
	}

	/* ====== Hero 区域 ====== */
	.hero-section {
		padding: 50px 24px 36px;
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: -60%;
			right: -30%;
			width: 400px;
			height: 400px;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.08);
		}

		&::after {
			content: '';
			position: absolute;
			bottom: -40%;
			left: -20%;
			width: 300px;
			height: 300px;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.06);
		}
	}

	.hero-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hero-icon-wrap {
		width: 80px;
		height: 80px;
		border-radius: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16px;
		backdrop-filter: blur(10px);
	}

	.hero-title {
		font-size: 28px;
		font-weight: 800;
		color: #ffffff;
		margin-bottom: 8px;
	}

	.hero-desc {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.6;
		text-align: center;
		max-width: 300px;
		margin-bottom: 28px;
	}

	.hero-stats {
		display: flex;
		align-items: center;
		gap: 0;
		background: rgba(255, 255, 255, 0.15);
		border-radius: 16px;
		padding: 16px 20px;
		backdrop-filter: blur(10px);
		width: 100%;
		max-width: 340px;
	}

	.hero-stat-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hero-stat-num {
		font-size: 16px;
		font-weight: 800;
		color: #ffffff;
		margin-bottom: 2px;
	}

	.hero-stat-label {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.7);
	}

	.hero-stat-divider {
		width: 1px;
		height: 32px;
		background: rgba(255, 255, 255, 0.25);
	}

	/* 车辆入口卡片 */
	.info-entry-card {
		margin: 16px 16px 0;
		background: #ffffff;
		border-radius: 20px;
		padding: 16px 18px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);

		&:active {
			background: #f9fafb;
		}
	}

	.info-entry-left {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
	}

	.card-icon {
		width: 40px;
		height: 40px;
		background: var(--u-type-primary-light);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.info-entry-content {
		flex: 1;
	}

	.info-entry-title {
		display: block;
		font-size: 15px;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 2px;
	}

	.info-entry-desc {
		display: block;
		font-size: 12px;
		color: #9ca3af;
		line-height: 1.4;
	}

	/* 功能宫格 */
	.grid-card {
		margin: 12px 16px 0;
		background: #ffffff;
		border-radius: 20px;
		padding: 16px 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px 4px;
	}

	.grid-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 10px 4px;
		border-radius: 14px;

		&:active {
			background: #f9fafb;
			transform: scale(0.95);
		}
	}

	.grid-icon {
		width: 44px;
		height: 44px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.grid-label {
		font-size: 12px;
		font-weight: 500;
		color: #374151;
		text-align: center;
		line-height: 1.2;
	}

	/* 注销账号 */
	.logout-card {
		margin: 12px 16px 0;
		background: #ffffff;
		border-radius: 14px;
		padding: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

		&:active {
			opacity: 0.8;
			background: #fef2f2;
		}
	}

	.logout-text {
		font-size: 14px;
		font-weight: 500;
		color: #ef4444;
	}
</style>