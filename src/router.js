import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/common/Login.vue')
        },
        {
            path: '/',
            redirect: '/login',
            component: () => import('./views/common/Index.vue'),
            children: [
                {
                    path: '/home',
                    name: 'home',
                    meta: { title: '首页' },
                    component: () => import('./views/common/Dashboard.vue')
                },
                {
                    path: '/admin',
                    name: 'admin',
                    meta: { title: '管理员' },
                    component: () => import('./views/admin/Index.vue')
                },
                {
                    path: '/role',
                    name: 'role',
                    meta: { title: '角色管理' },
                    component: () => import('./views/role/Index.vue')
                },
                {
                    path: '/menus',
                    name: 'menus',
                    meta: { title: '菜单管理' },
                    component: () => import('./views/menu/Index.vue')
                },
                {
                    path: '/loginlog',
                    name: 'loginlog',
                    meta: { title: '登录日志' },
                    component: () => import('./views/log/Login.vue')
                },
                {
                    path: '/operatelog',
                    name: 'operatelog',
                    meta: { title: '操作日志' },
                    component: () => import('./views/log/Operate.vue')
                },
                {
                    path: '/errorlog',
                    name: 'errorlog',
                    meta: { title: '错误日志' },
                    component: () => import('./views/log/Error.vue')
                },
                {
                    path: '/clipboard',
                    name: 'clipboard',
                    meta: { title: '剪切板' },
                    component: () => import('./views/component/Clipboard.vue')
                },
                {
                    path: '/uploadvideo',
                    name: 'uploadvideo',
                    meta: { title: '上传视频' },
                    component: () => import('./views/component/UploadVideo.vue')
                },
                {
                    path: '/export',
                    name: 'export',
                    meta: { title: '导出Excel' },
                    component: () => import('./views/component/Export.vue')
                }
            ]
        }
    ]
})