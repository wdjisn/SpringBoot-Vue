import Vue from 'vue'
import axios from 'axios'
import router from '../router'

const service = axios.create({
    baseURL: 'spba-api',
    timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        config.headers["satoken"] = sessionStorage.getItem('spba-token');
        return config;
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            // 拦截登录失效、无权限操作
            if (response.data.code == 501) {
                sessionStorage.removeItem('spba-token');
                sessionStorage.removeItem('spba-username');
                sessionStorage.removeItem('spba-menu');
                sessionStorage.removeItem('spba-perms');
                Vue.prototype.$alert(response.data.message, {
                    confirmButtonText: '确定',
                    showClose: false,
                    callback() {
                        router.push('/login');
                    }
                });
            }
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        return Promise.reject(error);
    }
);

export default service;