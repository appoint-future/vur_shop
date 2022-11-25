// 导入axios配置包
import axios from '@/utils/request'

// 发起登录请求
export const LoginAPI = (username, password) => {
  return axios.post('/login', { username, password })
}
