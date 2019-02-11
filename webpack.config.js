/* eslint-env node */
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */

const { join, resolve } = require("path");

module.exports = {
    entry: "./src/sandbox/index.js",
    devtool: "inline-cheap-source-map",
    output: {
        path: join(__dirname, "dist"),
        filename: "sandbox-bundle.js"
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
                    loader: "babel-loader",
                }, {
                    loader: resolve("./with-source-loader.js"),
                }]
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: {
                    loader: "file-loader",
                }
            }
        ]
    },
    devServer: {
        contentBase: join(__dirname, "public")
    }
};
