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

function getDropdownPositionStyle(anchorElement) {
    if ( anchorElement && anchorElement.offsetParent ) {
        const { offsetParent } = anchorElement;
        return {
            left: offsetParent.offsetLeft,
            right: offsetParent.offsetLeft + offsetParent.offsetWidth,
            top: offsetParent.offsetTop + offsetParent.offsetHeight
        };
    }
    return {};
}

function PickerDropdown({ isOpen, suggestions, maxHeight, anchorElement, ...otherProps }) {
    if ( isOpen && suggestions ) {
        const dropdownPositionStyle = getDropdownPositionStyle(anchorElement);
        const dropdownMaxHeightStyle = maxHeight ? { maxHeight } : {};
        const dropdownStyle = { ...DROPDOWN_STYLE, ...dropdownPositionStyle, ...dropdownMaxHeightStyle };
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
