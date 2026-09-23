const {JSDefenderWebpackPlugin} = require("@preemptive/jsdefender-webpack-plugin");

module.exports = {
    plugins: [
        new JSDefenderWebpackPlugin({
            configurationFile: 'jsdefender.config.json',
            quietMode: false,
            enableInDevelopmentMode: true,
            excludeChunks: ['vendor', 'scripts', 'common', 'runtime', 'polyfills', 'polyfills-es5', 'styles', 'inline']
        })
    ]
}
