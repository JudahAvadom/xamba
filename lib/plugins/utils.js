import path from 'path';
import jsonfile from 'jsonfile';

class Utils {
    static apply() {
        xamba.requirePackageJSON = (pkgPath)=>{
            pkgPath = pkgPath || path.join(xamba.baseDir,'package.json');
            let pkg;
            try {
              pkg = jsonfile.readFileSync(pkgPath);
            } catch (e){
              console.error(e);
            }
            return pkg;
          };
    }
}

export default Utils