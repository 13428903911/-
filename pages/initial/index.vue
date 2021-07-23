<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onShow(){
			if(uni.getStorageSync('authorization')){
				uni.reLaunch({
				   url: '/pages/home/home'
				})
			}else{
				uni.reLaunch({
				   url: '/pages/arthorize/index'
				})
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
