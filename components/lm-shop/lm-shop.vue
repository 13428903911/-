<template>
	<view style="padding: 0 20rpx;">
		<view :class="showlist?'waterfall-container':'con'" style="width: 100%;height: 100%;">
			<view @longpress="longclick(item)" :style="{'border-radius':lradius + 'rpx'}" :class="showlist?'waterfall-item shop':'shop shopwidth'" v-for="(item,index) in list" :key='index'>
				<view  @click="navto(item)">
					<image :src="item.img"></image>
					<view class="name font_1">{{item.name}}</view>
					<view :class="showlist?'introduction font_3':'introduction font_1'">{{item.intion}}</view>
					<view style="display: flex;align-items: center;margin-top: 10rpx;" v-if="item.newmoney">
						<view class="newmoney">¥{{item.newmoney}}</view>
						<view class="noldmoney">¥{{item.oldmoney}}</view>
					</view>
				</view>
				<view v-if="status" style="display: flex;align-items: center;justify-content:space-between;margin: 10rpx 0;">
					<!-- 写入标签 -->
					<view class="tab">{{item.tab}}</view>
					<view v-if="showcar" class="addbutton" @click="add(item)">加入购物车</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			list:{
				type:Array,
				default:()=>{
					return []
				},
				required:true,
				// 必填list列表
			},
			status:{
				type:Boolean,
				default:true,
				// 是否显示标签栏与购物车
			},
			navurl:{
				type:String,
				default:()=>{
					return ''
				},
				// 代为跳转url
			},
			showcar:{
				type:Boolean,
				default:()=>{
					return true
				},
				// 是否显示购物车按钮
			},
			showlist:{
				type:Boolean,
				default:()=>{
					return true
				},
				// 是否显示瀑布流
			},
			lradius:{
				type:Number,
				default:()=>{
					return 40
				},
				// 模块得圆角
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			navto(item){
				if(this.navurl == ''){
					return
					// 如果为空则不代替跳转
				}else{
					console.log(this.navurl,item.id)
					console.log('跳转到'+ this.navurl)
					uni.navigateTo({
						url:this.navurl + '?id=' + item.id
					})
				}
			},
			add(item){
				this.$emit('addcar',item)
				// 购物车回调 @addcar
			},
			longclick(item){
				this.$emit('long',item)
			}
		}
	}
</script>

<style>
	.font_1{
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
	}
	.font_2{
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2;
	}
	.font_3{
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:3;
	}
	.shopwidth{
		width: 43%;
	}
	.con{
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.addbutton{
		background-color: red;
		color: white;
		border-radius: 50rpx;
		padding: 2rpx 14rpx;
		z-index: 99;
	}
	.tab{
		background-color: rgba(141, 198, 63, 1);
		color: white;
		padding: 0 10rpx;
		border-radius: 50rpx;
	}
	.noldmoney{
		font-size: 20rpx;
		text-decoration: line-through;
		color: #999999;
		margin-left: 10rpx;
	}
	.newmoney{
		color: #8DC63F;
		font-size: 30rpx;
	}
	.introduction{
		font-size: 20rpx;
		color: #333333;
		line-height: 50rpx;
	}
	.name{
		font-size: 30rpx;
		line-height: 32px;
		color: #333333;
		margin-top: 12rpx;
	}
	image{
		width: 268rpx;
		height: 80rpx;
		display: block;
		margin: 0 auto;
		height: 268rpx;
		padding-top: 20rpx;
	}
	.shop{
		background-color: #FFFFFF;
		border-radius: 40rpx;
		margin-bottom: 20rpx;
		padding: 0 20rpx;
		padding-bottom: 20rpx;
	}
	.waterfall-container {    
	     /*分几列*/
	    column-count: 2;
	 }  
	 .waterfall-item {    
	     /*不留白，不知道什么意思可以取消这个样式试试*/
		
	    break-inside: avoid;
	 }
</style>
