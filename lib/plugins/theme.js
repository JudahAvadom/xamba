import path from 'path';
class Theme {
    static apply() {
        xamba.on('webpack.config',(webpackConfig)=>{
            if(xamba.themeDir){
              let themeScript = path.join(xamba.themeDir,'theme');
              try {
                require.resolve(themeScript);
                webpackConfig.entry['app'].push(themeScript);
              } catch (e){
                console.log(e);
              }
            }
          });
    }
}

export default Theme