import request from '../utils/request'

// 获取角色列表
export function roleList(data) { return request({ url: '/roles', method: 'get', params: data })}

// 获取角色详情
export function roleInfo(id) { return request({ url: '/role/' + id, method: 'get' })}

// 添加角色
export function createRole(data) { return request({ url: '/role', method: 'post', data })}

// 编辑角色
export function editRole(data) { return request({ url: '/role', method: 'put', data })}

// 删除角色
export function delRole(id) { return request({ url: '/role/' + id, method: 'delete' })}