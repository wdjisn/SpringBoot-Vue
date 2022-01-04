import request from '../utils/request'

// 获取操作日志
export function operateLog(data) { return request({ url: '/operate/logs', method: 'get', params: data })}

// 获取登录日志
export function loginLog(data) { return request({ url: '/login/logs', method: 'get', params: data })}

// 获取错误日志
export function errorLog(data) { return request({ url: '/error/logs', method: 'get', params: data })}