// 销售全部订单状态
export const sellStatu = [
	{ title: '全部',	value: null	},
	{ title: '待付款',	value: 'WAIT_PAYMENT'},
	{	title: '待发货',	value: 'WAIT_SHIP' },
	{ title: '待收货',	value: 'SHIPPED'},
	{	title: '待提货', value: 'WAIT_PICKUP' },
	{	title: '已完成',	value: 'FINISHED', hidden: true	},
	{	title: '已取消',	value: 'CANCELLED', hidden: true },
	{	title: '已关闭',	value: 'CLOSED', hidden: true }
]

// 销售售后状态
export const sellAfterSaleStatu = [
	{ title: '全部',	value: null	},
	{ title: '待处理',	value: 'WAIT_HANDLE'},
	{	title: '待退货',	value: 'WAIT_SEND_BACK' },
	{ title: '待退款',	value: 'RETURNED'},
	{	title: '退款成功', value: 'REFUND_SUCCESSFUL', hidden: true  },
	{	title: '退款关闭',	value: 'REFUND_CLOSED', hidden: true 	}
]

// 售后订单状态
export const saleStatu = [
	{ title: '全部',	value: null	},
	{ title: '待审核',	value: 'WAIT_EXAMINE'},
	{	title: '待退货',	value: 'WAIT_RETURN' },
	{ title: '待退款',	value: 'WAIT_REFUND'},
	{	title: '平台介入', value: 'PLATFORM_INTERVENTION' },
	{	title: '拒绝退货',	value: 'REJECT_RETURN'},
	{	title: '退款完成',	value: 'REFUND_COMPLETE'},
	{	title: '已同意',	value: 'AGREED' }
]

// 匹配状态title
export function filterStatus(status, list) {
	const vm = this
	const item = list.filter(t => t.value === status)
	if (item.length) {
		return item[0].title
	}
}
