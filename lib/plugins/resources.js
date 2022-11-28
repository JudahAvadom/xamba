import fse from 'fs-extra';
import path from 'path'
import fs from 'fs'
import chalk from 'chalk';
class Resources {
    static apply() {
        xamba.on('webpack', async () => {
            if (['production', 'build', 'deploy'].includes(xamba.mode)) {
                await xamba.emit('resources');
                await this.copy();
            }
        });
        xamba.on('server.init', async () => {
            if (!['development'].includes(xamba.mode)) return;
            xamba.loader.start('Linking resources…');
            await this.init();
            if (xamba.resources.length > 0) {
                await forEach(cogear.resources, async dir => {
                    xamba.server.use(express.static(dir));
                });
                xamba.loader.succeed(`${chalk.whiteBright.bold('Resources')} are linked.`);
            }
            else {
                xamba.loader.info(`${chalk.whiteBright.bold('Resources')} folder is not found.`);
            }
        })
    }
    static async init() {
        let directory = xamba.config.resourcesDir || 'resources';
        xamba.resources = xamba.config.resources || [directory];
        if (!Array.isArray(xamba.resources)) {
            xamba.loader.fail('Given resources config param is not array.');
            process.exit();
        }
        xamba.resources = xamba.resources.map(dir => {
            return path.join(xamba.options.src, dir);
        });
        if (xamba.themeDir) {
            xamba.resources.push(path.join(xamba.themeDir, directory));
        }
        xamba.resources = xamba.resources.filter(dir => fs.existsSync(dir));
    }
    static async copy() {
        xamba.loader.start('Loading resources…');
        await this.init();
        await forEach(xamba.resources, async dir => {
            try {
                await fse.copy(
                    dir,
                    xamba.options.output
                );
            } catch (e) {
                //console.error(e);
            }
        });
        xamba.loader.succeed('Resources are copied to the output folder.');
    }
}

export default Resources