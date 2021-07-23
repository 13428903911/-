import Vue from 'vue'
import App from './App'
import '@/static/iconfont/iconfont.css'
import cuCustom from 'colorui/components/cu-custom.vue'

Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
