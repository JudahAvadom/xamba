import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import WebpackBar from 'webpackbar';
import os from 'os';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let plugins = [
    new WebpackBar(),
    //new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        'xamba': {
            'options': JSON.stringify(xamba.options),
            'config': JSON.stringify(xamba.config)
        }
    }),
];
if (os.platform() != 'win32' && fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
    const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
    plugins.unshift(new HardSourceWebpackPlugin({
        info: {
            mode: 'none',
            level: 'error'
        },
    }));
}
export default {
    context: xamba.baseDir,
    resolve: {
        extensions: ['.js', '.json', '.coffee', '.ts'], // File extensions that will be resolved automatically
        alias: {
            '#': path.join(process.cwd(), '/'), // Alias for project root
            '@': xamba.themeDir ? path.join(xamba.themeDir, '/') : '' // Alias for theme root
        },
    },
    // Output params
    output: {
        filename() {
            if (xamba.mode === 'development') {
                return '[name].js?[hash:5]';
            }
            return '[name].[hash:5].js';
        },
        chunkFilename: '.chunks/[name].[hash:5].js',
        hotUpdateChunkFilename: '.hot/[name].[hash:5].js',
        path: xamba.options.output
    },
    module: {
        rules: [
            // Images loaders
            {
                test: /\.svg/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        context: process.cwd(),
                        limit: 1024 * 8,
                        name() {
                            if (xamba.mode === 'development') {
                                return '[name].[ext]?[hash:4]';
                            }
                            return '[name]-[hash:6].[ext]';
                        },
                        outputPath: 'images/',
                        publicPath: '/images/'
                    }
                }]
            },
            {
                test: /\.(jpe?g|png|gif|ico)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[hash:6].[ext]',
                        outputPath: 'images/',
                        publicPath: '/images/'
                    }
                }]
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name() {
                            if (xamba.mode === 'development') {
                                return '[name].[ext]?[hash:4]';
                            }
                            return '[name]-[hash:6].[ext]';
                        },
                        outputPath: 'fonts/',
                        publicPath: '/fonts/'
                    }
                }]
            },
            // JavaScript preprocessors
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: path.resolve(__dirname, 'tsconfig.json')
                }
            },
            {
                test: /\.coffee$/,
                loader: 'babel-loader!coffee-loader',
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                )
            }
        ]
    },
    plugins,
    node: {
        fs: 'empty'
    },
    externals: [
        import('webpack-require-http')
    ]
};