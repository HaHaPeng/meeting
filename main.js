import App from './App'
import Vue from 'vue'

Vue.config.productionTip = false

import uView from 'uview-ui'
Vue.use(uView)

App.mpType = 'app'
const app = new Vue({
    ...App
})

// 引入请求封装，将app参数传递到配置中
require('@/config/request.js')(app)

app.$mount()