const webpack = require("webpack");
const path = require("path");

// This lets xrpl.js work in the browser, copy this file for your own code!
module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    assert: require.resolve("assert"),
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    stream: require.resolve("stream-browserify"),
    url: require.resolve("url"),
    ws: require.resolve("xrpl/dist/npm/client/WSWrapper")
  });

  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"]
    })
  ]);

  config.resolve.alias = {
    ws: path.resolve(
      __dirname,
      "./node_nodules/xrpl/dist/npm/client/WSWrapper.js"
    )
  };
  console.log(config);

  return config;
};
