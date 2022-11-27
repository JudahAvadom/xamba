import glob from 'glob'
import now from 'performance-now';
import pIteration from 'p-iteration'
import chalk from "chalk"
import prettyMs from 'pretty-ms';
import path from 'path'

const { forEach } = pIteration

class Preload {
    static apply() {
        xamba.on('preload', async () => {
            await this.preload();
        });
        xamba.on('preload.page', async ([file, obj]) => {
            let page = await this.page(file, obj);
            return page;
        });
    }
    static async preload() {
        if (!xamba.webpackConfig) {
            xamba.loader.fail('Webpack config must be loaded before pages preload starts.');
            process.exit();
        }
        return new Promise(async (resolve) => {
            xamba.loader.start('Preloading pages...\n');
            console.log(xamba.options.srcPages);
            let files = glob.sync(`**/*.@(${xamba.pageFormats.join('|')})`, { cwd: xamba.options.srcPages });
            xamba.pages = {};
            let start = now();
            if (!files.length) {
                xamba.loader.fail(`No files are found in the source dir ${chalk.bold(xamba.options.src.replace(require('os').homedir, '~'))}.\nPlease, make sure that at least one page file is available.`);
                process.exit();
            }
            await xamba.emit('preload.before');
            await forEach(files, async (file) => {
                await xamba.emit('preload.page', [file]);
            });
            xamba.loader.succeed(`${chalk.whiteBright.bold('Preloaded')} in ${prettyMs(now() - start)}.`);
            await xamba.emit('preload.done');
            resolve();
        })
    }
    static async page(file, page) {
        return new Promise(async (resolve, reject) => {
            if (file) {
                page = {
                    file: file,
                    filePath: path.join(xamba.options.srcPages, file),
                };
                console.log(page);
            }
        })
    }
}

export default Preload