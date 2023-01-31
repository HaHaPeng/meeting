import App from './App'
import Vue from 'vue'
import store from '@/store';

Vue.config.productionTip = false

import uView from 'uview-ui'
Vue.use(uView)

App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})

// 引入请求封装，将app参数传递到配置中
require('@/config/request.js')(app)

app.$mount()