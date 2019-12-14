module.exports = {
  // outputDir: path.resolve(__dirname, 'public'),
  // devServer: {
  //     port: 5001,
  //     proxy: {
  //         '/api': {
  //             target: 'http://api:3001',
  //         },
  //     },
  // },
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");

    svgRule.uses.clear();

    svgRule
      .use("babel-loader")
      .loader("babel-loader")
      .end()
      .use("vue-svg-loader")
      .loader("vue-svg-loader");
  }
};
