import os from 'os';
import fse from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
class Clear {
    static apply() {
        ['death', 'deploy.done'].forEach((event) => {
            xamba.on(event, async () => {
                if (['development', 'deploy', 'build'].includes(xamba.mode)) {
                    await xamba.emit('clear', xamba.options.output);
                }
            });
        });
        xamba.on('clear', (dir, verbose = false) => {
            return new Promise((resolve) => {
                let loader;
                let relativePath = dir.replace(os.homedir(), '~');
                if (verbose) loader = ora(`Cleaning folder ${chalk.bold(relativePath)}...`).start();
                fse.emptyDir(dir).then(() => {
                    resolve();
                    if (verbose) loader.succeed(`Dir ${chalk.bold(relativePath)} is cleaned.`);
                });
            });
        });
    }
};

export default Clear