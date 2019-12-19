// vue.config.js
module.exports = {
    devServer: {
        port: 8080,
        proxy: {
            '/apis': {
                target: 'http://energy.shuhuhu.com',  // target host
                ws: true,  // proxy websockets 
                changeOrigin: true,  // needed for virtual hosted sites
                pathRewrite: {
                    '^/apis': ''  // rewrite path
                }
            },
        }
    },
    publicPath:"/static/mobile/dist/",
    indexPath:"../../../templates/mobile/index.html"
};
