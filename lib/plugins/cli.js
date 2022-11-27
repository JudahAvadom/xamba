import getopts from "getopts"
import boxen from "boxen"
import { program } from 'commander';
import chalk from "chalk"
import pkg from "../../package.json" assert { type: 'json' };

export default class Cli {
    static apply() {
        xamba.on('cli', async () => {
            await this.init()
        });
    }
    static async init() {
        xamba.options = getopts(process.argv.slice(2), {
            alias: {
                s: 'src',
                o: 'output',
                h: 'host',
                p: 'port',
                b: 'open',
                w: 'verbose',
                n: 'no-open',
                c: 'config',
            }
            // TODO
        });
        xamba.package = pkg;
        program.usage(`${chalk.bold.whiteBright('xamba')} [command] [options]`);
        program
            .command('version')
            .alias('v')
            .description('Show version number.')
            .action(() => console.log(xamba.package.version))

        program
            .command('new [site-name]')
            .alias('init')
            .option('-y', 'Ignore questions.')
            .description('Generate new site.')
            .action(async (str) => {
                await xamba.emit('generators.init', 'site');
            });

        await xamba.emit('program', program);

        if (xamba.options.help) {
            program.help((help) => {
                return boxen(
                    `\n${chalk.bold.whiteBright('Xamba.JS – modern static websites generator.')}\n\nv${xamba.package.version}\n`,
                    {
                        padding: { top: 1, bottom: 1, left: 8, right: 8 },
                        margin: 0,
                        dimBorder: true,
                        align: 'center',
                        borderColor: 'magenta'
                    }) + `\n${chalk.white('Runs in development mode by default (without [command]).\n')}${help}
                    `;
            })
        }

        program.parse(process.argv);
    }
}