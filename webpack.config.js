/* eslint-env node */
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */

const { join } = require("path");

module.exports = {
    entry: "./docsrc/index.js",
    devtool: "inline-cheap-source-map",
    output: {
        path: join(__dirname, "docs"),
        filename: "docs-bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /\.demo.js$/],
                use: {
                    loader: "babel-loader",
                }
            },
            {
                test: /\.demo.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: "demo-source-loader"
                }, {
                    loader: "babel-loader",
                }]
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: {
                    loader: "file-loader",
                }
            },
            {
                test: /\.md$/,
                exclude: /node_modules/,
                use: {
                    loader: "raw-loader",
                }
            }
        ]
    },
    devServer: {
        contentBase: join(__dirname, "public"),
        hot: true
    }
};
