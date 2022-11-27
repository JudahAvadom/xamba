import fs from "fs"
import path from "path"
import chalk from "chalk"

export default function SiteQuestin() {
    return [
        {
            type: 'input',
            name: 'sitename',
            default: xamba.options._[1],
            message: 'Shortname of new site (dir to be created):',
            validate(sitename) {
                let done = this.async();
                if (sitename.match(/^\s*$/)) {
                    done('Can\'t be empty.');
                }
                let newSitePath = path.join(process.cwd(), sitename);
                fs.access(newSitePath, (err) => {
                    if (err) { // Directory not exists
                        done(null, true);
                    } else {
                        done(`Directory exists in current folder! Try again.\n${chalk.bold(newSitePath)}.`);
                    }
                });
            },
        },
    ];
}