module.exports = {
    lintOnSave: false,  // 如果为false，就是取消eslint规则的检查
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        // 设置代理
        proxy: {
            '/spba': {
                target: 'http://localhost:8082',
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            }
        }
    }
}