// 石磊ip地址
const baseURL='http://192.168.1.66:7005'

// 海尔001号店测试ip
// const baseURL='https://dev-cloud-stall-api.haier-ioc.com'

// 徐学俊ip地址
// const baseURL='http://192.168.1.41:7005'

// 林常捷ip地址
// const baseURL='http://192.168.1.51:7005'

// 张棵ip
// const baseURL='http://192.168.1.198:7005'

// ip地址
 // const baseURL= process.env.VUE_APP_BASE_API

// 测试接口
// const token = uni.getStorageSync('authorization')
const request = {
    get(url, data) {	
			// wx.showLoading({
			//    title: '加载中'
			// })
			if (uni.getStorageSync('authorization')) {
				return new Promise((resolve, reject) => {
				    uni.request({
				        url: baseURL + url,
				        data: data,
				        header: {
									'source': '1',
									'Authorization': uni.getStorageSync('authorization'),
									'Accept': 'application/json',
									'Content-Type': 'application/x-www-form-urlencoded'
								},
				        method: "GET",
				        success: (response) => {
				            let res = response.data
				            if (res.code === 200||url=='/check/music') {
												// wx.hideLoading()
				                resolve(res)
				            } else {
				                reject(res)
				                showError(res)
												// wx.hideLoading()
				            }
				        },
				        fail: (error) => {
										// wx.hideLoading()
				            if (error && error.response) {
				                reject(error.response)
				                showError(error.response);
				            }
				        },
				
				
				    });
				})
			}else{
				return new Promise((resolve, reject) => {
				    uni.request({
				        url: baseURL + url,
				        data: data,
				        header: {
									'source': '1',
									'Accept': 'application/json',
									'Content-Type': 'application/x-www-form-urlencoded'
								},
				        method: "GET",
				        success: (response) => {
				            let res = response.data
				            if (res.code === 200||url=='/check/music') {
				                resolve(res)
				            } else {
				                reject(res)
				                showError(res);
				            }
				        },
				        fail: (error) => {
				            if (error && error.response) {
				                reject(error.response)
				                showError(error.response);
				            }
				        },
				
				
				    });
				})
			}
       

    },
    post(url, data) {	
			// wx.showLoading({
			//    title: '加载中'
			// })
				if (uni.getStorageSync('authorization')) {
					return new Promise((resolve, reject) => {
					    uni.request({
					        url: baseURL + url,
					        data: data,
					        header: {
										'source': '1',
					        	'Authorization': uni.getStorageSync('authorization'),
					        	'Accept': 'application/json',
					        	'Content-Type': 'application/json'
					        },
					        method: "POST",
					        success: (response) => {
					            let res = response.data
					            if (res.code === 200) {
					                resolve(res)
													// wx.hideLoading()
					            } else {
													// wx.hideLoading()
					                reject(res)
					                showError(res);
					
					            }
					        },
					        fail: (error) => {
										// wx.hideLoading()
					            if (error && error.response) {
					                reject(error.response)
					                showError(error.response);
					            }
					        },
					    });
					})
				}else{
					return new Promise((resolve, reject) => {
					    uni.request({
					        url: baseURL + url,
					        data: data,
					        header: {
										'source': '1',
					        	'Accept': 'application/json',
					        	'Content-Type': 'application/json'
					        },
					        method: "POST",
					        success: (response) => {
					            let res = response.data
					            if (res.code === 200) {
					                resolve(res)
					            } else {
					                reject(res)
					                showError(res);
					
					            }
					        },
					        fail: (error) => {
					            if (error && error.response) {
					                reject(error.response)
					                showError(error.response);
					            }
					        },
					    });
					})
				}
    },
}
const showError = error => {
	let msg = error.msg
	let errorMsg = ''
	switch (error.code) {
			case 400:
					errorMsg = '请求参数错误'
					break
			case 301:
					errorMsg = '未授权，请登录'
					break
			case 401:
					errorMsg = '账号未授权，请登录'
					break
			case 403:
					errorMsg = '跨域拒绝访问'
					break
			case 404:
					errorMsg = '请求地址不存在'
					break
			case 408:
					errorMsg = '请求超时'
					break
			case 500:
					errorMsg = '服务异常'
					break
			case 501:
					errorMsg = '服务未实现'
					break
			case 5002:
					errorMsg = 'token过期'
					break
			case 503:
					errorMsg = '服务不可用'
					break
			case 504:
					errorMsg = '网关超时'
					break
			case 505:
					errorMsg = 'HTTP版本不受支持'
					break
			default:
					errorMsg = "请求失败"
					break
    }
    uni.showToast({
        title: msg || errorMsg,
        icon: 'none',
        duration: 3000,
        complete: function() {}
    });
}

export default request
