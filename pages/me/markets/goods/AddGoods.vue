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
		<view class="add-goods-main" :style="{'paddingBottom': footerHeight+'px'}">
			<!-- 商品标题 -->
			<view class="goods-title">
				<view>商品标题</view>
				<view class="textarea-num">
					<textarea class="uni-textarea" maxlength="60" @input="submit" v-model="formData.name"
						:placeholder="placeholder" placeholder-class="placeholder" :disable-default-padding="true"/>
					<view class="num"><text>{{remnant}}</text>/60</view>
				</view>
			</view>
			<!-- 统一销售价 -->
			<view class="unify-price">
				<view class="title">统一销售价</view>
				<view class="money-string">
					<input 
						class="uni-input sales-price" 
						v-model="skuParam.tradePrice" 
						type="digit" 
						@input="salesPrice" 
						placeholder="请输入统一销售价"
						placeholder-class
					/>
					<view class="money">元</view>
				</view>
				
			</view>
			<!-- 商品图片 -->
			<view class="goods-title" style="margin: 16rpx 0;padding-bottom: 0;">
				<view class="titli-cover">
					<view>商品图片</view>
					<view class="cover">(图一为封面)</view>
				</view>
					<view class="file-picker">
						<view class="file-upload-img" v-for="(item,index) in goodsImgList" :key="index">					
							<image :src="imgObs + item" class="img" @click="imgPvm(index)" mode="aspectFill"></image>	
							<view class="icons-delete" @click.stop="clearImg(index)">
								<span class="iconfont icons">&#xe65c;</span>
							</view>
 						</view>
						<view v-if="goodsImgList.length < 5" class="file-upload" @click="uploadImag">
							<span class="iconfont">&#xe62e;</span>
							<view class="title">上传照片</view>
						</view>
					</view>
			</view>
			<!-- 商品视屏 -->
			<view class="goods-title" style="margin: 16rpx 0;">
				<view class="titli-cover">
					<view>主视频</view>
					<view class="detail-sort">(选填)</view>
				</view>
					<view class="file-picker">
						<view class="file-upload" @click="uploadVideo" v-if="!videoUrl">
							<span class="iconfont">&#xe64f;</span>
							<view class="title">上传视频</view>
						</view>
						<view class="file-upload-img" v-else>
							<video 	
								id="myVideo"
								:src="imgObs + videoUrl"
								:show-fullscreen-btn="false"
								:show-center-play-btn="false"
								:show-play-btn="false"
								direction="0"
								x5-playsinline="true"
							>
								<view class="play-btn">
									<span class="iconfont" @click="clickScreen">&#x70;</span>
								</view>
							</video>
							<view class="icons-delete" @click.stop="clearVido" style="z-index: 99;">
								<span class="iconfont icons">&#xe65c;</span>
							</view>
							<!-- <uni-icons type="clear" size="20" class="icons" style="z-index: 99;"></uni-icons> -->
							<view v-if="deleteBtn">
								<view class="uni-popup-video">
									<video
									style="width: 100%;"
									v-if="deleteBtn"
									id="myVideo"
									:src="imgObs + videoUrl"
									:show-fullscreen-btn="true"
									:show-center-play-btn="true"
									:show-play-btn="true"
									:object-fit="fill"
									:autoplay="true"
									x5-playsinline="true"
									direction="0"
									@fullscreenchange="playerFullScreen"
									></video>
								</view>
							</view>
						</view>
					</view>
			</view>
			<!-- 商品详情 -->
			<view class="goods-title" style="padding-bottom: 0;">
				<view class="titli-cover">
					<view>商品详情</view>
					<view class="detail-sort">依照顺序排列</view>
				</view>
				<view class="file-picker">
					<view class="file-upload-img" v-for="(item,index) in goodsDetailList" :key="index">					
						<image :src="imgObs + item" class="img" @click="imgDetail(index)" mode="aspectFill"></image>
						<view class="icons-delete" @click.stop="clearDeliteImg(index)">
							<span class="iconfont icons" @click.stop="clearDeliteImg(index)">&#xe65c;</span>
						</view>
					</view>
					<view v-if="goodsDetailList.length < 25" class="file-upload" @click="uploadImagDetail">
						<span class="iconfont">&#xe62e;</span>
						<view class="title">上传详情</view>
					</view>
				</view>	
			</view>
			<!-- 类目 -->
			<view class="goods-class" @click="goodsClass">
				<view>类目</view>
				<view class="class-icon">
					<text style="color: rgba(0,0,0,0.24)" v-if="!className">{{addClassName}}</text>
					<text v-else>{{secondName}}-{{className}}</text>
					<i class="iconfont">&#xe61a;</i>
				</view>
			</view>
			<!-- 规格 -->
			<view class="goods-specification">
				<view class="goods-size" @click="selectSku">
					<view>规格</view>
					<view class="class-icon">
						<view class="addSku">添加规格</view>
						<i class="iconfont">&#xe61a;</i>
					</view>
				</view>
				<!-- sku列表 -->
				<view class="sku-list" v-if="skuGoodsList.length">
					<view class="sku-img-price sku-size-box" v-for="(item,index) in skuGoodsList" :key="index">
						<!-- titel -->
						<view class="title-tab">
							<view class="color-title">
								<view class="color" :style="{background:item.color}"></view>
								<view class="title">{{item.name}}</view>
							</view>
							<view class="tab">
								<view>尺码</view>
								<view style="margin-right: 30rpx;">价格</view>
								<view>库存</view>
								<view style="margin-right: 10rpx;">上架</view>
							</view>
						</view>
						
						<!-- 上传与列表 -->
						<view class="img-upload-list">
							<view class="file-picker" style="margin:0;padding:0">
								<view class="file-upload" @click="skuUploadImag(item.name)" v-if="!item.imgUrl">
									<span class="iconfont">&#xe62e;</span>
									<view class="title">上传照片</view>
								</view>
								<view class="file-upload-img" v-else>					
									<image class="img" :src="imgObs + item.imgUrl" @click="skuImgPvm(item.imgUrl)" mode="aspectFill"></image>	
									<view class="icons-delete" v-if="item.imgUrl" @click="skuClearImg(item.name)">
										<span class="iconfont icons">&#xe65c;</span>
									</view>
									<!-- <uni-icons type="clear" size="20" class="icons" v-if="item.imgUrl"  @click.stop="skuClearImg(item.name)"></uni-icons>				 -->
								</view>
							</view>
							<view class="zize-box">
								<view class="sku-qcy-size" v-for="(sku,i) in item.list" :key="i">
									<uni-icons type="minus-filled" color="#f8788e;" size="20" @click="deleteSku(item.name,sku.sizeName,i)"></uni-icons>
									<view class="size">{{sku.sizeName}}</view>
									<input class="uni-input" v-model="sku.tradePrice" placeholder="输入价格" type="digit" @input="priceInput(sku)"/>
									<input 
										class="sales-price" 
										:class="qtyString.length > 3 && qtyStringIndex == sku.colorId && qtyName == sku.sizeName ? 'qty' : ''" 
										v-model="sku.qty" 
										maxlength="6"
										type="number" 
										placeholder="0" 
										placeholder-class
										@input="qtyInput(sku)"
									/>
									<evan-switch
										v-model="sku.isShelves ? true : false"
										active-color="#795c98"
										inactive-color="#E9E9EA"
										size=18
										@change="switch1Change($event,sku)"
									>
									</evan-switch>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
	</view>
		<!-- 按钮 -->
		<view class="btn-group">
			<view class="putaway">
				<text class="putaway-text">上架</text>
				<evan-switch
					v-model="formData.isShelves ? true : false"
					active-color="#795c98"
					inactive-color="#E9E9EA"
					size=25
					@change="putawayChange($event)"
				>
				</evan-switch>
			</view>
			<bottons text="保存商品" type="purple" class="btn-purple" size=28 style="margin-right: 24rpx;" @btnClick="StoresSelling"></bottons>
<!-- 			<button type="button" class="btn-primary" @click="StoresSelling">保存商品</button>
 -->			<!-- <button type="button" class="btn-normal" @click="addGoods">保存商品</button> -->
		</view>
	</view>
</template>
<script>
	import bottons from '@/components/button/button.vue'
	import { addGoods,selectListPage,getDoodsDetail,setSkuPrice  } from '@/utils/network/aftermarket.js'
	export default {
		components: { bottons },
		data() {
			return {
				footerHeight: '',
				qtyName: '',
				qtyStringIndex: '',
				qtyString: '',
				skuGoodsList: [],
				deleteBtn: false,
				presentList: [],
				videoUrl: '',
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
				addClassName: '添加类目',
				className: '', // 一级分类名称
				secondName: '', // 二级分类名称
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
					skuList: [], // 新增sku的数据
					video:{
						fileUrl:'', // 文件地址
						fileType: 2 // 文件类型（1.图片，2.视频，3.封面图）
					}
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
			vm.calculateHeight()
		},
		onShow() {
			const vm = this
			uni.$on('update',function(data){
				const params = JSON.parse(JSON.stringify(data))
				vm.className = params.secondName
				vm.secondName = params.stairName
				vm.formData.firstCategoryId = params.stairId // 分类一级id赋值
				vm.formData.secondCategoryId = params.secondId // 分类二级id赋值
			})
			uni.$on('skuList',function(list){
				let skuList = JSON.parse(JSON.stringify(list))
				const currentArr = JSON.parse(JSON.stringify(vm.skuGoodsList))
				if (currentArr.length) {
					// currentArr 变为一维数组
					const skuArr = []
					currentArr.forEach(t => {
						t.list.forEach(j => {
							skuArr.push(j)
						})
					})
					const arr = vm.heavyArray(skuArr, skuList)
					vm.skuGoodsList = arr
				} else {
					vm.skuGoodsList = vm.initSkuList(skuList)
				}
				// 和当前已存在的sku列表进行对比去重
				// if (vm.presentList.length) {
				// 	const arr2 = [...vm.presentList,...skuList]
				// 	skuList = Array.from(new Set(arr2))
				// }
				// 转换成二维数组，加入到规格列表
			})
		},
		methods: {
			calculateHeight() {
				const vm = this
				uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
					success(res) { 
						let titleH = uni.createSelectorQuery().select(".btn-group")
						titleH.boundingClientRect(data=>{
							vm.footerHeight = data.height
							console.log('计算高度:',vm.footerHeight)
						}).exec()
					}
				})
			},
			// 打开视屏弹窗
			clickScreen(){
				 this.deleteBtn = true
				 this.videoContext = uni.createVideoContext('myVideo')
				 this.videoContext.requestFullScreen()
			},
			playerFullScreen(e){
				if(e.detail.fullScreen){  //全屏
					this.isDefinitionBtnShow = false			
				}else{  //非全屏			
					this.isDefinitionBtnShow = true
					this.deleteBtn = false
				}
			},
			// 去重
			heavyArray(currentArr, insertArr) {
				const vm = this
				const list = JSON.parse(JSON.stringify(currentArr))
				insertArr.forEach(t => {
					const { colorId, sizeId } = t
					const hasList = currentArr.filter(sku => sku.colorId === colorId && sku.sizeId === sizeId )
					if (hasList.length === 0) {
						list.push(t)
					}
				})
				const skuList = vm.initSkuList(list)
				console.log('去重后的数据', skuList)
				return skuList
			},
			// 转换二维数组
			initSkuList(arr) {
				const data = JSON.parse(JSON.stringify(arr))
				let skuList = []
				const list = data.map(t => t.colorName)
				const colorList = Array.from(new Set(list))
				colorList.forEach(color => {
					const list = data.filter(t => t.colorName === color)
					list.forEach(x => {
						x.tradePrice = this.skuParam.tradePrice
					})
					const item = {
						name: color,
						color: list[0].color,
						imgUrl: list[0].imgUrl,
						list: list
					}
					skuList.push(item)
				})
				return skuList
			},
			// sku价格input事件
			priceInput(val) {
				const vm = this
				vm.skuGoodsList.forEach(item => {
					item.list.forEach(sku => {
						if (val.colorId === sku.colorId && val.sizeName === sku.sizeName) {
							if (val.tradePrice == 0 || val.tradePrice < 0) {
								uni.showToast({title: "价格不能小于0!", icon:'none'})
								return false
							}
							vm.$nextTick(() => {
							sku.tradePrice = (val.tradePrice.match(/^\d*(\.?\d{0,2})/g)[0]) || null
							})	
						}
					})
				})
			},
			qtyInput(val) {
				this.skuGoodsList.forEach(item => {
					item.list.forEach((sku,index) => {
						if (val.colorId === sku.colorId && val.sizeName === sku.sizeName) {
							this.qtyString = val.qty
							this.qtyStringIndex = sku.colorId
							this.qtyName = sku.sizeName
						}
					})
				})
			},
			// 统一销售价input事件
			salesPrice(amount) {
				const vm = this
				vm.$nextTick(() => {
					vm.skuParam.tradePrice = (vm.skuParam.tradePrice.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				})
				vm.skuGoodsList.forEach(item => {
					item.list.forEach(sku => {
						vm.$nextTick(() => {
						sku.tradePrice = vm.skuParam.tradePrice
						})	
					})
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
			skuImgPvm(imgUrl) {
				const vm = this
				uni.previewImage({
					urls:[vm.imgObs + imgUrl]
				})
			},
			// 商品上架
			putawayChange(e) {
				this.formData.isShelves = e ? 1 : 0
			},
			// sku开关-上下架
			switch1Change(e,val) {
				const vm = this
					vm.skuGoodsList.forEach(item => {
							item.list.forEach(sku => {
								if(val.colorId === sku.colorId && val.sizeName === sku.sizeName) {
									vm.$nextTick(() => {
										sku.isShelves = e ? 1 : 0
									})	
								}
							})
						
					})
			},
			// 获取商品详情
			getGoodsDetail(id) {
				const vm = this
				getDoodsDetail({ id }).then(res => {
					// 回显数据
					const {data = {}} = res
					vm.skuParam.tradePrice = data.tradePrice
					vm.formData.id = data.id // 商品id
					vm.formData.isShelves = parseInt(data.isShelves) // 上下架
					vm.formData.name = data.name // 商品名字
					vm.formData.fileList = data.fileList // 商品图片赋值
					vm.goodsImgList = data.fileList.map(item => item.fileUrl) // 回显商品图片
					vm.remnant = vm.formData.name.length
					vm.formData.firstCategoryId = data.firstCategoryId // 一级分类id
					vm.formData.secondCategoryId = data.secondCategoryId // 二级分类id
					vm.className = data.firstCategoryName // 回显一级分类名称
					vm.secondName = data.secondCategoryName // 回显二级分类名称
					const skuDetail = JSON.parse(JSON.stringify(data.skuList))
					// let skuArr = skuDetail.map(item => ({color: item.colorDetail, name: item.colorName, imgUrl: item.imgUrl, id: item.id}))			
					// let skuListArr = []
					// skuArr.forEach(sku => {
					// 	sku.list = skuDetail.filter(item => sku.id == item.id)
					// })
					// vm.skuGoodsList = skuArr
					vm.skuGoodsList = vm.initSkuList(skuDetail)
					console.log('回显转换数组:',vm.skuGoodsList)
					vm.formData.detailList = data.detailList // 商品详情图片赋值
					vm.goodsDetailList = data.detailList.map(item => item.fileUrl) // 回显商品详情图片
					vm.formData.video.fileUrl = data.video.fileUrl || ''
					vm.videoUrl = data.video.fileUrl
				})
			},
			// 验证
			verification() {
				const vm = this
				if (!vm.formData.name) {
					uni.showToast({title: "请输入商品标题!", icon:'none'})
					return false
				}
				if (!vm.skuParam.tradePrice) {
					uni.showToast({title: "请输入统一销售价!", icon:'none'})
					return false
				}
				if (vm.skuParam.tradePrice == 0 || vm.skuParam.tradePrice < 0) {
					uni.showToast({title: "统一销售价不能小于0!", icon:'none'})
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
				if (!vm.skuGoodsList.length) {
					uni.showToast({title: "请添加规格!", icon:'none'})
					return false
				}
				if (!vm.formData.detailList.length) {
					uni.showToast({title: "请上传商品详情图片!", icon:'none'})
					return false
				}
				return true;
			},
			// 保存商品
			StoresSelling() {
				const vm = this
				 if (!vm.verification()) return;
				 const sizeArr = JSON.parse(JSON.stringify(vm.skuGoodsList))
				 let arr = []
				 sizeArr.forEach(item => {
					 item.list.forEach(sku => {
						 arr.push(sku)
					 })
				 })
				const skuPirce = arr.filter(y => !y.tradePrice) // 没有输入sku价格的长度	
				const skuQty = arr.filter(y => !y.qty) // 没有输入库存的长度		
				const imgSku = sizeArr.filter(x => !x.imgUrl) // 没有上传sku图片的长度
				if(imgSku.length) {
					 uni.showToast({title: "请上传sku图片!", icon:'none'})
					 return
				}
				if(skuPirce.length) {
					 uni.showToast({title: "请输入SKU价格!", icon:'none'})
					 return
				}
				if(skuQty.length) {
					 uni.showToast({title: "库存不能为0或空!", icon:'none'})
					 return
				}
				vm.formData.skuList = arr
				vm.formData.imgUrl = vm.formData.fileList[0].fileUrl
				addGoods(vm.formData).then(res => {
					if (vm.formData.isShelves == 1) {
						uni.navigateTo({
							url:'./goods'
						})
					}
					if (vm.formData.isShelves == 0) {
						uni.navigateTo({
							url:'./goods?isShelves='+0
						})
					}
					
					uni.showToast({title: "保存成功!", icon:'none', duration: 3000})
				})
			},
			// 商品详情图片上传
			uploadImagDetail() {
				const vm = this
				vm.imgUpload(3)
			},
			// 删除sku数据
			deleteSku(colorName,name,index) {
				const vm = this
				vm.skuGoodsList.forEach((item,sub) => {
					if (item.name == colorName) {
						item.list.forEach(sku => {
							if(sku.sizeName == name) {
								item.list.splice(index,1)
								if (!item.list.length) {
									vm.skuGoodsList.splice(sub,1)
								}
							}
						})
					}
				})	
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
			},
			// 删除视屏
			clearVido() {
				this.formData.video.fileUrl = ''
				this.videoUrl = ''
			},
			// SKU图片删除
			skuClearImg(name) {
				const vm = this
				console.log('sku图片删除:',name)
				vm.skuGoodsList.forEach(item => {
					if (item.name === name) {
						item.imgUrl = ''
						item.list.forEach(sku => {
							sku.imgUrl = ''
						})
					}
				})
			},
			// sku图片上传
			skuUploadImag(name) {
				const vm = this
				vm.imgUpload(2,name)
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
			// 上传视屏
			uploadVideo() {
				const vm = this
				  uni.chooseVideo({
						count: 1,
						compressed: false,
						sourceType: ['camera', 'album'],
						success: function (res) {
							const formData = res.tempFilePath
							wx.showLoading({
							   title: '视频上传中'
							})
							uni.uploadFile({
								fileType: 'video',
								url: process.env.VUE_APP_BASE_API + '/file/uploadFile',
								method:'post',
								filePath:formData,
								formData: {
									useDay: 1,
									path: 1
								},
								name:'file',
								 success: (res) => { 
									 wx.hideLoading()
									 const data = JSON.parse(res.data)
									 console.log("失败？",data)
									 if(data.code == 200) {
											vm.videoUrl = data.data.fileUrl
											vm.formData.video.fileUrl = data.data.fileUrl
											if(data.data.fileUrl) {
												uni.showToast({	title: '上传成功',	icon: 'none' });
											}
									 }else{
										 uni.showToast({	title: data.msg,	icon: 'none' });
									 }
								 },
								 fail: (error) => {
								 	wx.hideLoading()
									// uni.showToast({	title: '上传失败',	icon: 'none' });
								 }
							})
						}
				})
			},
			// 上传商品图片
			uploadImag(){
				const vm = this
				vm.imgUpload(5)
			},
			imgUpload(num,colorName) {
				const vm = this
				let amount = null
				if (num === 5) {
					amount = num - vm.goodsImgList.length
				}
				if(num === 3) {
					amount = 25 - vm.goodsDetailList.length
				}
				if(num === 2) {
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
						wx.showLoading({
						   title: '图片上传中'
						})
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
									wx.hideLoading()
									const { data } = res
									const imgData = JSON.parse(data)
									if (imgData.code == 200) {
										const { fileUrl } = imgData.data
										if (num === 5) { // 商品返回的数据
											vm.goodsImgList.push(fileUrl)
											vm.formData.fileList = vm.goodsImgList.map(item => ({fileUrl: item, fileType: 1})) // 新增商品图片赋值
										}
										if (num === 2) {
											vm.skuGoodsList.forEach(item => {
												if (item.name == colorName) {
													item.imgUrl = fileUrl
													item.list.forEach(sku => {
														sku.imgUrl = fileUrl
													})
												}
											})
										}
										if (num === 3) {
											vm.goodsDetailList.push(fileUrl)
											vm.formData.detailList =  vm.goodsDetailList.map(item => ({fileUrl: item, fileType: 1})) // 新增商品详情图片赋值
										}
										uni.showToast({	title: '上传成功',	icon: 'none' })
									}
							 		else{
										uni.showToast({	title: imgData.msg,	icon: 'none' });
									}
							 	},
								fail: (error) => {
									wx.hideLoading()
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
			 uni.navigateTo({
			     url: './size'
			 });
			},
			clickBack() {
				const vm = this
				if (vm.goodsId) {
					uni.navigateTo({
						url:'./goods'
					})
				}else{
					uni.switchTab({
						url:'../../me'
					})
				}
				
			},
			// 富文本框input事件
			submit() {
				const vm = this
				console.log("长度:",vm.formData.name.length)
				vm.formData.name = vm.formData.name.replace(/\s+/g, "")
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
			padding: 24rpx 24rpx 0rpx 24rpx;
			font-size: 30rpx;
			// font-weight: 400;
			.goods-title {
				padding: 24rpx;
				background: #ffffff;
				border-radius: 16rpx;
				margin-bottom: 16rpx;
				.titli-cover{
					display: flex;
					align-items: center;
					.cover{
						color: #795c98;
						font-size: 26rpx;
						margin-left: 16rpx;
					}
				}
				.detail-sort{
					color: rgba(0,0,0,0.40);
					font-size: 26rpx;
					margin-left: 16rpx;
				}
				.textarea-num {
						position: relative;
					// 多行输入框
					.uni-textarea {
						width: 100%;
						margin-top: 24rpx;
						padding: 12px;
						height: 219rpx;
						border-radius: 4rpx;
						box-sizing: border-box;
						border: 1rpx solid #eeeeee;
						/deep/ .placeholder {
							font-size: 30rpx;
							font-weight: 400;
							color: rgba(51, 51, 51, 0.24);
						}
					}

					.num {
						font-size: 26rpx;
						font-weight: 400;
						text-align: right;
						position: absolute;
						color: rgba(0,0,0,0.24);
						right: 24rpx;
						bottom: 24rpx;
					}
				}
			}
			// 统一销售价
			.unify-price{
				.title{
					width: 150rpx;
				}
				padding: 27rpx 24rpx;
				font-size: 30rpx;
				font-weight: 400;
				background: #ffffff;
				border-radius: 16rpx;
				margin: 16rpx 0;
				display: flex;
				align-items: center;
				.money-string{
					width: 77%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.uni-input{
						margin-left: 24rpx;
						/deep/ .input-placeholder{
							color: rgba(51,51,51,0.24);
						}
					}
					.money{
						color: rgba(51,51,51,0.24);
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
						.addSku{
							font-size: 30rpx;
							color: rgba(0,0,0,0.24);
						}
						.iconfont {
							margin-left: 24rpx;
							font-size: 48rpx;
							color: #9e9e9e;
						}
					}
				}
				// 规格列表
				.sku-list {
					padding-top: 24rpx;
					.sku-img-price{
						margin-bottom: 24rpx;
						.title-tab{
							display: flex;
							justify-content: space-between;
							align-items: center;
							font-size: 24rpx;
							margin-bottom: 32rpx;
							.color-title{
								display: flex;
								align-items: center;
								.color{
									width: 32rpx;
									height: 32rpx;
									background: #ffa0a0;
									border-radius: 50%;
								}
								.title{
									font-size: 28rpx;
									margin-left: 8rpx;
								}
							}
							.tab{
								width: 61%;
								display: flex;
								justify-content: space-between;
								align-items: center;
								color: rgba(0,0,0,0.40);
								.tab-name{
									// margin-right: 65rpx;
								}
							}
						}
						// 图片与列表
						.img-upload-list{
							display:flex;
							flex-wrap: wrap;
							justify-content: space-between;
							align-items: center;
							.file-picker{
								position: relative;
								.file-upload-img{
									position: relative;
									margin-top:16rpx;
									// .icons{
									// 	position: absolute;
									// 	top:-11rpx;
									// 	left: 123rpx;
									// 	z-index: 9;
									// }
								}
							}
							.zize-box{
								width: 70%;
							}
							.sku-qcy-size{
								// height: 48rpx;
								display: flex;
								justify-content: space-between;
								align-items: center;
								margin-bottom: 16rpx;
								.size{
									font-size: 24rpx;
									width: 55rpx;
									text-align: center;
								}
								.uni-input{
									width: 122rpx;
									height: 48rpx;
									border: 1rpx solid rgba(0,0,0,0.24);
									border-radius: 11rpx;
									padding: 0 12rpx;
									text-align: center;
									font-size: 24rpx;
								}
								.sales-price{
									width: 72rpx;
									height: 48rpx;
									border: 1rpx solid rgba(0,0,0,0.24);
									border-radius: 11rpx;
									text-align: center;
									font-size: 24rpx;
								}
								.qty{
									font-size: 20rpx;
								}
								/deep/ .input-placeholder {
									font-size: 24rpx !important;
									color: rgba(0,0,0,0.24) !important;
								}
							}
						}
					}
					.sku-img-price:last-of-type {
					  margin-bottom: 0rpx;
					}
				}
			}
		}
		
	}




	// 按钮样式
	.btn-group {
		z-index: 9;
		position: fixed;
		bottom:0;
		padding-bottom: constant(safe-area-inset-bottom);  // 核心代码
		padding-bottom: env(safe-area-inset-bottom); // 核心代码
		background: rgba(255,255,255,.36);
		backdrop-filter: blur(50rpx);
		width: 100%;
		height: 100rpx;
		box-shadow: 0 45px 0 0 #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.putaway{
			display: flex;
			align-items: center;
			padding-left: 24rpx;
			.putaway-text{
				font-size: 30rpx;
				margin-right: 16rpx;
			}
		}
  /deep/ .button-hover {
			background-color:#fff;
		}
	}
	.file-picker::-webkit-scrollbar {
		display: none; 
	}
	// // 图片上传样式
	.file-picker {
		padding-top: 24rpx;
		// overflow-x: auto; 
		// overflow-y: hidden;
		// display: -webkit-box; 
		// -webkit-overflow-scrolling: touch;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		.file-upload{
			width: 150rpx;
			height: 150rpx;
			margin-bottom: 24rpx;
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
		.file-upload-img:nth-child(4n) {
			margin-right: 0 !important;
		}
		.file-upload-img{
			width: 150rpx;
			height: 150rpx;
			margin-right: 18rpx;
			border-radius: 4rpx;
			margin-bottom:24rpx;
			background: radial-gradient(rgba(255,255,255,0.50), rgba(202,202,202,0.50));
				.img{
					width: 100%;
					height: 100%;
					border-radius: 4rpx;
				}
				video{
					width: 100%;
					height: 100%;
					object-fit: fill;
					position: relative;
					z-index: 99 !important;
					.play-btn{
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						border: 1px solid #FFFFFF;
						background-color: rgba(0,0,0,0.1);
						position: absolute;
						top: 0;
						right: 0;
						bottom: 0;
						left: 0;
						display: flex;
						justify-content: center;
						align-items: center;
						z-index: 99 !important;
						margin:auto;
						.iconfont{
							color: #FFFFFF;
							font-size: 34rpx;
						}
					}
				}
				.uni-popup-video{
					width: 100vw;
					height: 50vh;
					background-color: #FFFFFF;
					video{
						// width: 100%;
						// height: 100%;
						object-fit: fill;
						
					}
				}
				.icons-delete{
					width: 35rpx;
					height: 35rpx;
					background-color: #333333;
					position: relative;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 50%;
					top: -170rpx;
					right: -123rpx;
					.icons{
						color: #FFFFFF;
						font-size: 26rpx;
					}
				}
				.videoIcons{
					z-index: 999;
				}
			}
	}
</style>
