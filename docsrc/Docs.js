/* eslint-disable import/max-dependencies */

import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Typography, Link } from "@material-ui/core";
import { blue, red } from "@material-ui/core/colors";
import packageDetails from "../package.json";
import { hot } from "react-hot-loader/root";

import DemoSection from "./DemoSection";

import BasicDemo from "./demos/Basic.demo";
import ChipsWrapDemo from "./demos/ChipsWrap.demo";
import DisabledDemo from "./demos/Disabled.demo";
import ErrorDemo from "./demos/Error.demo";
import MinimumCharactersDemo from "./demos/MinimumCharacters.demo";
import ScrollableSuggestionsDemo from "./demos/ScrollableSuggestions.demo";
import AsynchronousDemo from "./demos/Asynchronous.demo";
import ThrottledDemo from "./demos/Throttled.demo";
import FetchErrorsDemo from "./demos/FetchErrors.demo";
import DynamicSuggestionsDemo from "./demos/DynamicSuggestions.demo";
import HelperTextDemo from "./demos/HelperText.demo";
import RequiredFieldDemo from "./demos/RequiredField.demo";
import CustomTextFieldDemo from "./demos/CustomTextField.demo";
import CustomSuggestionComponentDemo from "./demos/CustomSuggestionComponent.demo";
import CustomChipAppearanceDemo from "./demos/CustomChipAppearance.demo";
import GlobalCacheDemo from "./demos/GlobalCache.demo";
import ClearOnBlurDemo from "./demos/ClearOnBlur.demo";

import ReduxFormDemo from "./demos/ReduxForm.demo";

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
    const readmeUrl = `${githubUrl}/blob/master/README.md`;
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
                    <Link href={ readmeUrl }>Readme</Link>
                    &nbsp;&middot;&nbsp;
                    <Link href={ changelogUrl }>Changelog</Link>
                </div>
                <DemoSection title="Simple synchronous suggestion list" DemoComponent={ BasicDemo } />
                <DemoSection title="Chips wrap onto multiple lines" DemoComponent={ ChipsWrapDemo } />
                <DemoSection title="Can be disabled" DemoComponent={ DisabledDemo } />
                <DemoSection title="Shows error state" DemoComponent={ ErrorDemo } />
                <DemoSection title="Clearing the input field on blur" DemoComponent={ ClearOnBlurDemo } />

                <Typography variant="h4">Providing suggestions</Typography>
                <DemoSection title="Minimum input length for suggestions" DemoComponent={ MinimumCharactersDemo } />
                <DemoSection title="Asynchronous suggestion list" DemoComponent={ AsynchronousDemo } />
                <DemoSection title="Throttling requests" DemoComponent={ ThrottledDemo } />
                <DemoSection title="Handle suggestion fetch errors" DemoComponent={ FetchErrorsDemo } />
                <DemoSection title="Dynamically generated suggestions" DemoComponent={ DynamicSuggestionsDemo } />
                <DemoSection title="Scrollable dropdown" DemoComponent={ ScrollableSuggestionsDemo } />

                <Typography variant="h4">Customising presentation</Typography>
                <DemoSection title="With helper text" DemoComponent={ HelperTextDemo } />
                <DemoSection title="Required field indicator" DemoComponent={ RequiredFieldDemo } />
                <DemoSection title="Custom field appearance" DemoComponent={ CustomTextFieldDemo } />
                <DemoSection title="Custom suggestion components" DemoComponent={ CustomSuggestionComponentDemo } />
                <DemoSection title="Custom chip appearance" DemoComponent={ CustomChipAppearanceDemo } />

                <Typography variant="h4">Integration</Typography>
                <DemoSection title="Redux Form" DemoComponent={ ReduxFormDemo } />

                <Typography variant="h4">Performance</Typography>
                <DemoSection title="Global cache" DemoComponent={ GlobalCacheDemo } />

                <Typography variant="h4">Sandbox</Typography>
                <Sandbox />
            </Typography>
        </MuiThemeProvider>
    );
}

export default hot(Docs);

