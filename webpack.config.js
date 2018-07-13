const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/* 环境变量模式 */
const mode = process.env.NODE_ENV;

/* devServer的配置 */
const devServer = {
    compress: true,
    host: "0.0.0.0",
    hot: true,
    https: true,
    open: true,
    overlay: {
        warnings: true,
        errors: true
    },
    port: 9000
}

/* 基础配置 */
const config = {
    mode: mode,
    target: 'web',
    entry: path.resolve(__dirname, 'src/main.js'),
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.js/,
                loader: 'babel-loader'
            },
            {
                test: /\.(jpg|jpeg|png|svg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlPlugin()
    ]
}

/* 根据代码环境设置开发/生产环境的对应配置 */
if (mode === "development") {
    /* 开发环境 */
    /* 添加样式 */
    config.module.rules.push({
        test: /\.scss$/,
        use: [
            "style-loader",
            "css-loader",
            {
                loader: "postcss-loader",
                options: {
                    sourceMap: true
                }
            },
            "sass-loader"
        ]
    })

    /* 设置sourcemap的质量 */
    config.devtool = "cheap-module-eval-source-map",

    /* 设置devServer */
    config.devServer = devServer,

    /* 添加插件 */
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
    )



} else if (mode === "production") {
    /* 生产环境 */
    /* 单独提取css文件 */
    config.module.rules.push({
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
                loader: "postcss-loader",
                options: {
                    sourceMap: true
                }
            },
            "sass-loader"
        ]
    })

    /* 插件 */
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: "[name].[contentHash:8]].css",
            chunkFilename: "[id].css"
        })
    )

    /* 设置optimization */
    config.optimization = {
        splitChunks: {
            chunks: 'all',
            name: 'common',
        },
        runtimeChunk: {
            name: 'runtime',
        }
    }
}

console.log(mode)

console.log(config)

module.exports = config;