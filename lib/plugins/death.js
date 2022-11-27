import boxen from "boxen"
import chalk from "chalk"

class Death {
    static apply() {
        process.on('SIGINT', async () => {
            console.log('\n' + boxen(`Visit ${chalk.bold.whiteBright(URL)} to stay tuned!`, { align: 'center', padding: { top: 2, bottom: 2, left: 10, right: 10 }, borderColor: 'magenta', dimBorder: true, borderStyle: 'double' }));
            await xamba.emit('death');
            process.exit();
        });
    }
}

export default Death