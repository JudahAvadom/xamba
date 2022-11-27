import path from 'path';
import ora from 'ora'
import merge from 'webpack-merge'
class WebpackDev {
    static apply() {
        xamba.flags = {};
        xamba.on('config', async () => {
            await this.init();
        });
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
        xamba.options.src = path.resolve(xamba.options.src);
        if (!xamba.config) {
            await this.loadConfig(); // Really loading it in autoloader.js to get plugins
        }
        xamba.pageFormats = ['md', 'html', 'ejs', 'hbs', 'pug'];
        // xamba.buildDir = path.join(process.cwd(), ".build");
        xamba.options.srcPages = path.join(xamba.options.src, 'pages');
    }
}

export default WebpackDev