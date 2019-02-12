import React from "react";
import { Paper } from "@material-ui/core";
import PickerSuggestions from "./PickerSuggestions";
import { bool } from "prop-types";
import { suggestionsPropType } from "../utils";
import debounceRender from "react-debounce-render";

const DELAYED_RENDER_MILLISECONDS = 50;

const DROPDOWN_STYLE = {
    position: "absolute",
    zIndex: 20,
    width: "100%"
};

function PickerDropdown({ isOpen, suggestions, ...otherProps }) {
    if ( isOpen && suggestions ) {
        return (
            <Paper square style={ DROPDOWN_STYLE }>
                <PickerSuggestions suggestions={ suggestions } { ...otherProps } />
            </Paper>
        );
    }
    return false;
}

PickerDropdown.propTypes = {
    isOpen: bool,
    suggestions: suggestionsPropType
};

export default debounceRender(PickerDropdown, DELAYED_RENDER_MILLISECONDS);
