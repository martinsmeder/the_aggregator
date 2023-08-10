const path = require("path");

module.exports = {
  entry: "./src/script.js",
  devtool: "inline-source-map", // Enable multi-file debugging
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
