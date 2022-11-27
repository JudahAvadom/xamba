import boxen from "boxen"
import chalk from "chalk"

class Init {
    static apply() {
        xamba.on('init', async () => {
            xamba.on('banner', () => {
                console.log(
                    boxen(`\n${chalk.bold.whiteBright('Cogear.JS – modern static websites generator.')}\n\nv${cogear.package.version}\n\n(${cogear.mode})\n\n${chalk.bold.whiteBright('https://cogearjs.org')}`, {
                        padding: { top: 1, bottom: 1, left: 8, right: 8 },
                        margin: 0,
                        dimBorder: true,
                        align: 'center',
                        borderStyle: 'single-double',
                        borderColor: 'magenta'
                    })
                );
            });
            await xamba.emit('config');
        });
    }
}

export default Init