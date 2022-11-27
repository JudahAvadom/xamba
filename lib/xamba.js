import path from 'path';
import Emittery from 'emittery';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Necesary modules
import utils from './plugins/utils.js'
import Init from './plugins/init.js';
import cli from "./plugins/cli.js"
import generatorInit from "./plugins/generators/init.js"
import Config from './plugins/config.js'
import Site from './plugins/generators/site.js';
import WebpackDev from './plugins/webpack.dev.js';

class Xamba extends Emittery {
    constructor() {
        super();
        // Set Cogear.JS as global object
        global.xamba = this;
        // Set package root
        this.baseDir = path.dirname(__dirname);
        // Load plugins
        this.load(utils);
        this.load(Init);
        this.load(generatorInit);
        this.load(Config);
        this.load(Site);
        this.load(WebpackDev);
        this.load(cli);
    }
    /**
     * Load plugin
     * @param {String} plugin 
     */
    async load(plugin) {
        await this.use(plugin);
        return this;
    }
    /**
     * Use plugin
     * @param {*} Plugin 
     */
    async use(Plugin) {
        await Plugin.apply();
        return this;
    }
};
export default Xamba;