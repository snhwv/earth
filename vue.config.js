// vue.config.js
module.exports = {
  transpileDependencies: ["three"],
  publicPath: "./",
  configureWebpack: config => {
    config.externals = { AMap: "AMap" };
  }
};
