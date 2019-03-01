import React from "react";
import { Paper } from "@material-ui/core";
import PickerSuggestions from "./PickerSuggestions";
import { bool, number } from "prop-types";
import { suggestionsPropType } from "../utils";
import debounceRender from "react-debounce-render";

const DELAYED_RENDER_MILLISECONDS = 50;

const DROPDOWN_STYLE = {
    position: "absolute",
    zIndex: 20,
    width: "100%",
    overflowY: "auto"
};

function PickerDropdown({ isOpen, suggestions, maxHeight, ...otherProps }) {
    if ( isOpen && suggestions ) {
        const dropdownStyle = maxHeight ?
            { ...DROPDOWN_STYLE, maxHeight } :
            DROPDOWN_STYLE;
        return (
            <Paper square style={ dropdownStyle }>
                <PickerSuggestions suggestions={ suggestions } { ...otherProps } />
            </Paper>
        );
    }
    return false;
}

PickerDropdown.propTypes = {
    isOpen: bool,
    suggestions: suggestionsPropType,
    maxHeight: number
};

export default debounceRender(PickerDropdown, DELAYED_RENDER_MILLISECONDS);
