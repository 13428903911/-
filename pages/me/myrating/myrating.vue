<template>
	<view class="myrating-contion">
		<navbar :title="title" @goBack="goBack"></navbar>
		<!-- tabs选项卡 -->
		<view class="tabs" :style="{'margin-top':bottom + 'px'}">
			<ms-tabs class="tabs-mzy" :list="list" v-model="active" itemColor='#795C98' lineColor='#795C98'	@input="handleChange" />
			<view class="select" v-if="active === 1">
				<view class="grade"  :class="flang ? 'altve' : ''" @click="clickLove">
					<text>评价等级</text>
					<uni-icons class="icons" type="arrowdown" size="14"></uni-icons>
					<uni-popup ref="LovePopup"  type="top" border-radius="16rpx" @change="popupChange">
						<view class="love-box">
							<view class="love" v-for="(item,index) in loveList" :key="index" :class="{'star':rSelect.indexOf(index)>-1}" @click="clickStar(index)">
								{{item}}
							</view>
						</view>
						<view class="btn-box">
								<view class="btn-group">
									<button type="button" class="btn-primary">确认</button>
									<button type="button" class="btn-normal">重置</button>
								</view>
						</view>
					</uni-popup>
				</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="myrating-main" :class="active == 1 ? 'rating-admin' : ''">
			<view class="myrating-main-box" @click.stop="ratingDetil">
				<!-- 列表头部头像-昵称-时间 -->
				<view class="myrating-main-imgTitle">
					<image src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=766358070,633479585&fm=11&gp=0.jpg" class="myrating-img"></image>
					<view>
						<view>討厭和人归類</view>
						<view style="margin-top:4rpx;color: rgba(51,51,51,0.50);font-weight: 400;">2019.10.16</view>
					</view>
				</view>
				<!--评论内容  -->
				<view class="myrating-center">
					当然好啦，国家大力扶植产业。
				</view>
				<!-- 图片 -->
				<view class="myrating-img-box" v-if="active !== 2">
					<view class="myrating-img-list">
						<image src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=766358070,633479585&fm=11&gp=0.jpg" class="myrating-img"></image>
					</view>
					<view class="myrating-img-list">
						<image src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=766358070,633479585&fm=11&gp=0.jpg" class="myrating-img"></image>
					</view>
					<view class="myrating-img-list">
						<image src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=766358070,633479585&fm=11&gp=0.jpg" class="myrating-img"></image>
					</view>
				</view>
				<!-- 商品列表 -->
				<view class="collect-list-box">
					<view class="goodsTitle">
						<text class="name">商品：2020秋季新款豆装瘦气修身西服主持套装2020秋季新款豆装瘦气修身西服主持套装</text>
					</view>
					<view class="describe">
						<view>
							<text>描述相符：</text>
							<span style="color: rgba(51,51,51,0.50);" v-if="active == 2">默认好评</span>
							<span v-else>
								<span class="iconfont" style="margin-left: 8rpx;color: #ed2648;font-size: 26rpx;">&#xe616;&#xe616;&#xe616;</span>
								<span class="iconfont" style="color: #C6C6C6;font-size: 26rpx;">&#xe616;&#xe616;</span>
							</span>
						</view>
						<view class="reply" @click="clickReply">回复</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 回复的弹窗 -->
		<uni-popup ref="popup"  type="bottom" border-radius="16rpx" @change="popupChange">
			<view class="popup-box">
				<view class="popup-title">
					<view @click="$refs.popup.close()">取消</view>
					<view>回复评价</view>
					<view class="reply">回复</view>
				</view>
				<view class="popup-main">
					<textarea
						v-if="modalShow "
						class="uni-textarea" 
						maxlength="200" 
						v-model="formData.name"
						placeholder="请输入回复内容" 
						placeholder-class="placeholder"
					/>
					<view class="footer">
						<view>用户评价内容：</view>
						<view class="name">衣服非常好看！价格又实惠上身效果非常好门店服务态度很棒，下次还会回购！</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import navbar from '@/components/nav-bar/nav-bar.vue'
	export default {
		components:{navbar},
		data() {
			return {
				modalShow : false,
				rSelect: [],
				starIndex: '',
				starStatus: false,
				flang: false,
				loveList:["一星","二星","三星","四星","五星"],
				list:[{title:"全部"}, {title:"用户评价"}, {title:"默认好评"}],
				bottom:uni.getMenuButtonBoundingClientRect().bottom + 4,
				title:"评价管理",
				imgObs: process.env.VUE_APP_OBS_FILE_API,
				userInfo: {},
				collectData:{
					list: [
						{ id:1, text: '新疆长绒棉，女式文艺花朵印花T恤', collect: "近xx人收藏", prilce: '219.00', imgUrl: 'https://img13.360buyimg.com/babel/s320x320_jfs/t1/152107/9/4363/102864/5f9f91daE44173f04/5fbdd1f7b027eff2.jpg!cc_320x320.webp'},
						{ id:1, text: '新疆长绒棉，女式文艺花朵印花T恤', collect: "近xx人收藏", prilce: '219.00', imgUrl: 'https://img13.360buyimg.com/babel/s320x320_jfs/t1/152107/9/4363/102864/5f9f91daE44173f04/5fbdd1f7b027eff2.jpg!cc_320x320.webp'}
					]
				},
				sliders:{width:'auto'},
				active: 0, // tab选中的值
				carinfos:[{ label: '全部评价', value: 1 }, { label: '有图评价',  value: 2}],
			}
		},
		onShow() {
			const vm = this
			vm.userInfo = uni.getStorageSync('UserInfo')
			console.log("个人信息:",vm.userInfo)
			console.log("个人信息电话:",vm.userInfo.telephone)
		},
		methods:{
			// 详情
			ratingDetil() {
				uni.navigateTo({
					 url: './addappraise'
				})
			},
			// 回复
			clickReply() {
				this.$refs.popup.open()
				setTimeout(() => {
				this.modalShow = true;
				}, 50)
			},
			// tab选项卡事件
			handleChange(e) {
				const vm = this
				vm.active = e
			},
			// 动态评价样式
			clickStar(index) {
				const vm = this
				const arrIndex = vm.rSelect.indexOf(index)
				 if(arrIndex > -1){
					vm.rSelect.splice(arrIndex,1);//取消高亮
				}else{
					 vm.rSelect.push(index);
				}
			},
			// 打开评价等级弹窗
			clickLove() {
				const vm = this
				vm.flang = true
				vm.$refs.LovePopup.open()
			},
			// 弹窗change事件
			popupChange(e) {
				const vm = this
				if(!e.show){
					vm.flang = false
					// vm.$refs.popup.close()
				}
			},
			// 返回上一页
			goBack() {
				uni.switchTab({
					url:'../me'
				})
			},
			// 跳转评价
			appraise() {
				uni.navigateTo({
				   url: './addappraise',
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 公共样式
	 .myrating-main, .myrating-main-box{
		padding: 24rpx;
	}
	.myrating-contion {
		background-color: #FFFFFF;
		font-size: 30rpx;
		.tabs {
			margin-top:119rpx;
			width: 100%;
			position: fixed;
			top:0;
			left:0;
			right: 0;
			z-index: 999;
			font-size: 30rpx;
			color: #333333;
			background-color: #FFFFFF;
			box-shadow: 0 5px 10px -8px #ccc inset;
			.select{
				.grade{
					margin: 16rpx 32rpx;
					width: 208rpx;
					height: 64rpx;
					background-color:  #f9f9f9;
					border-radius: 32rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					.icons{
						margin-left: 8rpx;
					}
					/deep/ .uni-popup{
						position: absolute;
						top:-223rpx !important;
						.vue-ref{
							margin-top:158px;
						}
					}
				
				}
				.altve{
					border-radius: 32rpx 32rpx 0px 0px !important;
					margin-bottom: 0 !important;
					color: #795c98 !important;
				}
				.love-box{
					height: 152rpx;
					background-color: #f9f9f9;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 32rpx;
					.love{
						width: 108rpx;
						height: 64rpx;
						line-height: 64rpx;
						color: rgba(51,51,51,0.50);
						text-align: center;
						border: 1rpx solid rgba(51,51,51,0.50);
						border-radius: 33rpx;
					}
					.star{
						background: #f5f2f7;
						border: 1rpx solid #795c98 !important;
						color: #795c98 !important;
					}
				}
				.btn-box{
					padding: 24rpx;
					background-color: #FFFFFF;
					.btn-group {
						overflow: hidden;
						button {
							float: right;
							padding: 11rpx 24rpx;
							border-radius: 60rpx;
							font-size: 30rpx;
							color: #fff;
							line-height: 42rpx;
							margin-left: 16rpx;
						}
						.btn-normal {
							// padding: 8rpx 22rpx;
							color: #333333;
							background-color: #fff;
							box-shadow: 0 0 0 2rpx rgba(51,51,51,0.5) inset;
						}
						.btn-primary {
							background-color: #795c98;
						}
					}
				}
			}
		}
		/deep/ .tab {
			height: 84rpx !important;
		}
		/deep/ .tab__item {
			line-height: 84rpx !important;
		}
		/deep/ .tabBlock .tab__item-title {
			font-weight: 400 !important;
			margin: 0 10rpx !important;
		}
		/deep/ .mm__tab:nth-child(5) {
			margin: 0rpx 24rpx 0rpx 24rpx !important;
		}
		.myrating-heaerd{
			.myrating-rating{
				padding: 11rpx 24rpx;
				border: 2rpx solid rgba(51,51,51,0.26);
				border-radius: 34rpx;
			}
		}
		// 列表样式
		.myrating-main{
			margin-top: 82rpx;
			height: 100vh;
			background: #f9f9f9;
			.myrating-main-box{
				border-radius: 16rpx;
				background: #ffffff;
				.myrating-main-imgTitle{
					display: flex;
					align-items: center;
					.myrating-img{
						width:96rpx;
						height:96rpx;
						border-radius: 60rpx;
						margin-right: 24rpx;
					}
				}
				.myrating-center{
					padding-top:24rpx;
					font-weight: 400;
				}
				.myrating-img-box{
					padding-top: 24rpx;
					display: flex;
					.myrating-img-list{
						width: 200rpx;
						height: 200rpx;
						margin-right: 27rpx;
						.myrating-img{
							width: 100%;
							height: 100%;
							border-radius: 8rpx;
						}
					}
					// 最后一个myrating-img-list去掉右外边距
					.myrating-img-list:last-of-type{
						margin-right: 0;
					}
				}
			}
		}
		.rating-admin{
			margin-top: 170rpx !important;
		}
	}
	// 商品样式
	.collect-list-box{
		font-size: 26rpx;
		.goodsTitle{
			padding:24rpx 0;
			height: 37rpx;
			opacity: 1;
			color: rgba(51,51,51,0.50);
			line-height: 37rpx;
			.name{
				margin-left: 8rpx;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
			}
		}
		.describe{
			display:flex;
			justify-content: space-between;
			align-items: center;
			.reply{
				width: 40px;
				height: 20px;
				opacity: 1;
				border: 0.5px solid #795c98;
				border-radius: 16px;
				text-align: center;
				line-height: 20px;
				color: #795c98;
				font-size: 24rpx;
			}
		}
	}
	// 弹出层样式
	.popup-box{
		background: #ffffff;
		border-radius: 16rpx 16rpx 0px 0px;
		font-size: 26rpx;
		.popup-title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 36rpx;
			padding: 32rpx 24rpx;
			border-bottom: 1rpx solid #EEEEEE;
			.reply{
				color: #795c98;
			}
		}
		.popup-main{
			padding: 24rpx 24rpx 56rpx 24rpx;
			// 多行输入框
				.uni-textarea {
					width: 100%;
					padding: 24rpx;
					height: 219rpx;
					background: #f9f9f9;
					border-radius: 4rpx;
					box-sizing: border-box;
					/deep/ .placeholder {
						font-size: 26rpx;
						color: rgba(51, 51, 51, 0.26);
					}
				}
				.footer{
					margin-top: 24rpx;
					display: flex;
					.name{
						width: 512rpx;
						margin-left: 8rpx;
						color: rgba(51,51,51,0.50);
						overflow: hidden;
					}
				}
			}
		}
</style>
