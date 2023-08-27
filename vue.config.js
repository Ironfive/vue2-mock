"use strict";
const path = require("path");

const name = process.env.VUE_APP_TITLE || "管理系统"; // 网页标题

const port = process.env.port || process.env.npm_config_port || 80; // 端口

module.exports = {
  publicPath: process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : "/",
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: "dist",
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: "static",
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
  lintOnSave: false, //关闭语法检查
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // devServer: {
  //   proxy: "http://localhost:3000",
  // },
  // devServer: {
  //   host: "0.0.0.0",
  //   port: port,
  //   open: true,
  //   proxy: {
  //     // detail: https://cli.vuejs.org/config/#devserver-proxy
  //     ["/proxy-api"]: {
  //       target: `http://localhost:8080`,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         ["^" + process.env.VUE_APP_BASE_API]: "",
  //       },
  //     },
  //   },
  //   disableHostCheck: true,
  // },
};
