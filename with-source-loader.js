/* eslint-env node */
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */
const { readFile } = require("fs");
const escapeSource = require("js-string-escape");

module.exports = function withSourceLoader(content, map, meta) {
    const onComplete = this.async();
    const fileName = this.resource;
    readFile(fileName, (error, fileContents) => {
        if ( error ) {
            return onComplete(error);
        }
        const extraExport = `export const rawSource = "${ escapeSource(fileContents)}";`;
        const newContent = `${ content }\n\n${ extraExport }`;

        onComplete(null, newContent, map, meta);
    });
};
