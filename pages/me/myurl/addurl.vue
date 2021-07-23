<template>
	<view class="myurl-contion">
		<view class="myurl-form"> 
			<uni-forms ref="form" :value="formData">
					<uni-forms-item label="收货人" name="name">
							<uni-easyinput type="text" v-model="formData.consName" placeholder="名 字" placeholder-style="color: rgba(51,51,51,0.26)"/>
					</uni-forms-item>
					<uni-forms-item label="手机号码" name="email">
							<uni-easyinput type="number" v-model="formData.consPhone" placeholder="手机号" placeholder-style="color: rgba(51,51,51,0.26)"/>
					</uni-forms-item>
					<uni-forms-item label="选择地区" name="name">
						<picker mode="region" @change="bindPickerChange" :value="pickerData">
								<view v-if="!text" class="picker-text" style="line-height: 74rpx;padding-left: 20rpx;color:rgba(51,51,51,0.26);">省、市、区</view>
								<view v-else style="line-height: 74rpx;padding-left:20rpx;">{{text}}</view>
						</picker>
					</uni-forms-item>
					<uni-forms-item label="详细地址" name="name">
							<uni-easyinput type="text" v-model="formData.address" placeholder="小区楼栋/乡村名称" placeholder-style="color: rgba(51,51,51,0.26)"/>
					</uni-forms-item> 
			</uni-forms>
		</view>
		<view class="check">
			<checkbox-group @change="handleChange">
					<label>
							<checkbox :checked="check"/>
					</label>
	    </checkbox-group>
			<view class="check-txt">设为默认</view>
		</view>
		<view class="addWx" @click="getAddress">
			<view class="wx-box">
				<view class="iconfont icon">&#xe620;</view>
				<view class="txt">获取微信收货地址</view>
				<view class="iconfont right">&#xe61a;</view>
			</view>
		</view>
		<view class="collect-btn">
			  <button :disabled="loading" type="warn" @click="showInterstitialAd">保 存</button>
		</view>
	</view>
</template>

<script>
	import { addMyUrl, updateAddress, getConsByConsId , addAddressByWord} from '@/utils/network/api.js'
	export default {
		data() {
			return {
				check:false,
				regPhone: /^[1][3-9][0-9]{9}$/, // 手机正则
				optionItem:{}, // 当前数据
				text:'',
				pickerData:[],
				formData:{
					consName:'', // 收货人姓名
					consPhone:'', // 收货人手机
					province:'', // 省编码
					city:'', // 市编码
					area:'', // 区编码
					address:'' ,// 地址
					consId:'', // 收货人id
					isDefault:'' // 是否默认地址
				}
			}
		},
		onLoad(options) {
			const vm = this
			if(options.id) {
				getConsByConsId({ consId: options.id }).then(res => {
					// 回显
					vm.formData.consName = res.data.name // 名字
					vm.formData.consPhone = res.data.phone // 手机
					vm.formData.province = res.data.province // 省编码
					vm.formData.city = res.data.city // 市编码
					vm.formData.area = res.data.district // 区编码
					vm.formData.address = res.data.address // 详细地址
					vm.formData.consId = res.data.consId // 收货人id
					vm.formData.isDefault = res.data.isDefault // 是否默认
					vm.text = res.data.fullAddress // 回显省市区选择
					if(vm.formData.isDefault === 1){
						vm.check = true
					}else{
						vm.check = false
					}
					// vm.check = vm.formData.isDefault === 1 ? false : true
				})
				
			}
		},
		methods: {
			getAddress(){
				const that = this
				wx.chooseAddress({
				  success (res) {
				    // console.log("我的地址：",res)
						const params = {
							consName :res.userName, // 收货人姓名
							consPhone:res.telNumber, // 收货人电话
							provinceName:res.provinceName, // 省
							cityName:res.cityName, // 市
							areaName:res.countyName, // 区
							address:res.detailInfo, // 详细地址
						}
						addAddressByWord(params).then(res => {
							uni.navigateBack({
								delta: 1
							})
							uni.showToast({title: "新增成功", icon:'none'})
						})
				  }
				})
			},
			// 
			handleChange(e){
				const that = this
				that.check = that.check === false ? true : false
				if(that.check === false){
					that.formData.isDefault = 0
				}else{
					that.formData.isDefault = 1
				}
				// console.log("默认:",that.formData.isDefault)
			},
			// 省市区事件
			bindPickerChange(val) {
				const vm = this
				vm.text = val.detail.value.join(',')
				console.log()
				vm.formData.province = val.detail.code[0]
				vm.formData.city = val.detail.code[1]
				vm.formData.area = val.detail.code[2]
				console.log(vm.formData)
			},
			// 保存地址
			showInterstitialAd() {
				const vm = this
				 if (!this.validForm()) return
				 // 编辑地址
				 if(vm.formData.consId) {
					 updateAddress(vm.formData).then(res => {
						 uni.navigateBack({
						 	delta: 1
						 })
						  uni.showToast({title: "修改成功", icon:'none'})
					 })
				 }else {
					 // 新增地址
					 addMyUrl(vm.formData).then(res => {
					 	 uni.navigateBack({
					 	 	delta: 1
					 	 })
					 	 uni.showToast({title: "新增成功", icon:'none'})
					 })
				 }
			},
			  validForm() {
			      const vm = this
			      if (!vm.formData.consName) {
							uni.showToast({title: "请输入收货人姓名!", icon:'none'})
			        return false
			      }
			      if (!vm.formData.consPhone) {
			        uni.showToast({title: "请输入收货人手机!", icon:'none'})
			        return false
			      }
						if (vm.formData.consPhone !== '' && !vm.regPhone.test(vm.formData.consPhone)) {
							uni.showToast({ title: '手机格式不正确', icon:'none'})
							return false
						}
			      if (!vm.text) {
			        uni.showToast({title: "请选择地区!", icon:'none'})
			        return false
			      }
			      if (!vm.formData.address) {
			       uni.showToast({title: "请输入收货人详细地址!", icon:'none'})
			        return false
			      }
			      return true
			    }
		}
	}
</script>

<style lang="scss" scoped>
	
	// .myurl-contion /deep/ .uni-forms-item__label .label-text{
	// 	font-size: 30rpx;
	// }
	// .myurl-contion /deep/ .uni-easyinput__content-input{
	// 	font-size: 34rpx;
	// }
	checkbox /deep/ .wx-checkbox-input.wx-checkbox-input-checked{
	  width: 32rpx;
	  height: 32rpx;
	  background:#795C98;
	  border: 1rpx solid #795C98;
	  border-radius: 50%;
	  color: #FFFFFF;
	 }
	 checkbox /deep/ .wx-checkbox-input{
	  width: 32rpx;
	  height: 32rpx;
	  border: 1rpx solid rgba(51,51,51,.2);
	  border-radius: 50%;
	  margin-bottom: 10rpx;
	 }
	 // √样式
	 checkbox /deep/ .wx-checkbox-input.wx-checkbox-input-checked::before{
	  width: 25rpx;
	  height: 25rpx;  
	  line-height: 25rpx;
	  text-align: center;
	  font-size: 25rpx;
	  color: #fff;
	  background: transparent;
	  transform: translate(-50%, -50%) scale(1);
	  -webkit-transform: translate(-50%, -50%) scale(1);
	 }
	.myurl-contion {
		height: 100vh;
		background-color: #f9f9f9;
		box-shadow: 0px 2rpx 8rpx -2rpx rgba(0,0,0,0.10) inset;
		font-size: 34rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		padding:24rpx;
		.myurl-form{
			padding: 0 24rpx 0rpx 24rpx;
			background-color: #FFFFFF;
			border-radius: 16rpx;
			.picker-text{
				// 
			}
		}
		
	}
	.check{
		
		display: flex;
		padding-top: 24rpx;
		.check-txt{
			padding-left: 16rpx;
			padding-top: 4rpx;
			font-size: 28rpx;
			text-align: center;
		  
		}
	}
	.addWx{
		margin-top: 24rpx;
		.wx-box{
			display: flex;
			position: relative;
			padding: 24rpx;
			background: #ffffff;
			border-radius: 16rpx;
			.icon{
				line-height: 48rpx;
				font-size: 48rpx;
				color: rgb(72, 189, 28);
			}
			.txt{
				font-size: 30rpx;
				line-height: 48rpx;
				padding-left: 16rpx;
			}
			.right{
				position: absolute;
				right: 12rpx;
				color: #CCCCCC;
				font-size: 48rpx;
				line-height: 48rpx;
			}
		}
	}
	// 按钮样式
	.collect-btn{
		width: 94%;
		position:fixed;;
		bottom: 70rpx;
		button{
			height: 112rpx;
			line-height: 112rpx;
			background: #795C98;
		}
	}
	// 修改表单样式
	/deep/ .uni-forms-item__inner:last-of-type {
		// border: none !important;
	}
	/deep/ .uni-forms-item__inner{
		border-bottom: 1px solid #f9f9f9;
		padding: 12rpx 0rpx !important;
	}
	/deep/ .is-input-border{
		border: none !important;
	}
</style>
