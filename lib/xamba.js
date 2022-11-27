import path from 'path';
import { fileURLToPath } from 'url';
import Emittery from 'emittery';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Necesary modules
import cli from "./plugins/cli.js"
import init from "./plugins/generators/init.js"
import Site from './plugins/generators/site.js';

class Xamba extends Emittery {
    constructor() {
        super();
        // Set Cogear.JS as global object
        global.xamba = this;
        // Set package root
        this.baseDir = path.dirname(__dirname);
        // Load plugins
        this.load(init);
        this.load(Site);
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