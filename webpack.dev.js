import {merge} from 'webpack-merge';
import path from 'path';
import common from './webpack.common.js';
import webpack from 'webpack';
import postcssConfig from './postcss.config.js';

export default merge(common, {
    entry: {
        app: [path.join(xamba.baseDir, 'lib', 'hot.js'), path.join(xamba.options.src, 'app')]
    },
    mode: 'development',
    devtool: 'eval-source-map',
    module: {
        rules: [
            // CSS preprocessors
            {
                test: /\.(sa|sc|c)ss/,
                use: [
                    'style-loader',
                    'css-loader',
                    { loader: 'postcss-loader', options: postcssConfig },
                    'sass-loader'
                ]
            },
            {
                test: /\.styl/,
                use: [
                    'style-loader',
                    'css-loader',
                    { loader: 'postcss-loader', options: postcssConfig },
                    'stylus-loader'
                ]
            },
            {
                test: /\.less/,
                use: [
                    'style-loader',
                    'css-loader',
                    { loader: 'postcss-loader', options: { config: postcssConfig } },
                    'less-loader'
                ]
            }
        ]
    },
    plugins: [
        // new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
});