/* eslint-disable import/named */
/* eslint-disable import/max-dependencies */

import React from "react";
import { render } from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Typography, Link } from "@material-ui/core";
import { blue, red } from "@material-ui/core/colors";
import packageDetails from "../package.json";

import DemoSection from "./DemoSection";

import BasicDemo from "./demos/Basic.demo";
import ChipsWrapDemo from "./demos/ChipsWrap.demo";
import DisabledDemo from "./demos/Disabled.demo";
import MinimumCharactersDemo from "./demos/MinimumCharacters.demo";
import AsynchronousDemo from "./demos/Asynchronous.demo";
import ThrottledDemo from "./demos/Throttled.demo";
import FetchErrors from "./demos/FetchErrors.demo";
import DynamicSuggestions from "./demos/DynamicSuggestions.demo";
import CustomSuggestionComponent from "./demos/CustomSuggestionComponent.demo";
import CustomChipAppearance from "./demos/CustomChipAppearance.demo";
import GlobalCache from "./demos/GlobalCache.demo";
import ClearOnBlurDemo from "./demos/ClearOnBlur.demo.js";

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
    const readmeUrl = `${githubUrl}/blob/master/README.md`;
    const changelogUrl = `${githubUrl}/blob/master/CHANGELOG.md`;
    return (
        <MuiThemeProvider theme={ docsTheme }>
            <Typography component="div" style={ { maxWidth: "750px", margin: "0 auto", paddingBottom: "500px" } }>
                <Typography variant="h2">Material Multi Picker { packageDetails.version }</Typography>
                <div>
                    <Link href={ packageDetails.repository.url }>Github</Link>
                    &nbsp;&middot;&nbsp;
                    <Link href={ npmUrl }>NPM</Link>
                    &nbsp;&middot;&nbsp;
                    <Link href={ readmeUrl }>Readme</Link>
                    &nbsp;&middot;&nbsp;
                    <Link href={ changelogUrl }>Changelog</Link>
                </div>
                <DemoSection title="Simple synchronous suggestion list" DemoComponent={ BasicDemo } />
                <DemoSection title="Chips wrap onto multiple lines" DemoComponent={ ChipsWrapDemo } />
                <DemoSection title="Can be disabled" DemoComponent={ DisabledDemo } />
                <DemoSection title="Clearing the input field on blur" DemoComponent={ ClearOnBlurDemo } />

                <Typography variant="h4">Providing suggestions</Typography>
                <DemoSection title="Minimum input length for suggestions" DemoComponent={ MinimumCharactersDemo } />
                <DemoSection title="Asynchronous suggestion list" DemoComponent={ AsynchronousDemo } />
                <DemoSection title="Throttling requests" DemoComponent={ ThrottledDemo } />
                <DemoSection title="Handle suggestion fetch errors" DemoComponent={ FetchErrors } />
                <DemoSection title="Dynamically generated suggestions" DemoComponent={ DynamicSuggestions } />

                <Typography variant="h4">Customising presentation</Typography>
                <DemoSection title="Custom suggestion components" DemoComponent={ CustomSuggestionComponent } />
                <DemoSection title="Custom chip appearance" DemoComponent={ CustomChipAppearance } />

                <Typography variant="h4">Performance</Typography>
                <DemoSection title="Global cache" DemoComponent={ GlobalCache } />
            </Typography>
        </MuiThemeProvider>
    );
}

render(<Docs />, document.getElementById("docs"));
