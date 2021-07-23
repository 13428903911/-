<template>
	<view class="goods">
		
			<!-- 左边商品 -->
			<view class="goods-box">
				<view class="goodsList" v-for="(item,index) in leftData" :data-id="item.id" @click.stop="goGoods(item.id)" :key="index">
					<view class="goodsImg"><image :src="imgObs + item.fileUrl" lazy-load="true" mode="widthFix"></image></view>

					<view class="goodsName">{{item.name}}</view>
					<view class="goodsPrice">￥{{item.tradePrice}}</view>
					<view class="goodsNum">
						<view class="goodsNumOne">
							已售{{item.sale !== null ? item.sale : '0'}}件
						</view>
						<view v-if="showSimi" class="goodsNumTwo" @click.stop="goSimi(item.tradePrice,item.fileUrl,item.id,item.name,item.secondCategoryId)" :data-price="item.tradePrice" :data-img="item.fileUrl" :data-id="item.id" :data-name="item.name" :data-upid="item.secondCategoryId">
							<view class="">
								找相似
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 右边商品 -->
			<view class="goods-box">
				<view class="goodsList" v-for="(item,index) in rightData" :data-id="item.id" @click.stop="goGoods(item.id)" :key="index">
					<view class="goodsImg"><image :src="imgObs + item.fileUrl" lazy-load="true" mode="widthFix"></image></view>

					<view class="goodsName">{{item.name}}</view>
					<view class="goodsPrice">￥{{item.tradePrice}}</view>
					<view class="goodsNum">
						<view class="goodsNumOne">
							已售{{item.sale !== null ? item.sale : '0'}}件
						</view>
						<view v-if="showSimi" class="goodsNumTwo" @click.stop="goSimi(item.tradePrice,item.fileUrl,item.id,item.name,item.secondCategoryId)" :data-price="item.tradePrice" :data-img="item.fileUrl" :data-id="item.id" :data-name="item.name" :data-upid="item.secondCategoryId">
							<view class="">
								找相似
							</view>
						</view>
					</view>
				</view>
			</view>
	</view>
	
</template>

<script>
	export default {
		name:'goods-card',
		props:{
			leftData:{ // 左边商品
				type: Array,
				default:[]
			},
			rightData:{ // 右边商品
				type: Array,
				default:[]
			},
			showSimi:{ // 是否展示找相似
				type: Boolean,
				default:true
			}
		},
		data() {
			return {
					imgObs: process.env.VUE_APP_OBS_FILE_API,
			}
		},
		methods: {
			// 商品详情
			goGoods(id){
				this.$emit('goGoods',id)
			},
			// 找相似
			goSimi(tradePrice,fileUrl,id,name,secondCategoryId){
				this.$emit('goSimi',tradePrice,fileUrl,id,name,secondCategoryId)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods{
		width: 100%;
		padding: 0 12rpx;
		column-count: 2;
		column-gap: 0;
		display: flex;
		box-sizing: border-box;
		.goods-box{
			width: 50%;
			padding: 0 12rpx;
			box-sizing: border-box;
			.goodsList{
				width: 100%;
				margin-bottom: 16rpx;
				padding-bottom: 26rpx;
				background: #ffffff;
				// border: 1rpx solid rgba(238,238,238,1);
				border-radius: 16rpx;
				break-inside: avoid;
				box-sizing: border-box;
				.goodsImg{
					width: 100%;

					min-height: 300rpx;
					// overflow: hidden;
					background: #f7f7f7;
					// height: 351rpx;
					// overflow: hidden;

					border-radius: 16rpx 16rpx 0px 0px;
					box-sizing: border-box;
					image{
						display: block;
						max-width: 100%;
						width: 100%;
						height: 100%;
						overflow: hidden;
						border-radius: 16rpx 16rpx 0px 0px;
					}
				}
				.goodsName{
					font-size: 26rpx;
					margin: 24rpx 0 0 24rpx;
					padding-right: 24rpx;
					text-align: justify;
					text-align-last: left;
					color: #333333;
					line-height: 42rpx;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.goodsPrice{
					line-height: 48rpx;
					padding: 0 24rpx;
					margin: 25rpx 0 26rpx 0;
					font-size: 34rpx;
					font-weight: bold;
					text-align: left;
					color: #333333;
					
				}
				.goodsNum{
					display: flex;
					justify-content: space-between;
					line-height:36rpx;
					padding: 0 24rpx;
					.goodsNumOne{
						width: 185rpx;
						line-height: 37rpx;
						font-size: 26rpx;
						text-align: left;
						color: rgba(51,51,51,0.50)
					}
					.goodsNumTwo{
						padding: 1rpx 9rpx;
						border: 1rpx solid rgba(0,0,0,0.26);
						border-radius: 9rpx;
						line-height: 34rpx;
						text-align: center;
						font-size: 24rpx;
						color: rgba(0,0,0,0.26);
					}
				}
			}	
		}
	}
	
</style>
