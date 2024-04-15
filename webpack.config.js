// webpack.config.js
const path = require("path");

module.exports = {
  // Your existing webpack configuration...
  resolve: {
    fallback: {
      stream: require.resolve("stream-browserify"),
    },
  },
};
