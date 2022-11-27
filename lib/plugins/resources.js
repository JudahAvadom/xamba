class Resources {
    static apply() {
        xamba.on('webpack', async () => {
            if (['production', 'build', 'deploy'].includes(xamba.mode)) {
                await xamba.emit('resources');
                await this.copy();
            }
        });
    }
    static async copy(){
        xamba.loader.start('Loading resources…');
    }
}

export default Resources