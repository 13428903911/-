<template>
	<view class="header">
		<nav-bar :title="title" @goBack="goBack"/>
		<view class="header-set">
			<view class="set-tit" @click="sets" >
				<view  class="user-pic">
					<view class="main">
						<open-data  type="userAvatarUrl" v-if="!uesrInfo.headUrl"></open-data>
						<image class="portrait" mode="aspectFill" v-else :src="imgObs + uesrInfo.headUrl"></image>
					</view>
					<!-- <open-data type="userNickName" class="name bold" v-if="!uesrInfo.nickname"></open-data> -->
					<text style="font-size: 30rpx;">{{uesrInfo.nickname}}</text>
				</view>
				<i class="iconfont">&#xe61a;</i>
			</view>
		</view>
		<uni-popup ref="popup" type="dialog">
				<uni-popup-dialog type="info" title="提示" content="确定要退出登录吗？" :duration="2000" :before-close="true" @close="$refs.popup.close()" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		<button class="header-button" type="default" @click="quit">退出登录</button>
	</view>
</template>

<script>
	import { getMemberInfo } from '@/utils/network/api.js'
	import navbar from '@/components/nav-bar/nav-bar.vue'
	export default {
		props:{
			navbar
		},
		data() {
			return {
				uesrInfo:{
					headUrl:'',
					nickname:'',
					gender:'',
					telephone:''
				},
				imgObs: process.env.VUE_APP_OBS_FILE_API, // 图片obs
				title:'设置'
			}
		},
		onLoad(){
		  const that = this
			that.getInfo()
		},
		methods: {
			goBack(){
				uni.navigateBack({})
			},
			// 获取用户信息
			getInfo(){
				const that = this
				getMemberInfo().then(res => {
					that.uesrInfo = res.data
					// console.log("获取用户信息:",that.uesrInfo)
				})
			},
			// 退出登录
			quit() {
				const that =this
				that.$refs.popup.open()
			},
			confirm(){
				const that =this
				that.$refs.popup.close()
				uni.removeStorageSync('authorization')
				uni.removeStorageSync('UserInfo')
				uni.removeStorageSync('Longitude')
				uni.reLaunch({
				   url: '/pages/arthorize/index'
				})
			},
			sets(){
				uni.navigateTo({
				   url: '/pages/me/setup/information?nickname=' + this.uesrInfo.nickname + '&gender=' + this.uesrInfo.gender + '&headUrl=' + this.uesrInfo.headUrl + '&telephone=' + this.uesrInfo.telephone
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header /deep/.uni-popup__success{
		 color: #000000;
	}
.header{
	background: #f9f9f9;
	height: 100vh;
	.header-set{
		background: #fff;
		margin: 24rpx 24rpx 0 24rpx;
		border-radius: 16rpx;
	}
	.set-tit{
		display:flex;
		align-items:center;
		justify-content: space-between;
		height: 144rpx;
		padding: 0 24rpx;
		.user-pic{
			display: flex;
			align-items: center;
			.main{
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				overflow: hidden;
				.portrait{
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			
			text{
				padding-left: 24rpx;
				font-size: 36rpx;
				flex: 1;
			}
		}
		.iconfont{
			font-size: 48rpx;
			float: right;
			color: #9e9e9e;
		}
	}
	/deep/ .header-button{
	    background-color: #f8f8f8;
	    margin: 0 12px;
			height: 112rpx;
			line-height: 112rpx;
	    border: none;
	    background: #795C98;
	    color: #ffffff;
			position: fixed;
			width: 702rpx;
			bottom: 70rpx;
	}
}
</style>
