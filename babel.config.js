
/* eslint-env node */
/* eslint-disable import/no-commonjs */

const DEVELOP_CONFIG = {
    "presets": ["@babel/preset-env", "@babel/preset-react"],
    "plugins": ["react-hot-loader/babel"]
};

// exclude the react-hot-loader when transpiling for publish
const PRODUCTION_CONFIG = {
    "presets": ["@babel/preset-env", "@babel/preset-react"]
};

// we need a seperate config for test because Jest no longer packages
// the regenerator runtime, so support for async functions has to be
// grabbed from NodeJS, which requires extra configuration that won't
// work for browsers!
const TEST_CONFIG = {
    "presets": [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-react"
    ]
};

module.exports = api => {
    if (api.env("test")) {
        return TEST_CONFIG;
    }
    if ( api.env("production")) {
        return PRODUCTION_CONFIG;
    }
    return DEVELOP_CONFIG;
};
