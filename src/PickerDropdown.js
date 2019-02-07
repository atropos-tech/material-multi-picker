import React from "react";
import { Paper } from "@material-ui/core";
import PickerSuggestions from "./PickerSuggestions";
import { bool, array, oneOfType, symbol } from "prop-types";

function PickerDropdown({ isOpen = false, suggestions, ...otherProps }) {
    if ( isOpen && suggestions ) {
        return (
            <Paper square style={ { position: "absolute", zIndex: 100, width: "100%" } }>
                <PickerSuggestions suggestions={ suggestions } {...otherProps} />
            </Paper>
        );
    }
    return false;
}

PickerDropdown.propTypes = {
    isOpen: bool,
    suggestions: oneOfType([array, symbol])
};

export default PickerDropdown;
