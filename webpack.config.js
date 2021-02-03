const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  const config = {
    mode: 'development',
    entry: ["./src/main.scss", "./src/main.js"],
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
      new CopyPlugin({
        patterns: [
          { 
            from: path.resolve(__dirname, "src/img"), 
            to: path.resolve(__dirname, 'docs/img')
          },
          { 
            from: path.resolve(__dirname, "src/favicon.ico"), 
            to: path.resolve(__dirname, 'docs')
          }
        ]
      }),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
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