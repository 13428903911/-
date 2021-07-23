import request from '@/utils/request'
// 进货单列表
export const cardList = (data) => {
    return request.post('/shopping/cart/list', data)
}
// 增加 & 减少 商品数量
export const cartCreate = (data) => {
    return request.post('/shopping/cart/create', data)
}
// 删除属性&商品
export const cartDelete = (data) => {
    return request.post('/shopping/cart/delete', data)
}
// 右滑删除单个商品
export const goodsDelete = (data) => {
    return request.post('/shopping/cart/goods/delete', data)
}
// 清空购物车
export const cartClean = (data) => {
    return request.post('/shopping/cart/clean', data)
}