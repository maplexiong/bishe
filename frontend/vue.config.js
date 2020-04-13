module.exports = {
  chainWebpack: (config) => {
    config.plugins.delete("prefetch");
  },
  publicPath: "/",
  outputDir: "dist",
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
      title: "嘉华水果店销售管理系统",
    },
  },
};
