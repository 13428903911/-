<template>
	<view class="container">
		<nav-bar :title="title" :showBack="showBack"/>
		<!-- <view class="tab">
			<view class="constant" @click="clickTab(index)" v-for="(item,index) in tabTitleL" :key="index" :class="flag === index ? 'active': ''">{{item}}</view>
		</view> -->
		<!-- 会话 -->
		<view v-show="flag === 0">
			<Session></Session>
		</view>
		<!-- 系统 -->
		<view v-show="flag === 1">
			<System></System>
		</view>
	</view>
</template>

<script>
	import Session from './session/session.vue'
	import System from './systems/systems.vue'
	import navbar from '@/components/nav-bar/nav-bar.vue'
	export default {
		components: { Session, System ,navbar},
		data() {
			return {
				title:'消息',
				showBack:false,
				flag: 0, // 切换tab
				tabTitleL: ["会话","系统"],
			}
		},
		methods: {
			goBack(){
				uni.navigateBack({})
			},
			// 选项卡事件
			clickTab(index) {
				const vm = this
				vm.flag = index
			},
		}
	}
</script>

<style lang="scss" scoped>
.container{
	background-color: #f9f9f9;
	height: 100vh;
}
.container /deep/.uni-navbar--border{
	box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(0,0,0,0.08), 0rpx 2rpx 8rpx 0rpx #ffffff; 
}
// 选项卡样式
.tab{
	font-size: 30rpx;
	font-weight: 400;
	text-align: center;
	color: #ffffff;
	line-height: 64rpx;
	display: flex;
	// justify-content: space-between;
	align-items: center;
	width:256rpx;
	height: 64rpx;
	background: #795c98;
	border-radius: 16rpx;
	margin: 24rpx auto;
	.active{
		background: #ffffff;
		border-radius: 16rpx;
		margin: 4rpx;
		color: #795c98 !important;
	}
	.constant{
		width: 124rpx;
		height: 56rpx;
		opacity: 1;
		text-align: center;
		color: #FFFFFF;
		line-height: 56rpx;
	}
}
</style>
