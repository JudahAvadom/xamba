class Deploy {
    static apply() {
        xamba.on('deploy.done',()=>{
            console.log("Deploy Done");
        })
        xamba.on('deploy',async ()=>{
            console.log("Deploy");
        })
    }
}

export default Deploy