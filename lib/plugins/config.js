import path from 'path';
import ora from 'ora'
import merge from 'webpack-merge'
import chalk from 'chalk';
import os from 'os'
import fs from 'fs'
import { DOCTHEMES } from '../../CONST.js';

class WebpackDev {
    static apply() {
        xamba.flags = {};
        xamba.on('config', async () => {
            await this.init();
        });
        xamba.on('build.done', async () => {
            console.log("Build.done");
        })
    }
    static async loadConfig() {
        return new Promise((resolve, reject) => {
            let defaults = {
                title: 'XambaJS – modern static websites generator',
                theme: 'default',
                host: 'localhost',
                port: 9000,
                // notify: true
            };
            let configPath = path.join(process.cwd(), 'config');
            try {
                xamba.config = merge(defaults, require(configPath));
            } catch (e) {
                xamba.config = defaults;
            }
            resolve();
        })
    }
    static async init() {
        await xamba.emit('banner');
        await xamba.emit('banner.after');
        xamba.loader = xamba.loader || ora();
        xamba.loader.succeed(`Current working dir: ${chalk.bold(process.cwd().replace(os.homedir(), '~'))}`);
        xamba.options.src = path.resolve(xamba.options.src);
        if (!fs.existsSync(xamba.options.src)) {
            xamba.loader.fail(`The source directory doesn't exists.\n\n${chalk.bold.underline('Options:')}\n1. Set it with ${chalk.bold('-s')} arg. \nExample: ${chalk.bold('> cogear -s ./src')} \n2. Use ${chalk.bold('> cogear new')} command to generate new site.`);
            process.exit();
        }
        if (!xamba.config) {
            await this.loadConfig(); // Really loading it in autoloader.js to get plugins
        }
        if (xamba.options.host) xamba.config.host = xamba.options.host;
        if (xamba.options.port !== undefined) xamba.config.port = xamba.options.port;
        if (xamba.config.port < 0 || xamba.config.port > 65536) {
            xamba.loader.fail(`Port to listen on ${chalk.green('must be between')} ${chalk.bold('0')} and ${chalk.bold('65536')}.\nYou've specified ${chalk.red.bold(cogear.options.port)}.`);
            process.exit();
        }
        xamba.options.output = path.resolve(xamba.options.output);
        xamba.pageFormats = ['md', 'html', 'ejs', 'hbs', 'pug'];
        // xamba.buildDir = path.join(process.cwd(), ".build");
        xamba.options.srcPages = path.join(xamba.options.src, 'pages');
        if (xamba.config.theme !== false) {
            xamba.loader.start();
            xamba.loader.text = `Loading theme… ${chalk.bold(xamba.config.theme)}`;
            let themeDirs = [
                path.join(process.cwd(), 'themes', xamba.config.theme), // Local ./theme folder
                path.join(process.cwd(), 'themes', 'xamba-theme-' + xamba.config.theme.replace('xamba-theme-', '')), // node_modules folder, npm package
                path.join(process.cwd(), 'node_modules', 'xamba-theme-' + xamba.config.theme.replace('xamba-theme-', '')) // node_modules folder, npm package
            ];
            themeDirs.some((themePath) => {
                if (fs.existsSync(themePath)) {
                    let configPath = path.join(themePath, 'config');
                    xamba.themeDir = themePath;
                    let defaultConfig = {
                        autoload: true
                    };
                    try {
                        xamba.themeConfig = merge(defaultConfig, require(configPath));
                    }
                    catch (e) {
                        xamba.themeConfig = defaultConfig;
                    }
                    xamba.loader.succeed(`Theme ${chalk.bold(xamba.config.theme)}.`);
                    return true;
                }
            });
            if (!xamba.themeDir) {
                xamba.loader.warn(`Theme ${chalk.bold(xamba.config.theme)} is not found.\nInstall ${chalk.bold('cogear-theme-default')} npm package or any other.\nI'll try to use source dir ${chalk.bold('layouts')} folders.\nMore info: ${DOCTHEMES}`);
            }
        } else {
            xamba.loader.info('Theme is disabled.');
        }
    }
}

export default WebpackDev