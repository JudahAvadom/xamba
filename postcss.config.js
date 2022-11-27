export default {
    plugins: () => [
        require('postcss-import')(),
        require('postcss-preset-env')(),
        require('cssnano')()
    ]
};