import fs from "fs"
import boxen from "boxen"
import chalk from "chalk"

class Init {
    static apply() {
        xamba.on('generators.init', type => this.init(type));
    }
    /**
     * Start the website generator
     * @param type String 
     */
    static init(type = 'site') {
        if(type == 'site' && (fs.existsSync('package.json') || fs.existsSync('.git'))){
            ora().fail(`New ${type} cannot be crafted in the project directory.\n(Avoid ${chalk.bold('.git')} folder or ${chalk.bold('package.json')} file).`);
            process.exit();
          }
        console.log(boxen(`Generating new ${type} with ${chalk.bold.whiteBright('Xamba.JS')}\n\nv${xamba.package.version}\n\n`, {
            padding: { top: 1, bottom: 1, left: 8, right: 8 },
            margin: 0,
            dimBorder: true,
            align: 'center',
            borderStyle: 'double',
            borderColor: 'magenta'
        }))
    }
}

export default Init