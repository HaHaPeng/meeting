import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		token: uni.getStorageSync("token") || null
	},
	getters: {
		token: state => state.token,
		isLogin: state => Boolean(state.token)
	},
	mutations: {
		login(state, token) {
			state.token = token
			uni.setStorageSync("token", token)
		},
		clearStore(state) {
			state.token = null
			uni.removeStorageSync("token")
		}
	}
})

export default store;