<template>
	<yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
		<view class="page-content">
			<!-- 二维码展示卡 -->
			<view class="qr-card" v-if="hasInfo">
				<!-- 车牌信息头部 -->
				<view class="qr-card-header">
					<view class="qr-car-icon" :style="qrCarIconStyle">
						<yy-icon name="ri:car-line" size="28" :color="uni.$u.color.primary" />
					</view>
					<view class="qr-car-info">
						<text class="qr-plate">{{ carInfo.plate }}</text>
						<text class="qr-desc" v-if="carInfo.carDesc">{{ carInfo.carDesc }}</text>
					</view>
				</view>

				<!-- 信息摘要 -->
				<view class="qr-info-list">
					<view class="qr-info-item">
						<yy-icon name="ri:phone-line" size="16" color="#6b7280" />
						<text class="qr-info-value">{{ displayPhone }}</text>
					</view>
					<view class="qr-info-item" v-if="carInfo.note">
						<yy-icon name="ri:message-2-line" size="16" color="#6b7280" />
						<text class="qr-info-value">{{ carInfo.note }}</text>
					</view>
				</view>

				<!-- 操作按钮 -->
				<view class="qr-actions">
					<view class="qr-btn-save" :style="qrBtnSaveStyle" @click="saveQRCode">
						<yy-icon name="ri:download-line" size="18" color="#ffffff" />
						<text class="qr-btn-save-text">保存到相册</text>
					</view>
					<view class="qr-btn-share" :style="qrBtnShareStyle" @click="shareQR">
						<yy-icon name="ri:share-line" size="18" :color="uni.$u.color.primary" />
						<text class="qr-btn-share-text">分享</text>
					</view>
				</view>
			</view>

			<!-- 未设置信息 -->
			<view class="empty-card" v-else>
				<text class="empty-title">暂无挪车码</text>
				<text class="empty-desc">请先在"我的"页面设置车辆信息后再生成挪车码</text>
				<view class="empty-btn" :style="emptyBtnStyle" @click="toMy">
					<text class="empty-btn-text">去设置车辆信息</text>
				</view>
			</view>

			<!-- 使用说明 -->
			<view class="guide-card" v-if="hasInfo">
				<view class="guide-header">
					<yy-icon name="ri:question-line" size="16" :color="uni.$u.color.primary" />
					<text class="guide-title">如何使用挪车码？</text>
				</view>
				<view class="guide-steps">
					<view class="guide-step">
						<view class="step-num" :style="stepNumStyle">1</view>
						<view class="step-content">
							<text class="step-title">保存或打印</text>
							<text class="step-desc">点击"保存到相册"，在打印店打印为贴纸</text>
						</view>
					</view>
					<view class="guide-step">
						<view class="step-num" :style="stepNumStyle">2</view>
						<view class="step-content">
							<text class="step-title">贴在车窗上</text>
							<text class="step-desc">将二维码贴在挡风玻璃内侧或车窗明显位置</text>
						</view>
					</view>
					<view class="guide-step">
						<view class="step-num" :style="stepNumStyle">3</view>
						<view class="step-content">
							<text class="step-title">等待扫码联系</text>
							<text class="step-desc">他人扫码后可直接拨打您的电话或发送短信</text>
						</view>
					</view>
				</view>
			</view>

			<view style="height: 40rpx;"></view>
		</view>
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
		navTitle: '我的挪车码',
		color: uni.$u.color.primary,
	})

	const state = ref({
		isScroll: false,
		dataList: [],
	})

	const paging = ref()

	// ====== 业务状态 ======
	const carInfo = ref({
		plate: '',
		phone: '',
		carDesc: '',
		note: '',
		hidePhone: false,
	})
	const hasInfo = ref(false)

	const displayPhone = computed(() => {
		if (!carInfo.value.phone) return ''
		return carInfo.value.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
	})

	const qrCarIconStyle = computed(() => ({
		background: uni.$u.color.primaryLight,
	}))

	const qrBtnSaveStyle = computed(() => ({
		background: `linear-gradient(135deg, ${uni.$u.color.primary}, ${uni.$u.color.primaryDark})`,
		boxShadow: `0 6px 16px ${uni.$u.color.primary}4d`,
	}))

	const qrBtnShareStyle = computed(() => ({
		background: uni.$u.color.primaryLight,
		border: `1.5px solid ${uni.$u.color.primaryDisabled}`,
	}))

	const emptyBtnStyle = computed(() => ({
		background: uni.$u.color.primary,
	}))

	const stepNumStyle = computed(() => ({
		background: uni.$u.color.primaryLight,
		color: uni.$u.color.primary,
	}))

	onLoad(() => {
		const saved = vk.getStorageSync('my_car_info')
		if (saved && saved.plate && saved.phone) {
			carInfo.value = saved
			hasInfo.value = true


		}
	})

	function scroll(e) {
		state.value.isScroll = e.detail.scrollTop > 0
	}

	async function queryList(page, limit) {
		await new Promise(resolve => setTimeout(resolve, 50))
		paging.value?.complete([])
	}

	function saveQRCode() {
		vk.toast('保存功能开发中', 'none')
	}

	function shareQR() {
		vk.toast('请使用右上角分享')
	}

	function toMy() {
		vk.navigateTo('/pages/my/index')
	}
</script>

<style lang="scss" scoped>
	.page-content {
		min-height: 100vh;
		background: #f5f7fb;
		padding: 12px 0 24rpx;
	}

	/* 二维码卡片 */
	.qr-card {
		margin: 0 16px;
		background: #ffffff;
		border-radius: 24px;
		padding: 24px 20px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
	}

	.qr-card-header {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 1px dashed #e5e7eb;
	}

	.qr-car-icon {
		width: 52px;
		height: 52px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.qr-plate {
		display: block;
		font-size: 22px;
		font-weight: 800;
		color: #1f2937;
		letter-spacing: 1px;
	}

	.qr-desc {
		display: block;
		font-size: 13px;
		color: #6b7280;
		margin-top: 2px;
	}

	.qr-info-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 14px;
		background: #f9fafb;
		border-radius: 12px;
		margin-bottom: 16px;
	}

	.qr-info-item {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.qr-info-value {
		font-size: 13px;
		color: #4b5563;
	}

	.qr-actions {
		display: flex;
		gap: 10px;
	}

	.qr-btn-save {
		flex: 2;
		height: 48px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;

		&:active {
			opacity: 0.9;
		}
	}

	.qr-btn-save-text {
		font-size: 14px;
		font-weight: 600;
		color: #ffffff;
	}

	.qr-btn-share {
		flex: 1;
		height: 48px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;

		&:active {
			opacity: 0.8;
		}
	}

	.qr-btn-share-text {
		font-size: 14px;
		font-weight: 600;
		color: var(--u-type-primary);
	}

	/* 空状态 */
	.empty-card {
		margin: 16px 16px 0;
		background: #ffffff;
		border-radius: 24px;
		padding: 48px 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
	}

	.empty-title {
		font-size: 17px;
		font-weight: 600;
		color: #111827;
		margin-bottom: 8px;
	}

	.empty-desc {
		font-size: 13px;
		color: #6b7280;
		text-align: center;
		margin-bottom: 24px;
	}

	.empty-btn {
		height: 44px;
		padding: 0 32px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;

		&:active {
			opacity: 0.9;
		}
	}

	.empty-btn-text {
		font-size: 14px;
		font-weight: 600;
		color: #ffffff;
	}

	/* 使用指南 */
	.guide-card {
		margin: 12px 16px 0;
		background: #ffffff;
		border-radius: 20px;
		padding: 18px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
	}

	.guide-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 16px;
	}

	.guide-title {
		font-size: 15px;
		font-weight: 600;
		color: #111827;
	}

	.guide-steps {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.guide-step {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	.step-num {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: 700;
		flex-shrink: 0;
	}

	.step-content {
		flex: 1;
	}

	.step-title {
		display: block;
		font-size: 14px;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 2px;
	}

	.step-desc {
		display: block;
		font-size: 12px;
		color: #6b7280;
		line-height: 1.5;
	}
</style>