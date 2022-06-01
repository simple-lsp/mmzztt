const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  productionSourceMap: false,
  filenameHashing: false,
  outputDir: 'extension/mzt',
  pages: {
    'background': {
      entry: 'extension/src/background.js'
    },
    'mzt-dom': {
      entry: 'extension/src/mzt-dom.js'
    },
    'mzt-dom-script': {
      entry: 'extension/src/mzt-dom-script.js'
    }
  },
  configureWebpack: {
    performance: {hints: false},
    plugins: [new CopyPlugin({
      patterns: [
        {from: 'extension/public/*', to: '[name][ext]'},
        {from: 'extension/src/hack/*', to: 'hack/[name][ext]'}
      ]
    })]
  },
  chainWebpack: config => {
    config.optimization.delete('splitChunks')
    config.plugins
      .delete('html-background')
      .delete('html-mzt-dom')
      .delete('html-mzt-dom-script')
  }
}