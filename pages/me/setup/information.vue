<template>
	<view class="header"> 
		<nav-bar :title="title" @goBack="goBack"/>
		<view class="header-set">
			<view class="top-box">
				<view class="top-img" @click="uploadImag">
					<image v-if="headUrl !== ''" :src="imgObs + headUrl" mode="aspectFill"></image>
					<open-data v-else type="userAvatarUrl"></open-data>
				</view>
				<view class="top-txt">点击更改头像</view>
			</view>
			<view class="list">
				<view class="list-name">账号</view>
				<view class="list-txt">{{telephone}}</view>
			</view>
			<view class="list">
				<view class="list-name">用户名称</view>
				<!-- <view class="list-txt">{{ nickname }}</view> -->
				<view class="list-txt">
					<input type="text" disabled v-model.trim="nickname" :focus="false" maxlength="20" @input="inputChange"/>
				</view>
			</view>
			<!-- <view class="list" style="border-top:0.5rpx solid rgba(51,51,51,0.1);">
				<view class="list-name">性别</view>
				<view class="list-txt">
					 <easy-select ref="easySelect" :placeholder="placeholder" style="width: 500rpx;height: 96rpx;" :options="options" :value="gender" @selectOne="selectOne"></easy-select>
				</view>
			</view> -->
		</view>
		<button class="header-button" type="default" @click="submit">保 存</button>
		
	</view>
</template>

<script>
	import { updateMember } from '@/utils/network/api.js'
	import navbar from '@/components/nav-bar/nav-bar.vue'
	export default {
		components:{
			navbar
		},
		data() {
			return {
				title:'个人信息',
				Size:2*1024*1024,//定义图片大小
				imgObs: process.env.VUE_APP_OBS_FILE_API, // 图片obs
				placeholder:'', 
				nickname:'', // 用户名
				gender:'', // 性别
				headUrl:null, // 头像
				telephone:'', // 店铺账号
				// imgObs:'',
				options:[{
					value: 1,
					label: '男'
				}, {
					value: 0,
					label: '女'
				}]
			}
		},
		onShow() {
			// const that = this
			// const globalData = getApp().globalData
			// that.imgObs = globalData.imgObs
		},
		onLoad(options){
			const that = this
			const userInfo = uni.getStorageSync('UserInfo')
			that.nickname = userInfo.nickname || ''
			that.telephone = userInfo.telephone || ''
			that.headUrl = userInfo.headUrl || ''
			// that.nickname = options.nickname
			// that.telephone = options.telephone
			// that.gender = parseInt(options.gender) === 1 ? "男" :'女'
			// that.headUrl = JSON.parse(options.headUrl)
		},
		methods: {
			goBack(){
				uni.navigateBack({})
			},
			// 用户昵称
			inputChange(e){
				this.nickname = e.detail.value
			},
			// 性别
			selectOne(options) {
			  this.gender = options.label
				// console.log("性别:", this.gender)
			},
			// 上传头像
			uploadImag(){
				const that = this
				uni.chooseImage({
				    count: 1,
				    sizeType: ['album','camera'],
				    success: function(res) {
								const formData = res.tempFilePaths
								if(res.tempFiles[0].size > that.Size){
										wx.showModal({
											content: '上传图片不能大于2M!',
											showCancel: false,
										});
										return false;
								}
								uni.uploadFile({
									url: process.env.VUE_APP_BASE_API + '/file/uploadFile',
									filePath: formData[0],
									// header:{ 'Content-Type': 'application/x-www-form-urlencoded'},
									method:'post',
									name: 'file',
									formData: {
										useDay: 1,
										path: 1
									},
									success: (res) => {
										const data = JSON.parse(res.data)
										that.headUrl = data.data.fileUrl
									}
								})	
				    }
				  });
			 },
			 // 保存
			 submit() {
			 	if(this.nickname !== ''){
			 		const params={
			 			nickname:this.nickname,
			 			gender:this.gender === "男" ? 1 : 0,
			 			headUrl:this.headUrl
			 		}
			 		// console.log('form发生了submit事件，携带数据为：', params)
			 		updateMember(params).then(res => {
						 uni.showToast({
						   title:"修改成功",
							 icon:"none"
						 })
			 			 uni.reLaunch({
			 			    url: '/pages/me/me'
			 			 })
			 		})
			 	}else{
			 		uni.showToast({
			 		   title:"用户昵称不能为空",
			 			 icon:"none"
			 		 })
			 	}     
			 },
		}
	}
</script>

<style lang="scss" scoped>
.header{
	height: calc(100vh - 0rpx);
	background: #f9f9f9;
	/deep/ .header-button{
	    background-color: #f8f8f8;
	    margin: 0 12px;
			height: 112rpx;
			line-height: 112rpx;
	    border: none;
	    background: #795C98;
	    color: #FFFFFF;
			position: fixed;
			width: 702rpx;
			bottom: 70rpx;
			font-size: 36rpx;
	}
	.header-set{
    background: #fff;
		margin: 24rpx 24rpx 0 24rpx;
		border-radius: 16rpx;
	}
	.top-box{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48rpx 0 48rpx 0;
		.top-img{
			width: 240rpx;
			height: 240rpx;
			border-radius: 50%;
			overflow: hidden;
			border: 8rpx solid #ffffff;
			box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.10); 
			image{
				display: block;
				min-width: 100%;
				width: 100%;
				height: 100%;
			}
		}
		.top-txt{
			font-size: 30rpx;
			line-height: 48rpx;
			padding-top: 24rpx;
			color: rgba(51,51,51,0.5);
		}
	}
	.set-tit{
		background: #ccc;
		padding: 0 24rpx;
		text-align: center;
		.portrait{
			width: 240rpx;
			height: 240rpx;
			border-radius: 50%;
			border: 8rpx solid #ffffff;
			margin: 48rpx 0 24rpx 0;
			box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.10); 
			object-fit: cover;
			overflow: hidden;
		}
		p{
			font-size: 36rpx;
			font-weight: 500;
			margin-bottom: 24rpx;
			color: #333333;
		}
	}
	.list{
		display: flex;
		height: 96rpx;
		margin: 0 24rpx;
		line-height: 96rpx;
		font-size: 28rpx;
		color: #333333;
		//background-color: #cccccc;
		.list-name{
			// background: red;
			width: 150rpx;
			text-align: left;
		}
		.list-txt{
			//background: red;
			margin-left: 24rpx;
			width: 500rpx;
			text-align: left;
			input{
				height: 48rpx;
				line-height: 48rpx;
				margin-top: 24rpx;
				color: rgba(51,51,51,0.5);
				//border: 1rpx solid red;
			}
		}
	}
}
</style>
