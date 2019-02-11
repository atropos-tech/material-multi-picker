/* eslint-disable import/named */
/* eslint-disable import/max-dependencies */

import React from "react";
import { render } from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { blue, red } from "@material-ui/core/colors";

import DemoSection from "./DemoSection";

import BasicDemo, { rawSource as basicDemoSource } from "./Basic.demo";
import ChipsWrapDemo, { rawSource as chipsWrapSource } from "./ChipsWrap.demo";
import MinimumCharactersDemo, { rawSource as minimumCharactersSource } from "./MinimumCharacters.demo";
import AsynchronousDemo, { rawSource as asynchonousSource } from "./Asynchronous.demo";
import ThrottledDemo, { rawSource as throttledSource } from "./Throttled.demo";
import FetchErrors, { rawSource as fetchErrorsSource } from "./FetchErrors.demo";
import DynamicSuggestions, { rawSource as dynamicSuggestionsSource } from "./DynamicSuggestions.demo";
import CustomSuggestionComponent, { rawSource as customSuggestionComponentSource } from "./CustomSuggestionComponent.demo";
import CustomChipApperance, { rawSource as customChipAppearanceSource } from "./CustomChipAppearance.demo";

const sandboxTheme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: red
    },
    typography: {
        useNextVariants: true,
    }
});

function Sandbox() {
    return (
        <MuiThemeProvider theme={ sandboxTheme }>
            <Typography style={ { maxWidth: "750px", margin: "0 auto", paddingBottom: "500px" } }>
                <Typography variant="h2">Material Multi Picker</Typography>
                <DemoSection title="Simple synchronous suggestion list" DemoComponent={ BasicDemo } demoSource={ basicDemoSource }>
                    Uses a simple in-memory list, with lower-case string matching.
                </DemoSection>
                <DemoSection title="Chips wrap onto multiple lines" DemoComponent={ ChipsWrapDemo } demoSource={ chipsWrapSource } />

                <Typography variant="h4">Providing suggestions</Typography>
                <DemoSection title="Minimum input length for suggestions" DemoComponent={ MinimumCharactersDemo } demoSource={ minimumCharactersSource } />
                <DemoSection title="Asynchronous suggestion list" DemoComponent={ AsynchronousDemo } demoSource={ asynchonousSource } />
                <DemoSection title="Throttling requests" DemoComponent={ ThrottledDemo } demoSource={ throttledSource } />
                <DemoSection title="Handle suggestion fetch errors" DemoComponent={ FetchErrors } demoSource={ fetchErrorsSource } />
                <DemoSection title="Dynamically generated suggestions" DemoComponent={ DynamicSuggestions } demoSource={ dynamicSuggestionsSource } />

                <Typography variant="h4">Customising presentation</Typography>
                <DemoSection title="Custom suggestion components" DemoComponent={ CustomSuggestionComponent } demoSource={ customSuggestionComponentSource } />
                <DemoSection title="Custom chip apperance" DemoComponent={ CustomChipApperance } demoSource={ customChipAppearanceSource } />
            </Typography>
        </MuiThemeProvider>
    );
}

render(<Sandbox />, document.getElementById("sandbox"));
