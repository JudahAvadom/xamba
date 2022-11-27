import Config from './config.js'
import path from 'path'
import fs from 'fs'

class Autoloader {
    static async apply() {
        await Config.loadConfig();
        xamba.on('init', async () => {
            let localPluginsPath = path.join(process.cwd(), 'plugins');
            let plugins = [];
            if (xamba.config.plugins) {
                xamba.config.plugins.forEach(plugin => {
                    xamba.use(require(require.resolve(plugin, {
                        paths: [
                            localPluginsPath
                        ]
                    })));
                    plugins.push(plugin);
                });
            }
            else {
                if (fs.existsSync(localPluginsPath)) {
                    let localPlugins = glob.sync('*/package.json', { cwd: localPluginsPath });
                    localPlugins.forEach(pkg => {
                        let plugin = path.basename(path.dirname(pkg));
                        xamba.use(require(require.resolve(plugin, {
                            paths: [
                                localPluginsPath
                            ]
                        })));
                        plugins.push(plugin);
                    });
                }
                // Load current site package.json
                let pkgPath = path.join(process.cwd(), 'package.json');
                if (fs.existsSync(pkgPath)) {
                    let pkg = xamba.requirePackageJSON(pkgPath);
                    if (pkg.dependencies) {
                        let npmPlugins = Object.keys(pkg.dependencies).filter(plugin => plugin.indexOf('xamba-plugin-') !== -1);
                        npmPlugins.forEach(plugin => {
                            xamba.use(require(require.resolve(plugin, {
                                paths: [
                                    path.join(process.cwd())
                                ]
                            })));
                            plugins.push(plugin);
                        });
                    }
                }
                xamba.on('banner.after', () => {
                    if (plugins.length) {
                        xamba.loader = xamba.loader || ora();
                        xamba.loader.info(`Found ${plugins.length} ${plural('plugin', plugins.length)}…`);
                        plugins.forEach(plugin => {
                            xamba.loader.succeed(`Plugin ${chalk.bold(plugin.replace('xamba-plugin-', ''))} is loaded.`);
                        });
                        xamba.loader.succeed('All plugins are loaded.');
                    }
                });
            }
        })
    }
}

export default Autoloader