import store from '@/store'
import request from 'axios'
import { Loading } from 'element-ui'
import Vue from 'vue'
Vue.use(Loading)

const axios = request.create({
  baseURL: 'https://lianghj.top:8888/api/private/v1'
})

// axios 请求拦截器
let loading
axios.interceptors.request.use(
  config => {
    // 每次请求都会有加载画面
    loading = Loading.service({
      lock: true,
      text: '拼命加载中...',
      background: 'rgba(0,0,0,0.8)'
    })
    // 首先判断会话存储中是否有token
    const token = store.state.userInfo.token
    // 如果有token值则以后每次请求都携带请求头
    if (token) {
      config.headers.Authorization = token
    }
    // 如果没有则直接请求，不填加请求头
    return config
  },
  // 请求错误
  error => {
    return Promise.reject(error)
  }
)

// axios响应拦截器
axios.interceptors.response.use(
  response => {
    // 得到响应后关闭加载界面
    loading.close()
    return response
  },
  // 响应失败
  error => {
    return Promise.reject(error)
  }
)

export default axios
