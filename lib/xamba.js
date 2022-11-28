import path from 'path';
import Emittery from 'emittery';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Necesary modules
import utils from './plugins/utils.js'
import Init from './plugins/init.js';
import cli from "./plugins/cli.js"
import Theme from './plugins/theme.js'
import generatorInit from "./plugins/generators/init.js"
import Config from './plugins/config.js'
import Site from './plugins/generators/site.js';
import WebpackDev from './plugins/webpack.dev.js';
import Preload from './plugins/preload.js';
import Death from './plugins/death.js';
import Resources from './plugins/resources.js';
import Autoloader from './plugins/autoloader.js';
import Build from './plugins/build.js';
import Deploy from './plugins/deploy.js';
import WebpackProd from './plugins/webpack.prod.js';
import Clear from './plugins/clear.js';

class Xamba extends Emittery {
    constructor() {
        super();
        // Set Xamba.JS as global object
        global.xamba = this;
        // Set package root
        this.baseDir = path.dirname(__dirname);
        // Load plugins
        this.load(utils);
        this.load(Init);
        this.load(Config);
        this.load(Death);
        this.load(Resources);
        this.load(Clear);
        this.load(generatorInit);
        this.load(Site);
        this.load(Preload);
        this.load(Theme);
        this.load(WebpackDev);
        this.load(WebpackProd);
        this.load(Build);
        this.load(Deploy);
        this.load(Autoloader);
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