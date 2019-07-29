import React from "react";
import { Paper } from "@material-ui/core";
import PickerSuggestions from "./PickerSuggestions";
import { bool, number, string, array, func } from "prop-types";
import debounceRender from "react-debounce-render";
import useCachedSuggestions from "./useCachedSuggestions";

const DELAYED_RENDER_MILLISECONDS = 30;

const DROPDOWN_STYLE = {
    position: "absolute",
    zIndex: 20,
    width: "100%",
    overflowY: "auto",
    padding: 0,
    margin: 0
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

function useUnpickedSuggestions(isReadyToLoad, inputValue, pickedItems, getSuggestedItems, itemToString, useGlobalCache, fetchDelay) {
    const suggestions = useCachedSuggestions(isReadyToLoad, inputValue, pickedItems, getSuggestedItems, useGlobalCache, fetchDelay);
    if (Array.isArray(suggestions) && Array.isArray(pickedItems)) {
        const pickedItemIds = pickedItems.map(item => itemToString(item));
        const isUnpicked = suggestion => !pickedItemIds.includes(itemToString(suggestion));
        return suggestions.filter(isUnpicked);
    }
    return suggestions;
}

function getDropdownStyle(anchorElement, maxHeight) {
    const dropdownPositionStyle = getDropdownPositionStyle(anchorElement);
    const dropdownMaxHeightStyle = maxHeight ? { maxHeight } : {};
    return { ...DROPDOWN_STYLE, ...dropdownPositionStyle, ...dropdownMaxHeightStyle };
}

function Dropdown({ isOpen, suggestions, anchorElement, maxHeight, ...otherProps }) {
    if ( isOpen && suggestions ) {
        const dropdownStyle = getDropdownStyle(anchorElement, maxHeight);
        return (
            <Paper role="menu" component="ul" square style={ dropdownStyle }>
                <PickerSuggestions suggestions={ suggestions } { ...otherProps } />
            </Paper>
        );
    }
    return false;
}

Dropdown.propTypes = {
    isOpen: bool,
    maxHeight: number
};

const DebouncedDropdown = debounceRender(Dropdown, DELAYED_RENDER_MILLISECONDS);

function PickerDropdown(props) {
    const { isOpen, inputValue, pickedItems, getSuggestedItems, itemToString, useGlobalCache, fetchDelay } = props;
    const suggestions = useUnpickedSuggestions(isOpen, inputValue, pickedItems, getSuggestedItems, itemToString, useGlobalCache, fetchDelay);

    return <DebouncedDropdown {...props} suggestions={ suggestions } />;
}

PickerDropdown.propTypes = {
    isOpen: bool,
    inputValue: string,
    pickedItems: array,
    getSuggestedItems: func.isRequired,
    itemToString: func.isRequired,
    useGlobalCache: string,
    fetchDelay: number
};

export default PickerDropdown;
