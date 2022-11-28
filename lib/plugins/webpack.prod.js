class WebpackProd {
    static apply() {
        xamba.on('webpack', async ({ mode }) => {
            if (mode == 'production') {
                await this.StartwebpackProd();
            }
        });
        xamba.on('build.done', async () => {
            console.log("build done");
        });
        xamba.on('server.listen', () => {
            console.log("server listen");
        });
    }
    static StartwebpackProd(){
        console.log("webpackProd");
    }
}

export default WebpackProd