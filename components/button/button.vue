<template>
	<view class="btn-group">
		<button 
			type="button" 
			:class="{'btn-primary': type === 'primary', 'btn-normal': type === '', 'btn-purple': type==='purple'}" 
			:style="{'font-size': size+'rpx'}"
			@click="StoresSelling"
		>
			{{text}}
		</button>
	</view>
</template>

<script>
	export default {
		props: {
			size: {
				type: Number,
				default: 30
			},
			type: {
				type: String,
				default: ''
			},
			text: {
				type: String
			}
		},
		data() {
			return {}
		},
		methods:{
			StoresSelling() {
				this.$emit('btnClick')
			},
		}
	}
</script>

<style lang="scss" scoped>
	// 按钮样式
	.btn-group {
		width: 100%;
	
		button {
			// padding: 11rpx 24rpx;
			background-color: rgba(255,255,255,.36);
			min-width: 144rpx;
			height: 64rpx;
			border-radius: 33rpx;
			color: #fff;
			line-height: 64rpx;
			text-align: center;
		}
	
		.btn-normal {
			// padding: 8rpx 22rpx;
			color: #333333;
			// background-color: #fff;
			box-shadow: 0 0 0 2rpx rgba(51, 51, 51, 0.5) inset;
		}
		.btn-purple{
			color: #795c98;
	
			box-shadow: 0 0 0 2rpx #795c98 inset;
		}
		.btn-primary {
			background-color: #795c98;
		}
	}
</style>
