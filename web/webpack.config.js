const path = require('path');

const config = {
  entry: path.resolve(__dirname, 'src/client'),
  output: {
    path: path.resolve(__dirname, 'static/gen'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: { presets: ["env"] }
        }
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      }
    ]
  }
}

module.exports = config
