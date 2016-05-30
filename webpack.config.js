var path = require("path");
var webpack = require('webpack');

module.exports = {
    entry: {
        "react": "./src/react.js",
        "react-lite": "./src/react-lite.js",
        "vue": "./src/vue.js",
    },
    output: {
        filename: "[name].js",
        path: path.resolve("dist")
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel" },
        ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({}),
    ],
}
