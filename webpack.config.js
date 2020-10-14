const path = require('path');
const webpack = require('webpack');
const pretty = require('pretty');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/main.js'
    },
    output: {
        crossOriginLoading: 'anonymous',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {extractCSS: process.env.NODE_ENV === 'production'}
            },
            {
                test: /vanity\.js$/,
                loader: 'worker-loader',
                exclude: /node_modules/,
                options: {
                    inline: true,
                    name: 'vanity.js'
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules(?!\/keccak)/
            },
            {
                test: /\.(png|woff|woff2)/,
                exclude: /node_modules/,
                loader: 'url-loader'
            }
        ]
    },
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true
    },
    performance: {
        hints: false
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                TID: JSON.stringify(process.env.TID)
            }
        }),
        new CopyWebpackPlugin([{
            from: 'src/assets/images/favicon.ico',
            to: '.',
            toType: 'dir'
        }])
    ]
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = module.exports.plugins.concat([
        new ExtractTextPlugin('style.css'),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: '../index.html',
            inject: false
        }),
    ]);
}

if (process.env.DEPLOY) {
    const SpaPlugin = require('prerender-spa-plugin');
    module.exports.plugins = module.exports.plugins.concat([
        new SriPlugin({
            hashFuncNames: ['sha256', 'sha384']
        }),
        new SpaPlugin({
            staticDir: path.join(__dirname),
            routes: ['/'],
            postProcess(renderedRoute) {
                renderedRoute.html = pretty(renderedRoute.html, {ocd: true})
                    .replace('render', 'prerender')
                    .replace(/(data-v-[0-9a-f]+)=""/gm, '$1');
                return renderedRoute;
            }
        })
    ]);
}
