const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  const config = {
    mode: 'development',
      entry: ["./projects/georeview/src/main.scss", "./projects/georeview/src/main.js"],
    output: {
      path: path.resolve(__dirname, "docs"),
      filename: "[fullhash].[name].js",
    },
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader'
        },
        {
          test: /\.scss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader', 
            'css-loader',
            'sass-loader'
          ],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          loader: 'file-loader'
        },
      ],
    },
    plugins: [
      
      new HtmlWebpackPlugin({
        template: "./projects/georeview/src/index.html",
        filename: "index.html",
        hash: true,
        minify: {
          collapseWhitespace: false
        }
      })
    ]
  }
 
  if (isProd) {
    config.plugins = (config.plugins || []).concat([
      new MiniCssExtractPlugin({
        filename: '[fullhash].styles.css'
      }),
    ])
  }

  return config;
}