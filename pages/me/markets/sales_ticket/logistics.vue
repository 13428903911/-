<template>
	<view class="contont">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar shadow>
		    <view slot="left">
				<view class="search">
					<view class="iconfont" @click="clickBack">&#xe618;</view>
					<text>物流公司</text>
				</view>
			</view>
		</uni-nav-bar>
		<view class="company" v-for="(item,index) in company" :key="index" @click="logidtics(index,item)">
		   <view class="company-kd">
		    {{item.name}}
				<view style="width: 48rpx;height: 48rpx;" v-if="flag === index">
					<uni-icons type="checkmarkempty" size="25" color="#795C98"></uni-icons>
				</view>
		   </view>
		</view>
	</view>
</template>

<script>
 export default {
  data() {
   return {
    flag: 0,
    company:[
     {name:'顺丰快递', code: 1101},
     {name:'申通快递', code: 1102},
     {name:'天天快递', code: 1103},
     {name:'快递100', code: 1104},
     {name:'雅虎快递', code: 1105}
    ]
   }
  },
  methods: {
		clickBack() {
			uni.navigateBack({})
		},
   logidtics(index,name) {
			const vm =this
			vm.flag = index
			console.log("选择物流公司:",name)
			const pages = getCurrentPages()
			const prevPage = pages[pages.length - 2]; //上一个页面
			prevPage.setData({ //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
			userdata: name
			})
			uni.navigateBack({ delta: 1 })
   }
  }
 }
</script>

<style lang="scss" scoped>
	*{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	.contont{
		font-weight: 400;
		.search{
			background-color: #ffffff;
			display: flex;
			width: 696rpx;
			position: relative;
			left: 0rpx;
			bottom: 0rpx;
			.iconfont{
				font-size: 48rpx;
			}
			text{
				height: 48rpx;
				opacity: 1;
				font-size: 34rpx;
				font-weight: 500;
				text-align: center;
				color: rgba(0,0,0,0.85);
				line-height: 48rpx;
				margin: auto;
			}
		}
		 .company{
		  margin: 24rpx;
		  background: #FFFFFF;
		  border-radius: 16rpx;
		  .company-kd{
				height: 96rpx;
		   padding: 0 24rpx;
		   font-size: 30rpx;
		   font-weight: 400;
		   display: flex;
		   justify-content: space-between;
		   align-items: center;
		   margin: 10rpx 0;
		   image{
		    width: 40rpx;
		    height: 40rpx;
		    font-size: 40rpx;
		    display: none;
		   }
		  }
		  .company-kd image:nth-child(1) {
		   display: block;
		  }
		 }
		
	}
</style>
