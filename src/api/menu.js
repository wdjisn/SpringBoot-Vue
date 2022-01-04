import request from '../utils/request'

// 获取菜单列表
export function menuList(data) { return request({ url: '/menus', method: 'get', params: data })}

// 获取菜单详情
export function getMenu(id) { return request({ url: '/menu/' + id, method: 'get' })}

// 添加菜单
export function createMenu(data) { return request({ url: '/menu', method: 'post', data })}

// 编辑菜单
export function editMenu(data) { return request({ url: '/menu', method: 'put', data })}

// 删除菜单
export function delMenu(id) { return request({ url: '/menu/' + id, method: 'delete' })}