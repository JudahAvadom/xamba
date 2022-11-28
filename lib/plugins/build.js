class Build {
    static async apply() {
        xamba.on('build',()=>{
            console.log("Build");
            //this.build();
        });
    }
}

export default Build