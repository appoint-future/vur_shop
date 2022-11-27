import axios from '@/utils/request'

export const getUserListAPI = (Obj) => {
  return axios.get('/users', {
    params: {
      query: Obj.query,
      pagenum: Obj.pageNum,
      pagesize: Obj.pageSize,
    },
  })
}

export const changeUserStateAPI = (uId, type) => {
  return axios.put(`users/${uId}/state/${type}`)
}

export const addUserAPI = (Obj) => {
  return axios.post('/users', {
    username: Obj.username,
    password: Obj.password,
    email: Obj.email,
    mobile: Obj.mobile,
  })
}

export const queryUserInfoAPI = (id) => {
  return axios.get(`users/${id}`)
}

export const modifyUserInfoAPI = (Obj) => {
  return axios.put(`users/${Obj.id}`, { email: Obj.email, mobile: Obj.mobile })
}

export const removeUserAPI = (id) => {
  return axios.delete(`users/${id}`)
}

export const assignmentRoleAPI = (id, rid) => {
  return axios.put(`users/${id}/role`, { rid })
}
