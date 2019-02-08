
/* eslint-env node */
/* eslint-disable import/no-commonjs */

const SANDBOX_CONFIG = {
    "presets": ["@babel/preset-env", "@babel/preset-react"]
};

const TEST_CONFIG = {
    "presets": [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-react"
    ]
};

module.exports = api => {
    const isTestEnv = api.env("test");
    return isTestEnv ? TEST_CONFIG : SANDBOX_CONFIG;
};
