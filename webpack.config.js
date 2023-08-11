const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/script.js",
  devtool: "inline-source-map", // Enable multi-file debugging
  plugins: [new Dotenv()],
  resolve: {
    alias: {
      // Enable easier imports from config folder
      config: path.resolve(__dirname, "config"),
    },
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
