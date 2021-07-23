<template>
	<view class="container">
		<!-- <uni-nav-bar left-icon="back"  :title="title" fixed statusBar color="rgba(0,0,0,0.85)" @clickLeft="goBack"></uni-nav-bar> -->
		<uni-nav-bar fixed statusBar :shadow="shadow">
			<view v-if="showBack" slot="left" class="iconfont icon" @click="goBack">&#xe618;</view>
		  <view class="box">
				<view class="box-txt">
					{{title}}
				</view>
			</view>
		</uni-nav-bar>
	</view>
</template>
<script>
	export default {
		props:{
			title:{ // 页面名称
				type:String,
				default:''
			},
			shadow:{ // 是否展示阴影
				type:Boolean,
				default:true
			},
			showBack:{ // 是否展示返回上一页
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			goBack(){
				this.$emit('goBack')
			}
		}
	}
</script>

<style lang="scss" scoped>
 .container {
	  .icon{
			font-size:48rpx ;
		}
		.box{
			width: 100%;
			// background: #ccc;
			position: relative;
			right: 18rpx;
			.box-txt{
				font-size: 34rpx;
				line-height: 48rpx;
				font-weight: 500;
				color: rgba(0,0,0,0.85);
				text-align: center;
			}
		}
	}
</style>
