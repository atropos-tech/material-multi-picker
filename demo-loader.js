/* eslint-env node */
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */

const { readFile, access } = require("fs");
const escapeSource = require("js-string-escape");
const { stringifyRequest } = require("loader-utils");

function fetchRawSource(sourceFilename) {
    return new Promise((resolve, reject) => {
        readFile(sourceFilename, (error, fileContents) => {
            if ( error ) {
                return reject(error);
            }
            resolve( fileContents );
        });
    });
}

function getMarkdownFilename(sourceFilename) {
    const withoutJsExtension = sourceFilename.replace(/\.js$/, "");
    return `${withoutJsExtension}.md`;
}

function fetchMarkdown(sourceFilename, context) {
    const markdownFilename = getMarkdownFilename(sourceFilename);
    return new Promise((resolve, reject) => {
        access(markdownFilename, error => {
            if (error) {
                resolve(undefined);
            } else {
                context.addDependency(markdownFilename);
                readFile(markdownFilename, (readError, fileContents) => {
                    if ( readError ) {
                        return reject(readError);
                    }
                    resolve( fileContents );
                });
            }
        });
    });
}

module.exports = function empty() { /* do nothing */ };

const getWrapperModule = (requestString, rawSource, markdown = "") => `        
    module.exports = require(${requestString});
    const rawSource = "${ escapeSource(rawSource) }";
    const markdown = "${ escapeSource(markdown) }";
    if (module.exports.default) {
        module.exports.default.__source__ = rawSource;
        module.exports.default.__markdown__ = markdown;
    }
    module.exports.__source = rawSource;
    module.exports.__markdown__ = markdown;
`;

module.exports.pitch = function withSourceLoader(remainingRequest) {
    const onComplete = this.async();
    const resourceFileLocation = this.resource;
    Promise.all([ fetchRawSource(resourceFileLocation), fetchMarkdown(resourceFileLocation, this) ]).then(( [ rawSource, markdown ]) => {
        const stringRequest = stringifyRequest(this, "!!" + remainingRequest);
        const wrapperModuleSource = getWrapperModule(stringRequest, rawSource, markdown);
        onComplete(null, wrapperModuleSource);
    }).catch(error => {
        onComplete(error);
    });
};

