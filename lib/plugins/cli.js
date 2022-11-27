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
            },
            default: {
                src: xamba.config.src || 'src',
                output: xamba.config.output || 'public',
                host: xamba.config.host ||  'localhost',
                port: xamba.config.port || 9000,
                open: xamba.config.openBrowser || true,
                verbose: xamba.config.verbose || false,
            }
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
                xamba.emit('generators.site');
            });
        program
            .command('development')
            .alias('dev')
            .description('Development mode with hot-reload (default).')
            .action(this.development);

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

    static async development() {
        xamba.mode = 'development';
        console.log(xamba);
        await xamba.emit('init');
        xamba.on('webpack.done', async (compilation) => {
            if (!xamba.flags.webpackFirstDone) {
                await xamba.emit('build', compilation);
            }
        });
        await xamba.emit('webpack', {
            mode: xamba.mode
        });
    }
}