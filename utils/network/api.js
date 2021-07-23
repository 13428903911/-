import request from '@/utils/request'
// 微信登录
export const login = (url, data) => {
    return request.post(url, data)
}
// 账号密码登录
export const passwordLogin = (data) => {
    return request.post('/member/no_auth/shop/password_login', data)
}
// POST请求
export const $POST = (url, data) => {
    return request.post(url, data)
}

// GET请求
export const $GET = (url, data) => {
    return request.get(url, data)
}

// 获取个人信息
export const getMemberInfo = (params) => {
    return request.get('/shop/getShopInfo', params)
}
// 设置个人信息
export const updateMember = (data) => {
    return request.post('/shop/updateShop', data)
}

// 档口列表（分页）
export const getSuppsAnd = (params) => {
    return request.get('/supplier/no_auth/getSuppsAndGoods', params)
}

// 根据档口id查询档口详情
export const getGoodsBySuppId = (data) => {
    return request.post('/supplier/no_auth/getGoodsBySuppId', data)
}
// 通过(档口)供应商id查询出供应商信息
export const getSupplierBySuppId = (data) => {
    return request.post('/supplier/no_auth/getSupplierBySuppId', data) 
}
// sku详情
export const getGoodsSku = (data) => {
    return request.post('/GoodsSku/no_auth/selectByGoodsIdApp', data)
}

// 根据商品id查询商品详情
export const getselectByIdApp = (data) => {
    return request.post('/goods/no_auth/selectByIdApp', data)
}

// 添加地址
export const addMyUrl = (data) => {
    return request.post('/shop/addAddress', data)
}

// 查看地址
export const getMyUrl = (params) => {
    return request.get('/shop/getConsInfo', params)
}

// 设置默认地址
export const setDefault = (data) => {
    return request.post('/shop/setDefault', data)
}

// 删除地址
export const deleteAddress = (data) => {
    return request.post('/shop/deleteAddress', data)
}

// 修改地址
export const updateAddress = (data) => {
    return request.post('/shop/updateAddress', data)
}

// 添加地址，省市区前端传汉字
export const addAddressByWord = (data) => {
    return request.post('/shop/addAddressByWord', data)
}

// 根据收货人id查询收货人详情
export const getConsByConsId = (data) => {
    return request.post('/shop/getConsByConsId', data)
}

// 我的收藏商品列表
export const getCollectSku = (data) => {
    return request.post('/shop/getCollectGoods', data)
}
// 取消收藏商品
export const collectSku = (data) => {
    return request.post('/shop/collectGoods', data)
}
// 获取收藏档口列表
export const getCollectSupplier = (data) => {
    return request.post('/shop/getCollectSupplier', data)
}
// 收藏档口
export const collectSupplier = (data) => {
    return request.post('/shop/collectSupplier', data)
}

// 新增进货单
export const  addOrder = (data) => {
    return request.post('/shopping/cart/batch_create', data)
}

// 商品分类页面左侧一级菜单
export const getSongList = (data) => {
    return request.post('/GoodsCategory/no_auth/selectBaseApp', data)
}

// 商品分类页面右侧二级菜单分类
export const classify = (data) => {
    return request.post('/GoodsCategory/no_auth/selectByCateIdApp', data)
}

// 根据分类id查询商品信息（分页）
export const classified = (params) => {
    return request.get('/goods/no_auth/selectGoodsByCate', params)
}

// 获取用户采购订单列表(全部订单列表)
export const allOrders = (params) => {
    return request.get('/purchase/selectAllOfApp', params)
}

// 获取用户订单列表详情（订单详情）
export const infoDetail = (params) => {
    return request.get('/purchase/selectDetailOfApp', params)
}


// 用户取消订单
export const byUser = (data) => {
    return request.post('/purchase/cancel', data)
}

// 创建订单（确认订单下单）
export const createOrder = (data) => {
    return request.post('/order/info/create', data)
}

// 售后订单列表
export const orderList = (params) => {
    return request.get('/after_sale/selectAll', params)
}
// 更新售后退货单状态并插入退货物流信息(云档口后台小程序)
export const updateStatusAndLogisticsInfo = (data) => {
    return request.post('/after_sale/updateStatusAndLogisticsInfo', data)
}
// 撤回退货单
export const saleCancel = (data) => {
    return request.post('/after_sale/cancel', data)
}
// 门店申请平台介入处理
export const applyPlatformHandle = (data) => {
    return request.post('/after_sale/applyPlatformHandle', data)
}

// 根据退货单ID查询退货单商品详情信息(云档口后台小程序)
export const selectDetail = (params) => {
    return request.get('/after_sale/selectDetail', params)
}

// 查询默认收货人地址,没有默认地址就返回第一个,没有地址就返回空（小程序）
export const getDefaultConsInfo = (params) => {
    return request.get('/shop/getDefaultConsInfo', params)
}

// 确认收货
export const infoConfirm = (data) => {
   return request.post('/purchase/confirm', data)
}


// 支付接口
export const wechatPay = (params) => {
    return request.get('/payment/stall/wechat_pay', params)
}

// 支付完成之后点击查看订单的详情（订单详情）
export const orderDetail = (params) => {
    return request.get('/order/detail', params)
}
// 根据运单号查询物流
export const getLogisticsTrack = (params) => {
    return request.get('/getPhoneLogisticsTrack', params)
}
// 申请售后
export const createReturnOrder = (data) => {
   return request.post('/after_sale/createReturnOrder', data)
}
// 根据上新获取相关供应商
export const goodsByIsNews = (params) => {
    return request.get('/goods/no_auth/selectSuppAndGoodsDetailByIsNews', params)
}
// 品牌上新轮播图
export const goodsMainDetailByIsNewsImg = (params) => {
    return request.get('/goods/no_auth/selectSuppGoodsMainDetailByIsNewsImg', params)
}
// 品牌上新商品列表
export const selectSuppGoodsDetailByIsNews = (params) => {
    return request.get('/goods/no_auth/selectSuppGoodsDetailByIsNews', params)
}