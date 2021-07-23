import request from '@/utils/request'
// 商品分类
export const getGoods = (data) => {
    return request.post('/GoodsCategory/no_auth/selectByCateIdApp', data)
}
// 首页banner
export const carouselInfo = (params) => {
    return request.get('/carousel/info', params)
}
// 根据二级分类id查询商品列表
export const selectGoodsByCate = (params) => {
    return request.get('/goods/no_auth/selectGoodsByCate', params)
}
// 根据商品id查询详情
export const selectByIdApp = (data) => {
    return request.post('/goods/no_auth/selectByIdApp', data)
}
// 根据商品名称查询档口
export const getSuppsAndGoods = (params) => {
    return request.get('/supplier/no_auth/getSuppsAndGoods', params)
}
// 查询所有分类
export const allSelect = (data) => {
    return request.post('/GoodsCategory/no_auth/selectAllApp', data)
}
// es查询商品分类和商品名称
export const selectByName = (data) => {
    return request.post('/EsGoods/no_auth/selectByName', data)
}
// 档口内搜索商品高亮显示
export const findByNameAndId = (data) => {
    return request.post('/EsSupplier/no_auth/findByNameAndId', data)
}
// 获取商圈
export const areaList = (params) => {
    return request.get('/supplier/areaList', params)
}
// 品牌特卖
export const selectByIsSuperSale = (params) => {
    return request.get('/goods/no_auth/selectByIsSuperSale', params)
}
// 品牌上新
export const IsNews = (params) => {
    return request.get('/goods/no_auth/selectSupplierAndGoodsByIsNews', params)
}
// 获取二级风格列表（首页临时使用接口）
export const getStyle = (params) => {
    return request.get('/GoodsAttribute/no_auth/getStyle', params)
}
// 根据相关条件获取商品列表（首页临时使用接口）
export const Condition = (params) => {
    return request.get('/goods/no_auth/selectGoodsListByCondition', params)
}