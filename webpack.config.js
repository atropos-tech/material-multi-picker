/* eslint-env node */
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */

const { join } = require("path");

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
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
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
        contentBase: join(__dirname, "public"),
        host: "0.0.0.0"
    }
};
