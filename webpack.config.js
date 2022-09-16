const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.jsx'),
  output: {
    path: path.join(__dirname, './src'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { 
          loader: 'babel-loader',
        }
      }, 
      {
        test: /\.(sa|sc|c)ss$/, 
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  
  devServer: {
    static: {
      directory: path.resolve(__dirname, './public')
    },
    historyApiFallback: true,
    proxy: {
      '/': 'http://localhost:3000',
      secure: false
    },
  },
};