import boxen from "boxen"
import chalk from "chalk"
import { URL } from "../../CONST.js";

class Init {
    static apply() {
        xamba.on('init', async () => {
            xamba.on('banner', () => {
                console.log(
                    boxen(`\n${chalk.bold.whiteBright('XambaJS – modern static websites generator.')}\n\nv${xamba.package.version}\n\n(${xamba.mode})\n\n${chalk.bold.whiteBright(URL)}`, {
                        padding: { top: 1, bottom: 1, left: 8, right: 8 },
                        margin: 0,
                        dimBorder: true,
                        align: 'center',
                        borderColor: 'magenta'
                    })
                );
            });
            await xamba.emit('config');
        });
    }
}

export default Init