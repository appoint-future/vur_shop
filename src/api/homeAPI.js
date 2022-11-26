import axios from '@/utils/request'

export const getMenusAPI = () => {
  return axios.get('/menus')
}
