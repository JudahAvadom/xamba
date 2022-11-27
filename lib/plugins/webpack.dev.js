import webpack from 'webpack'
import path from 'path'

class WebpackDev {
    static apply() {
        xamba.on('webpack', async ({ mode }) => {
            if (mode == 'development') {
                await this.webpackDev();
            }
        });
    }
    static async webpackDev(){
        xamba.webpackConfig = import("../../webpack.dev.js");
        await xamba.emit('webpack.config', xamba.webpackConfig);
        await xamba.emit('preload');
    }
}

export default WebpackDev