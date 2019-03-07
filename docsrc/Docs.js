import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Typography, Link } from "@material-ui/core";
import { blue, red } from "@material-ui/core/colors";
import packageDetails from "../package.json";
import { hot } from "react-hot-loader/root";

import Demos from "./demos";

import Markdown from "./MaterialMarkdown";
import readmeMarkdown from "../README.md";

import Sandbox from "./Sandbox";

const docsTheme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: red
    },
    typography: {
        useNextVariants: true,
    }
});

function Docs() {
    const npmUrl = `https://www.npmjs.com/package/${ packageDetails.name }`;
    const githubUrl = packageDetails.repository.url;
    const changelogUrl = `${githubUrl}/blob/master/CHANGELOG.md`;
    return (
        <MuiThemeProvider theme={ docsTheme }>
            <Typography component="div" style={ { maxWidth: "850px", margin: "0 auto", paddingBottom: "500px" } }>
                <Typography variant="h2">Material Multi Picker { packageDetails.version }</Typography>
                <div>
                    <Link href={ packageDetails.repository.url }>Github</Link>
                    &nbsp;&middot;&nbsp;
                    <Link href={ npmUrl }>NPM</Link>
                    &nbsp;&middot;&nbsp;
                    <Link href={ changelogUrl }>Changelog</Link>
                </div>

                <Markdown source={ readmeMarkdown } />

                <Demos />

                <Typography variant="h4">Sandbox</Typography>
                <Sandbox />
            </Typography>
        </MuiThemeProvider>
    );
}

export default hot(Docs);
