<template>
	<view class="contont">
		<!-- 自定义导航 -->
		<uni-nav-bar fixed statusBar shadow>
			<view slot="left">
				<view class="search">
					<view class="iconfont" @click="clickBack">&#xe618;</view>
					<text class="bold">其他商品编辑</text>
				</view>
			</view>
		</uni-nav-bar>
		<view class="add-goods-main">
			<!-- 商品标题 -->
			<view class="goods-title">
				<view>商品标题</view>
				<view class="textarea-num">
					<textarea class="uni-textarea" maxlength="60" @input="submit" v-model="formData.name"
						:placeholder="placeholder" placeholder-class="placeholder" />
					<view class="num"><text>{{remnant}}</text>/60</view>
				</view>
			</view>
			<!-- 商品图片 -->
			<view class="goods-title" style="margin: 16rpx 0;">
				<view>商品图片</view>
					<view class="file-picker">
						<view v-if="goodsImgList.length < 5" class="file-upload" @click="uploadImag">
							<span class="iconfont">&#xe62e;</span>
							<view class="title">上传照片</view>
						</view>
						<view class="file-upload-img" v-for="(item,index) in goodsImgList" :key="index">					
							<image :src="imgObs + item" class="img" @click="imgPvm(index)" mode="aspectFill"></image>					
							<uni-icons type="clear" size="20" class="icons" @click.stop="clearImg(index)"></uni-icons>
						</view>
					</view>
			</view>
			<!-- 类目 -->
			<view class="goods-class" @click="goodsClass">
				<view>类目</view>
				<view class="class-icon">
					<text>{{className}}</text>
					<i class="iconfont">&#xe61a;</i>
				</view>
			</view>
			<!-- 运费 -->
			<view class="goods-class">
				<view>运费</view>
				<view class="class-icon">
					<text class="Pinkage">包邮</text>
				</view>
			</view>
			<!-- 规格 -->
			<view class="goods-specification">
				<view class="goods-size" @click="selectSku">
					<view>规格</view>
					<view class="class-icon">
						<i class="iconfont">&#xe61a;</i>
					</view>
				</view>
				<!-- sku列表 -->
				<view class="sku-list" v-for="(sku,index) in formData.skuList" :key="index">
					<view class="sku-switch">
						<view class="sku-title bold">规格{{index+1}}</view>
						<view class="switch">
						<evan-switch 
							v-if="goodsId && sku.id"
							v-model="sku.isShelves ? true : false"
							active-color="#795c98"
							inactive-color="#E9E9EA"
							size="20"
							@change="switch1Change($event,sku.id,index,sku.isShelves,sku.tradePrice)"
						>
							</evan-switch>
							<text style="color: #999;padding: 0 16rpx;"  v-if="formData.skuList.length !== 1" @click="deleteSku(index,sku.id)">删除</text>
						</view>
					</view>
					<!-- 尺码 -->
					<view class="sku-size">
						<view>
							<text>尺码:</text>
							<text class="sku-name">{{sku.sizeName}}</text>
							<text>颜色:</text>
							<text class="sku-name">{{sku.colorName}}</text>
						</view>
						<view class="retail-price">
							<text style="margin-right: 8rpx;">销售价:</text>
							<text>￥{{sku.tradePrice}}</text>
						</view>
					</view>
					<!-- 颜色 -->
					<view class="sku-size" style="padding:0">
						<view class="retail-price repertory">
							<text>库存:</text>
							<text class="sku-name">{{sku.qty}}</text>
						</view>
					</view>
				</view>
			</view>
		<!-- 商品详情 -->
		<view class="goods-title">
			<view>商品详情</view>
			<view class="file-picker">
				<view v-if="goodsDetailList.length < 25" class="file-upload" @click="uploadImagDetail">
					<span class="iconfont">&#xe62e;</span>
					<view class="title">上传照片</view>
				</view>
				<view class="file-upload-img" v-for="(item,index) in goodsDetailList" :key="index">					
					<image :src="imgObs + item" class="img" @click="imgDetail(index)" mode="aspectFill"></image>					
					<uni-icons type="clear" size="20" class="icons" @click.stop="clearDeliteImg(index)"></uni-icons>
				</view>
			</view>	
				
			</view>
		</view>
		<!-- 按钮 -->
		<view class="btn-group">
			<button type="button" class="btn-primary" @click="StoresSelling">上架售卖</button>
		</view>
		<!-- 规格-模态层弹窗 -->
			<uni-popup ref="popup" :mask-click="false" background-color="#ffffff" type="bottom" border-radius="16rpx"
			 @change="skuPopupChange" @touchmove.stop.prevent="moveHandle">
			 <view class="modal">
				 <view class="modal-header">
					 <view @click="skuClear">取消</view>
					 <view>云档口商品上架</view>
					 <view class="save" @click="skuSave">保存</view>
				 </view>
				 <view class="modeal-main">
					 <!-- sku列表 -->
					<view class="sku-list">
						<!-- <view class="sku-title bold">规格1</view> -->
						<!-- 尺码 -->
							<view class="sku-size">
								<text class="sku-name">尺码:</text>
								<picker @change="bindPickerChange" :value="sizeIndex" :range="sizeList" :range-key="'name'">
									<view class="sku-picker">
										<view v-if="!sizeIndex" class="picker-text" style="line-height: 74rpx;padding-left: 20rpx;color:rgba(51,51,51,0.26);">请选择</view>
										<view class="text">{{sizeList[sizeIndex].name}}</view>
										<i class="iconfont">&#xe61a;</i>
									</view>
								</picker>
							</view>
							<!-- 颜色 -->
							<view class="sku-size">
								<text class="sku-name">颜色:</text>
								<picker @change="colourChange" :value="colourIndex" :range="colourList" :range-key="'name'">
									<view class="sku-picker">
										<view v-if="!colourIndex" class="picker-text" style="line-height: 74rpx;padding-left: 20rpx;color:rgba(51,51,51,0.26);">请选择</view>
										<view class="text">{{colourList[colourIndex].name}}</view>
										<i class="iconfont">&#xe61a;</i>
									</view>
								</picker>
							</view>
							<!-- 销售价 -->
							<view class="sku-size">
								<text class="sku-name" style="width: 112rpx;margin-right: 20rpx;">销售价:</text>
								<input class="uni-input sales-price" v-model="skuParam.tradePrice" type="digit" @input="salesPrice" placeholder="输入销售价" placeholder-class/>
								<text>元</text>
							</view>
							<!-- 库存 -->
							<view class="sku-size" style="padding:0;">
								<text class="sku-name">库存:</text>
								<input class="uni-input sales-price" v-model="skuParam.qty" type="number" @input="qstInput" placeholder="输入库存" placeholder-class/>
								<text>件</text>
							</view>
							<!-- sku图片 -->
							<view class="file-picker" >
								<view class="file-upload" @click="skuUploadImag" v-if="!skuParam.imgUrl">
									<span class="iconfont">&#xe62e;</span>
									<view class="title">上传照片</view>
								</view>
								<view class="file-upload-img" v-else>
									<image class="img" :src="imgObs + skuParam.imgUrl" @click="skuImgPvm" mode="aspectFill"></image>
									<uni-icons type="clear" size="20" class="icons" @click.stop="skuClearImg"></uni-icons>
								</view>
							</view>
						</view>
					</view>
				</view>
			</uni-popup>
	</view>
</template>
<script>
	import { addGoods,selectListPage,getDoodsDetail,setSkuPrice  } from '@/utils/network/aftermarket.js'
	export default {
		data() {
			return {
				goodsDetailList: [],
				Size:2*1024*1024,//定义图片大小
				textareaStatus: true, // 隐藏富文本框
				isStatusList: [],
				switchStatus: false,
				skuList: [],
				goodsId: '',
				propertyId: '', // 属性数组id
				colourList: [], // 属性颜色数据
				sizeList: [], // 属性尺码数据
				sizeIndex: '', // 尺码v-model绑定
				colourIndex: '', // 颜色v-model绑定
				className: '', 
				formData: { // 商品新增与编辑
					id: '', // 商品id（没有时不传（为添加），有时要传（为修改））
					name: '', // 商品名称
					firstCategoryId: '', // 一级分类id
					secondCategoryId: '', // 二级分类id
					source: 2, // 商品来源（1为云档口商品，2为门店商品）
					imgUrl: '', // 商品封面图，取商品图片第一张
					isFreeShip: 1, // 是否包邮（1包邮，0不包邮）
					detailList: [], // 商品详情图片（小程序使用）
					isShelves: 1, // 是否上架：1上架，0下架
					deleteIds: '', // 删除skuId集合（英文逗号隔开）
					fileList:[], // 商品图片
					skuList: [] // 新增sku的数据
				},
				skuParam: { // sku新增参数
					sizeId: '', // 尺码id
					colorId: '', // 颜色id
					isShelves: 1, // 默认sku上架
					tradePrice: '', // 价格
					qty: '', // 库存
					imgUrl: '', // sku图片
					colorName: '' ,// 颜色属性名
					sizeName: '' // 尺码属性名
				}, 
				goodsImgList:[],
				imgObs: process.env.VUE_APP_OBS_FILE_API, // 图片obs
				uploadUrl: '',
				remnant: 0,
				placeholder: '填写商品标题',
				uploadImgUrl: ''
			}
		},
		onLoad(options) {
			const vm = this
			if (options.goodsId) {
				vm.goodsId = options.goodsId
				vm.getGoodsDetail(options.goodsId)
			}
		},
		onShow() {
			const vm = this
			uni.$on('update',function(data){
				const params = JSON.parse(JSON.stringify(data))
				vm.className = params.name
				vm.formData.firstCategoryId = params.parentId // 分类一级id赋值
				vm.formData.secondCategoryId = params.id // 分类二级id赋值
			})
		},
		methods: {
			// 禁止弹窗蒙层滚动
			moveHandle(){ 
				return false
			},
			// 库存input的事件
			qstInput() {
				const vm = this
				vm.$nextTick(() => {
					vm.skuParam.qty = (vm.skuParam.qty.match(/^([1-9]\d*|0)(\.\d*[1-9])?$/)||[''])[0]
				})	
			},
			// sku销售价input事件
			salesPrice() {
				const vm = this
				vm.$nextTick(() => {
					vm.skuParam.tradePrice = (vm.skuParam.tradePrice.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				})
			},
			// 商品图片预览
			imgPvm(index) {
				const vm = this
				const arr = vm.goodsImgList.map(item => vm.imgObs+item)
					uni.previewImage({
						urls: arr,
						current: index
					})
			},
			// 商品详情图片预览
			imgDetail(index) {
				const vm = this
				const list = vm.goodsDetailList.map(item => vm.imgObs+item)
				uni.previewImage({
					urls: list,
					current: index
				})
			},
			// sku预览
			skuImgPvm() {
				const vm = this
				uni.previewImage({
					urls:[vm.imgObs + vm.skuParam.imgUrl]
				})
			},
			// sku开关-上下架
			switch1Change(e,id,index,status,tradePrice) {
				const vm = this
				addGoods({
					id:vm.goodsId,
					skuList:[{
						isShelves: e ? 1 : 0,
						id: id,
						tradePrice
					}]
				}).then(res => {		
					vm.formData.skuList.forEach(item => {
						if(id == item.id) {
							vm.$nextTick(() => {
								item.isShelves = e ? 1 : 0
							})	
						}
					})							
					uni.showToast({title: (e ? "上" : "下")+"架成功!", icon:'none'})
				}).catch(() => {
            vm.$nextTick(() => {
            	status = e ? 1 : 0
            })	
          })
			},
			// 获取商品详情
			getGoodsDetail(id) {
				const vm = this
				getDoodsDetail({ id }).then(res => {
					// 回显数据
					const {data = {}} = res
					vm.formData.id = data.id
					vm.formData.name = data.name // 商品名字
					vm.formData.fileList = data.fileList // 商品图片赋值
					vm.goodsImgList = data.fileList.map(item => item.fileUrl) // 回显商品图片
					vm.remnant = vm.formData.name.length
					vm.formData.firstCategoryId = data.firstCategoryId // 一级分类id
					vm.formData.secondCategoryId = data.secondCategoryId // 二级分类id
					vm.className = data.firstCategoryName // 回显分类名称
					vm.formData.skuList = data.skuList // sku赋值vm.
					vm.formData.detailList = data.detailList // 商品详情图片赋值
					vm.goodsDetailList = data.detailList.map(item => item.fileUrl) // 回显商品详情图片
				})
			},
			// 验证
			verification() {
				const vm = this
				if (!vm.formData.name) {
					uni.showToast({title: "请输入商品名称!", icon:'none'})
					return false
				}
				if (!vm.formData.fileList.length) {
					uni.showToast({title: "请上传商品图片!", icon:'none'})
					return false
				}
				if (!vm.formData.firstCategoryId) {
					uni.showToast({title: "请选择分类!", icon:'none'})
					return false
				}
				if (!vm.formData.skuList.length) {
					uni.showToast({title: "请选择规格!", icon:'none'})
					return false
				}
				if (!vm.formData.detailList.length) {
					uni.showToast({title: "请上传商品详情图片!", icon:'none'})
					return false
				}
				return true;
			},
			// 上架售卖-新增商品
			StoresSelling() {
				const vm = this
				 if (!vm.verification()) return;
				 const skuData = vm.formData.skuList.filter(item => item.isShelves)
				if (skuData.length == 0) {
					uni.showToast({title: "必须有一条上架的sku!", icon:'none'})
					return false
				}
				vm.formData.imgUrl = vm.formData.fileList[0].fileUrl
				addGoods(vm.formData).then(res => {
					uni.navigateTo({
						url:'./goods'
					})
					uni.showToast({title: "保存成功!", icon:'none', duration: 2000})
				})
			},
			// 商品详情图片上传
			uploadImagDetail() {
				const vm = this
				vm.imgUpload(3)
			},
			// 删除sku数据
			deleteSku(index,id) {
				const vm = this
				vm.formData.skuList.splice(index,1)
				if(id) {
					vm.skuList.push(id)
					vm.formData.deleteIds = vm.skuList.map(item => item).join(',')
				}
			},
			// sku弹窗change事件
			skuPopupChange(e) {
				const vm = this
				console.log("弹窗属性:",e)
				if (e.show == false){ // 清空弹窗数据
					vm.skuParam.sizeId = ''
					vm.skuParam.colorId = ''
					vm.skuParam.tradePrice = ''
					vm.skuParam.imgUrl = ''
					vm.skuParam.colorName = ''
					vm.skuParam.qty = ''
					vm.skuParam.sizeName = ''
					vm.sizeIndex = ''
					vm.colourIndex = ''
					vm.textareaStatus = true
				}
			},
			// sku关闭弹出
			skuClear() {
				const vm = this
				vm.$refs.popup.close()
			},
			// sku弹窗保存
			skuSave() {
				const vm = this
				if (!vm.skuParam.sizeId) {
					uni.showToast({title: "请选择尺码属性!", icon:'none'})
					return false
				}
				if (!vm.skuParam.colorId) {
					uni.showToast({title: "请选择颜色属性!", icon:'none'})
					return false
				}
				if (!vm.skuParam.tradePrice || vm.skuParam.tradePrice == 0) {
					uni.showToast({title: "请输入有效的价格!", icon:'none'})
					return false
				}
				if (!vm.skuParam.qty || vm.skuParam.qty == 0) {
					uni.showToast({title: "请输入正确的库存!", icon:'none'})
					return false
				}
				if (!vm.skuParam.imgUrl) {
					uni.showToast({title: "请上传sku图片!", icon:'none'})
					return false
				}
				const item = JSON.parse(JSON.stringify(vm.skuParam))
				vm.formData.skuList.push(item)
				vm.skuClear()
			},
			// 颜色change事件
			colourChange(e) {
				const vm = this
				vm.colourIndex = e.target.value
				vm.skuParam.colorId = vm.colourList[vm.colourIndex].id // 获取属性id 
				vm.skuParam.colorName = vm.colourList[vm.colourIndex].name // 获取属性名
			},
			// 尺码的chagne事件
			bindPickerChange(e) {
				const vm = this
				vm.sizeIndex = e.target.value
				vm.skuParam.sizeId = vm.sizeList[vm.sizeIndex].id // 获取属性id 
				vm.skuParam.sizeName = vm.sizeList[vm.sizeIndex].name // 获取属性名
			},
			// SKU图片删除
			skuClearImg() {
				const vm = this
				vm.skuParam.imgUrl = ''
			},
			// sku图片上传
			skuUploadImag() {
				const vm = this
				vm.imgUpload(2)
			},
			// 详情图片删除
			clearDeliteImg(index) {
				const vm = this
				vm.goodsDetailList.splice(index,1)
				vm.formData.detailList = []
				vm.formData.detailList = vm.goodsDetailList.map(item => ({fileUrl: item, fileType: 1}))
			},
			// 删除删除图片
			clearImg(index) {
				const vm = this
				vm.goodsImgList.splice(index,1)
				vm.formData.fileList = []
				vm.formData.fileList = vm.goodsImgList.map(item => ({fileUrl: item, fileType: 1}))
			},
			// 上传商品图片
			uploadImag(){
				const vm = this
				vm.imgUpload(1)
			},
			imgUpload(num) {
				const vm = this
				let amount = null
				if (num == 1) {
					amount = 5 - vm.goodsImgList.length
				}
				if(num == 3) {
					amount = 25 - vm.goodsDetailList.length
				}
				else{
					amount = 1
				}
				uni.chooseImage({
				  count: amount,
				  sourceType: ['album','camera'],
				  success: function(res) {
						console.log("选择文件",res)
						const formData = res.tempFilePaths
						//限制上传图片大小（2M）
						for(let i = 0; i < res.tempFiles.length;i++){
							if(res.tempFiles[i].size > vm.Size){
									wx.showModal({
										content: '上传图片不能大于2M!',
										showCancel: false,
									});
									return false;
							}
						}
						 for(var i=0;i<formData.length;i++){
							 uni.uploadFile({
								url: process.env.VUE_APP_BASE_API + '/file/uploadFile',
							 	filePath: formData[i],
							 	method:'post',
							 	name: 'file',
							 	formData: {
							 		useDay: 1,
							 		path: 1
							 	},
							 	success: (res) => {
									console.log("图片返回res",res)
							 		uni.showToast({	title: '上传成功',	icon: 'none' });
							 		// const data = JSON.parse(res.data)
									const { data } = res
									const imgData = JSON.parse(data)
									// console.log('图片数据222：', imgData.data)
							 		const { fileUrl } = imgData.data
							 		if (num === 1) { // 商品返回的数据
							 			vm.goodsImgList.push(fileUrl)
							 			vm.formData.fileList = vm.goodsImgList.map(item => ({fileUrl: item, fileType: 1})) // 新增商品图片赋值
							 		}
							 		if (num === 2) {
							 			vm.skuParam.imgUrl = fileUrl
							 		}
							 		if (num === 3) {
										vm.goodsDetailList.push(fileUrl)
							 			vm.formData.detailList =  vm.goodsDetailList.map(item => ({fileUrl: item, fileType: 1})) // 新增商品详情图片赋值
							 		}
							 	}
							 })	
						 }
				 	
				  }
				})
			},
			// 跳转进入分类
			goodsClass(){
				const vm = this
					// const	stairId = vm.formData.firstCategoryId
					// const	vfpId = vm.formData.secondCategoryId
					uni.navigateTo({
						url: '../class/class?stairId='+vm.formData.firstCategoryId+'&vfpId='+vm.formData.secondCategoryId
					})
			},
			// 选择规格
			selectSku(){
				const vm = this
				selectListPage().then(res => {
					const {records = []} = res.data
					 records.forEach(item => {
						if(item.type == 1) {
							vm.sizeList = item.list
						}
						if (item.type == 3) {
							vm.colourList =item.list
						}
					})
				})
				vm.textareaStatus = false
				this.$refs.popup.open()
			},
			clickBack() {
				const vm = this
				if (vm.goodsId) {
					const skuData = vm.formData.skuList.filter(item => item.isShelves)
					if (skuData.length == 0) {
						uni.showToast({title: "必须有一条上架的sku!", icon:'none'})
						return false
					}
					uni.navigateTo({
						url:'./goods'
					})
				}else{
					uni.switchTab({
						url:'../../me'
					})
				}
				
			},
			submit() {
				const vm = this
				console.log("长度:",vm.formData.name.length)
				vm.remnant = vm.formData.name.length
				if (vm.remnant == 60 || vm.remnant > 60) {
					vm.remnant = 60
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	.contont {
		.search {
			background-color: #ffffff;
			display: flex;
			width: 696rpx;
			position: relative;
			left: 0rpx;
			bottom: 0rpx;
			.iconfont {
				font-size: 48rpx;
			}

			text {
				height: 48rpx;
				opacity: 1;
				font-size: 34rpx;
				font-weight: 500;
				text-align: center;
				color: rgba(0, 0, 0, 0.85);
				line-height: 48rpx;
				margin: auto;
			}
		}

		.add-goods-main {
			padding: 24rpx 24rpx 124rpx 24rpx;
			font-size: 30rpx;
			// font-weight: 400;
			.goods-title {
				padding: 24rpx;
				background: #ffffff;
				border-radius: 16rpx;
				.textarea-num {
						position: relative;
					// 多行输入框
					.uni-textarea {
						width: 100%;
						margin-top: 24rpx;
						padding: 24rpx;
						height: 219rpx;
						background: #f9f9f9;
						border-radius: 4rpx;
						box-sizing: border-box;
					
						/deep/ .placeholder {
							font-size: 26rpx;
							font-weight: 400;
							color: rgba(51, 51, 51, 0.26);
						}
					}

					.num {
						font-size: 26rpx;
						font-weight: 400;
						text-align: right;
						position: absolute;
						right: 24rpx;
						bottom: 24rpx;
					}
				}
			}

			// 类目
			.goods-class {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 27rpx 24rpx;
				font-size: 30rpx;
				font-weight: 400;
				background: #ffffff;
				border-radius: 16rpx;
				margin-bottom: 16rpx;

				.class-icon {
					display: flex;
					align-items: center;

					.Pinkage {
						font-size: 30rpx;
						font-weight: 400;
						text-align: right;
						color: rgba(51, 51, 51, 0.26);
					}

					.iconfont {
						margin-left: 24rpx;
						font-size: 48rpx;
						color: #9e9e9e;
					}
				}
			}

			// sku规格样式
			.goods-specification {
				margin-bottom: 16rpx;
				padding: 27rpx 24rpx;
				font-size: 30rpx;
				font-weight: 400;
				background: #ffffff;
				border-radius: 16rpx;

				.goods-size {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.class-icon {
						display: flex;
						align-items: center;

						.Pinkage {
							font-size: 30rpx;
							font-weight: 400;
							text-align: right;
							color: rgba(51, 51, 51, 0.26);
						}

						.iconfont {
							margin-left: 24rpx;
							font-size: 48rpx;
							color: #9e9e9e;
						}
					}
				}

				.sku-list {
					padding-top: 24rpx;

					.sku-switch {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.sku-title {
							font-size: 26rpx;
							font-weight: 500;
							font-family: PingFangSC, PingFangSC-Medium;
						}
						.sku-delet{
							margin-left: 8rpx;
							color: red;
						}
						.switch {
							display: flex;
							align-items: center;
							/deep/ .wx-switch-input::before{
							 background-color: #E9E9EA !important;
							}
							/* 中间的小圆球 */
							/deep/ .wx-switch-input {
								// margin: 3.5rpx;
								// width: 65rpx !important;
								// height: 65rpx !important;
							}
							
							/*白色样式（false的样式）*/
							
							/deep/ .wx-switch-input::before{
								
							}
						}
					}

					.sku-name {
						margin-left: 16rpx;
						margin-right: 8rpx;
					}

					.sku-size {
						padding: 16rpx 0;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.retail-price {
							display: flex;
							align-items: center;
						}

						.repertory {
							text-align: left;
							color: rgba(51, 51, 51, 0.50);
						}
					}
				}
			}
		}
	}




	// 按钮样式
	.btn-group {
		width: 100%;
		// height: 100rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index:9;
		background-color: #FFFFFF;
		padding: 18rpx 0;
		overflow: hidden;
		border-top:2rpx solid #eeeeee;
		button {
			float: right;
			padding: 11rpx 24rpx;
			border-radius: 60rpx;
			font-size: 30rpx;
			color: #fff;
			line-height: 42rpx;
			margin-right: 24rpx;
		}

		.btn-normal {
			// padding: 8rpx 22rpx;
			color: #333333;
			background-color: #fff;
			box-shadow: 0 0 0 2rpx rgba(51, 51, 51, 0.5) inset;
		}

		.btn-primary {
			background-color: #795c98;
		}
	}
	// 模态框样式
	.modal{
	  border-radius: 16rpx 16rpx 0rpx 0rpx;
	  background: #FFFFFF;
		.modal-header{
			padding: 32rpx 24rpx;
			border-bottom: 2rpx solid #eeeeee;
			display: flex;
			justify-content: space-between;
			height: 50rpx;
			opacity: 1;
			font-size: 36rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: left;
			color: #333333;
			line-height: 50rpx;
			.save{
				color: #795c98;
			}
		}
		.modeal-main{
			font-size: 26rpx;
			font-weight: 400;
			color: #333333;
			padding: 24rpx 48rpx 48rpx 48rpx;
			.disabled-status{
				color: rgba(51,51,51,0.26);
				/deep/ .input-placeholder{
					color:rgba(51,51,51,0.26) !important;
				}
			}
			// input样式
			.uni-input{
				width: 522rpx;
				height: 52rpx;
				border: 2rpx solid #eeeeee;
				border-radius: 6rpx;
				padding-left: 24rpx;
				/deep/ .input-placeholder{
					color: rgba(51,51,51,0.50);
					font-size: 26rpx;
					font-weight: 400;
				}
			}
			.sales-price{
				width: 478rpx !important;
				margin-right: 16rpx;
			}
			.sku-list{
				// padding-top: 24rpx;
				.sku-title{
					font-weight: 500;
					padding-bottom: 24rpx;
				}
				.sku-size{
					padding-bottom: 24rpx;
					display: flex;
					align-items: center;
					.sku-picker{
						width: 522rpx;
						height: 52rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.iconfont{
							font-size: 48rpx;
							color: #9e9e9e;
						}
						.text{
							padding-left: 10rpx;
						}
					}
					.sku-name{
						font-size: 28rpx;
						width: 84rpx;
						margin-right: 48rpx;
						color: rgba(51,51,51,0.50);
					}
				}
			}
			.check-input{
				display: flex;
				align-items: center;
				// 多选框样式
				checkbox /deep/ .wx-checkbox-input.wx-checkbox-input-checked{
					width: 32rpx;
					height: 32rpx;
					background:#795c98;
					border: 1rpx solid #795c98;
					border-radius: 50%;
					color: #FFFFFF;
				}
				checkbox /deep/ .wx-checkbox-input{
					width: 32rpx;
					height: 32rpx;
					border: 1rpx solid #eeeeee;
					border-radius: 50%;
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
			}
		}
	}
	
	
	.file-picker::-webkit-scrollbar {
		display: none; 
	}
	// // 图片上传样式
	.file-picker {
		padding-top: 24rpx;
		overflow-x: auto; 
		overflow-y: hidden;
		display: -webkit-box; 
		-webkit-overflow-scrolling: touch;
		.file-upload{
			width: 150rpx;
			height: 150rpx;
			margin-right: 16rpx;
			opacity: 1;
			background: #f9f9f9;
			border: 1rpx solid #eeeeee;
			border-radius: 5rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			span {
				color: #C6C6C6;
				font-size: 44rpx;
				text-align: center;
				margin-bottom: 10rpx;
			}
			.title {
				font-size: 24rpx;
				font-weight: 400;
				text-align: center;
				color: #333333;
			}
		}
		.file-upload-img{
			width: 150rpx;
			height: 150rpx;
			margin-right: 16rpx;
			border-radius: 4rpx;
			object-fit: cover;
			background: radial-gradient(rgba(255,255,255,0.50), rgba(202,202,202,0.50));
				.img{
					width: 100%;
					height: 100%;
				}
				.icons{
					position: relative;
					top: -174rpx;
					right: -119rpx;
				}
			}
		
		
	}
</style>
