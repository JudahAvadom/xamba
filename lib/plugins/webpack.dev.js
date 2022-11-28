import webpack from 'webpack'
import chalk from 'chalk'
import express from 'express'
import http from 'http'
import WebpackDevServer from 'webpack-dev-server'
import middleware from "webpack-dev-middleware";
import path from "path"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WebpackDev {
    static apply() {
        xamba.on('webpack', async ({ mode }) => {
            if (mode == 'development') {
                await this.webpackDev();
            }
        });
        xamba.on('build.done', () => {
            console.log("Build");
        })
        xamba.on('preload.done', async () => {
            if (xamba.mode == 'development') {
                if (xamba.compiler) return;
                try {
                    xamba.compiler = webpack(xamba.webpackConfig);
                } catch (e) {
                    xamba.loader.fail(chalk.red(e));
                    process.exit();
                }
                xamba.compiler.hooks.afterEmit.tap('Build pages', async compilation => {
                    xamba.compilation = compilation;
                    await xamba.emit('webpack.afterEmit', compilation);
                });
                xamba.compiler.hooks.done.tap('Webpack done', async stats => {
                    xamba.compilation = stats.compilation;
                    await xamba.emit('webpack.done', stats.compilation);
                    xamba.flags.webpackFirstDone = true; // Important. DO NOT DELETE
                });
                await this.runServer();
            }
        })
    }
    static async webpackDev() {
        xamba.webpackConfig = import("../../webpack.dev.js");
        await xamba.emit('webpack.config', xamba.webpackConfig);
        await xamba.emit('preload');
    }
    static async runServer() {
        xamba.server = express();
        xamba.devMiddleware = webpack({
            mode: 'development',
            devServer: {
                contentBase: xamba.themeDir
                    ? [xamba.options.src, xamba.themeDir]
                    : [xamba.options.src]
            },
            resolve: {
                modules: [path.join(__dirname, 'src'), 'node_modules'],
                extensions: ['*', '.js', '.jsx'],
            },
        })
        /*xamba.hotMiddleware = {
            overlay: true,
            log: console.info,
            heartbeat: 10 * 1000,
            path: '/__webpack_hmr',
            reload: true,
        };*/
        try {
            xamba.server.use(middleware(xamba.devMiddleware));
        } catch (error) {
            console.log(error);
        }
        //xamba.server.use(middleware(xamba.compiler,xamba.hotMiddleware));
        xamba.server.use(express.static(xamba.options.output));
        await xamba.emit('server.init');
        xamba.server.on('error', (e) => {
            console.error(e.message);
            console.info(e.stack);
        });
        console.log(xamba.config.port);
        xamba.http = http.createServer(xamba.server).listen(xamba.config.port, xamba.config.host, async err => {
            if (err) {
                xamba.loader.fail(err);
                process.exit();
            }
            await xamba.emit('server.listen');
        });
    }
}

export default WebpackDev