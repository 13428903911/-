import request from '@/utils/request'

// 销售单列表
export const getAfterket = (params) => {
   return request.get('/order/shop/list_by_shop', params)
}

// 销售单详情
export const getAfterketDetail = (params) => {
   return request.get('/order/shop/detail_by_shop/' + params)
}

// 销售单详情
export const getImmediate = (data) => {
   return request.post('/order/shop/ship',data)
}

// 销售单里商品列表
export const getGoodsList = (params) => {
   return request.get('/ShopGoods/no_auth/pageGoodsListStall',params)
	 // return request.get('/ShopGoods/no_auth/pageGoodsList',params)
}

// 根据skuId修改上下架及价格
export const setSkuPrice = (data) => {
   return request.post('/ShopGoodsSku/no_auth/updateStallGoodsSkuShelves',data)
}

// 根据skuId批量修改上下架及价格
export const setBatchSkuPrice = (data) => {
   return request.post('/ShopGoodsSku/no_auth/updateStallGoodsSkuShelvesBatch',data)
}

// 统计接口
export const getStatistics = (params) => {
   return request.get('/stall/unifyStatistics',params)
}

// 删除商品接口
export const deleteByGoodsId = (data) => {
   return request.post('/ShopGoods/no_auth/deleteByGoodsId',data)
}

// 商品添加修改
export const addGoods = (data) => {
   return request.post('/ShopGoods/no_auth/save',data)
}

// 获取商品详情
export const getDoodsDetail = (data) => {
   return request.post('/ShopGoods/no_auth/selectByGoodsId',data)
}

// 销售售后单列表接口
export const getSelectAllByShop = (params) => {
   return request.get('/after_sale/shop/selectAllByShop',params)
}

// 售后单ID查询售后单商品详情
export const getSelectDetailp = (params) => {
   return request.get('/after_sale/shop/selectDetailOfShop',params)
}

// 售后同意退货
export const salesReturn = (data) => {
   return request.post('/after_sale/shop/agree',data)
}

// 售后拒绝退货 or 拒绝退款
export const salesReject = (data) => {
   return request.post('/after_sale/shop/reject',data)
}

// 接收退款
export const consentReimburse = (data) => {
   return request.post('/after_sale/shop/agreeRefund',data)
}

// 属性列表分页（树形）
export const selectListPage = (params) => {
   return request.get('/GoodsAttribute/selectListPage',params)
}