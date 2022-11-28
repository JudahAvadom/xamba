import glob from 'glob'
import now from 'performance-now';
import pIteration from 'p-iteration'
import chalk from "chalk"
import prettyMs from 'pretty-ms';
import path from 'path'
import fs from 'fs'

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
                try {
                    page = merge(page, yamlFront.loadFront(fs.readFileSync(page.filePath, 'utf-8')));
                } catch (e) {
                    console.error(e.message);
                }
                let stats = fs.statSync(page.filePath);
                page.date = page.date || new Date(stats.birthtimeMs);
                page.created_at = page.date;
                page.updated_at = stats.mtime;
            }
            page.filename = path.parse(page.file).name
            page.format = path.extname(page.file);
            if (page.uri) {
                page.path = page.uri.indexOf('.html') != -1 ? page.uri : page.uri + '/index.html';
            } else {
                page.path = page.file.replace(/\.(md|html|pug|ejs|hbs)$/, '') + (page.filename == 'index' ? '.html' : '/index.html');
                page.uri = page.path.replace('index.html', '');
            }
            if (xamba.config.pages) {
                Object.keys(xamba.config.pages)
                    .filter(regex => { // If match page path
                        return new RegExp(regex).test(page.uri);
                    })
                    .forEach(key => { // Copy given options to the page
                        page = merge(page, xamba.config.pages[key]);
                    });
            }
            await xamba.emit('preload.page.parse', page);
            if (page.__content) {
                try {
                    page.content = await xamba.parser.render(page.__content, page);
                } catch (e) {
                    console.error(`\n ${chalk.red(e)} \n`);
                    reject(e);
                }
            }
            await xamba.emit('preload.page.parse.after', page);
            page.chunks = ['app'];
            await xamba.emit('preload.page.chunks', page);
            // Inject js
            if (Array.isArray(page.js)) {
                page.chunks = [];
                // Avoid duplicates
                page.js = page.js.filter((v, i, a) => a.indexOf(v) === i);
                // if(!page.keepJS) page.chunks = []
                for (let script of page.js) {
                    let scriptPath = script.indexOf(xamba.baseDir) !== -1 ? script : path.join(xamba.options.src, script);
                    if (script.indexOf(xamba.baseDir) !== -1) {
                        script = script.replace(process.cwd() + '/', '');
                    }
                    if (xamba.mode == 'development') {
                        xamba.webpackConfig.entry[script] = [path.join(cogear.baseDir, 'lib', 'hot.js'), scriptPath];
                    } else {
                        xamba.webpackConfig.entry[script] = [scriptPath];
                    }
                    page.chunks.push(script);
                }
            }
            await xamba.emit('preload.page.chunks.after', page);
            // 8. Add to global pages array
            xamba.pages[page.uri] = page;
            resolve(page);
        })
    }
}

export default Preload