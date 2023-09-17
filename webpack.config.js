const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/render.js",
  devtool: "inline-source-map", // Enable multi-file debugging
  plugins: [new Dotenv()],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
