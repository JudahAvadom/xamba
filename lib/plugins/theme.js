import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
class Theme {
  static async apply() {
    xamba.on('webpack.config', async(webpackConfig) => {
      if (xamba.themeDir) {
        const Wbp = await webpackConfig;
        let themeScript = path.join(xamba.themeDir, 'theme');
        try {
          require.resolve(themeScript);
          Wbp.default.entry['app'].push(themeScript);
        } catch (e) {
          console.log(e);
        }
      }
    });
  }
}

export default Theme