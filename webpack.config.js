var path = require('path')

module.exports = {
    entry: {
        'editor': './ui/editor/index.js',
        'flow': './ui/flow/index.js',

    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
}