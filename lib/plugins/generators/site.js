import path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import inquirer from "inquirer"
import ora from 'ora'
import prettyMs from 'pretty-ms'
import pIteration from 'p-iteration'
import chalk from "chalk"
import now from 'performance-now'
import SiteQuestin from "./questions/siteQuestion.js";

const { forEach } = pIteration

class Site {
    static apply() {
        xamba.on('generators.site', async () => {
            await this.generate();
        });
    }
    static async generate() {
        let start, sitename, sitepath, loader, answers;
        if (xamba.options._[1]) {
            sitename = xamba.options._[1];
        }
        else {
            let questions = SiteQuestin();
            try {
                answers = await inquirer.prompt(questions);
            } catch (e) { console.error(e.message); }
            sitename = answers.sitename;
        }
        sitename = sitename.toLowerCase().replace(/[^a-z\._-]/, '');
        sitepath = path.join(process.cwd(), sitename);
        start = now();
        loader = ora('Crafting new site...').start();
        if (fs.existsSync(sitepath)) {
            loader.fail(`Target directory exists.${chalk.yellow('Try to change site name or remove the directory.')}`);
        }
        fse.ensureDirSync(sitepath);
        await forEach([
            path.join(xamba.baseDir, 'lib', 'plugins', 'generators', 'templates', 'site', 'src'),
            path.join(xamba.baseDir, 'lib', 'plugins', 'generators', 'templates', 'site', 'config.yaml'),
            path.join(xamba.baseDir, 'lib', 'plugins', 'generators', 'templates', 'site', 'themes')
            // path.join(xamba.baseDir,'.gitignore')
        ], (dirfile) => {
            try {
                fse.copySync(
                    dirfile,
                    path.join(
                        sitepath,
                        path.basename(dirfile)
                    )
                );
            } catch (err) {
                console.error(err);
            }
        });
    }
}

export default Site;