import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 每次加载时更新会话存储的数据
// 读取会话存储数据
const state = JSON.parse(sessionStorage.getItem('state'))
// 把会话存储数据保存到变量中
let initState = {
  userInfo: {},
}
// 如果会话存储有数据就更新，没有就不更新
if (state) initState = state

// 创建一个新的 store 实例
export default new Vuex.Store({
  state: initState,
  mutations: {
    // 更新用户信息
    updataUserInfo(state, userInfo) {
      state.userInfo = userInfo
      // 把state的数据保存到会话存储
      this.commit('saveUserInfo')
    },
    // 把state的数据保存到会话存储
    saveUserInfo(state) {
      sessionStorage.setItem('state', JSON.stringify(state))
    },
  },
})
