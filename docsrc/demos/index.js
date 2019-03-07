/* eslint-disable import/max-dependencies */

import React from "react";
import { Typography } from "@material-ui/core";

import DemoSection from "./DemoSection";

import BasicDemo from "./Basic.demo";
import ChipsWrapDemo from "./ChipsWrap.demo";
import AutoFocusDemo from "./AutoFocus.demo";
import DisabledDemo from "./Disabled.demo";
import ErrorDemo from "./Error.demo";
import MinimumCharactersDemo from "./MinimumCharacters.demo";
import ScrollableSuggestionsDemo from "./ScrollableSuggestions.demo";
import AsynchronousDemo from "./Asynchronous.demo";
import ThrottledDemo from "./Throttled.demo";
import FetchErrorsDemo from "./FetchErrors.demo";
import DynamicSuggestionsDemo from "./DynamicSuggestions.demo";
import HelperTextDemo from "./HelperText.demo";
import RequiredFieldDemo from "./RequiredField.demo";
import CustomTextFieldDemo from "./CustomTextField.demo";
import CustomSuggestionComponentDemo from "./CustomSuggestionComponent.demo";
import CustomChipAppearanceDemo from "./CustomChipAppearance.demo";
import GlobalCacheDemo from "./GlobalCache.demo";
import ClearOnBlurDemo from "./ClearOnBlur.demo";

import ReduxFormDemo from "./ReduxForm.demo";

export default function Demos() {
    return (
        <section>
            <Typography variant="h4">Demos</Typography>
            <DemoSection title="Simple synchronous suggestion list" DemoComponent={ BasicDemo } />
            <DemoSection title="Chips wrap onto multiple lines" DemoComponent={ ChipsWrapDemo } />
            <DemoSection title="Can be disabled" DemoComponent={ DisabledDemo } />
            <DemoSection title="Shows error state" DemoComponent={ ErrorDemo } />
            <DemoSection title="Clearing the input field on blur" DemoComponent={ ClearOnBlurDemo } />
            <DemoSection title="Can auto focus on mount" DemoComponent={ AutoFocusDemo } />

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
        </section>
    );
}


