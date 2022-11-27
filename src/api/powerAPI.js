import axios from '@/utils/request'

export const getRightsListAPI = (type) => {
  return axios.get(`rights/${type}`)
}

export const getRolesListAPI = () => {
  return axios.get('roles')
}

export const removeRolesAPI = (roleId, rightId) => {
  return axios.delete(`roles/${roleId}/rights/${rightId}`)
}

export const assignPermissionsAPI = (roleId, rids) => {
  return axios.post(`roles/${roleId}/rights`, { rids })
}

export const addRoleAPI = (Obj) => {
  return axios.post('roles', {
    roleName: Obj.roleName,
    roleDesc: Obj.roleDescription,
  })
}

export const editRoleAPI = (id, roleName, roleDesc) => {
  return axios.put(`roles/${id}`, { roleName, roleDesc })
}

export const removeRoleAPI = (id) => {
  return axios.delete(`roles/${id}`)
}
