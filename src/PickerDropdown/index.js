import React from "react";
import { createPortal } from "react-dom";
import { Paper } from "@material-ui/core";
import PickerSuggestions from "./PickerSuggestions";
import { bool, number, string, array, func } from "prop-types";
import debounceRender from "react-debounce-render";
import useCachedSuggestions from "./useCachedSuggestions";

const DELAYED_RENDER_MILLISECONDS = 30;

const DROPDOWN_STYLE = {
    position: "absolute",
    zIndex: 1400,
    width: "100%",
    overflowY: "auto",
    padding: 0,
    margin: 0
};

function getRelativeDropdownPositionStyle(anchorElement) {
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

//adapted from https://plainjs.com/javascript/styles/get-the-position-of-an-element-relative-to-the-document-24/
function getDocumentBoundingRect(element) {
    const viewportRectangle = element.getBoundingClientRect();
    return {
        top: viewportRectangle.top + window.pageYOffset,
        left: viewportRectangle.left + window.pageXOffset,
        bottom: viewportRectangle.bottom + window.pageYOffset,
        right: viewportRectangle.left + window.pageXOffset,
        width: viewportRectangle.width,
        height: viewportRectangle.height
    };
}

function getViewportDropdownPositionStyle(anchorElement) {
    if ( anchorElement && anchorElement.offsetParent ) {
        const { offsetParent } = anchorElement;
        const anchorRectangle = getDocumentBoundingRect(offsetParent);

        return {
            left: anchorRectangle.left,
            width: anchorRectangle.width,
            top: anchorRectangle.bottom
        };
    }
    return {};
}

function getDropdownStyle(anchorElement, relativeToOffsetParent, maxHeight) {
    const dropdownPositionStyle = relativeToOffsetParent ? getRelativeDropdownPositionStyle(anchorElement) : getViewportDropdownPositionStyle(anchorElement);
    const dropdownMaxHeightStyle = maxHeight ? { maxHeight } : {};
    return {
        ...DROPDOWN_STYLE,
        ...dropdownPositionStyle,
        ...dropdownMaxHeightStyle
    };
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

function Dropdown({ isOpen, suggestions, anchorElement, maxHeight, disablePortals, ...otherProps }) {
    if ( isOpen && suggestions ) {
        const dropdownStyle = getDropdownStyle(anchorElement, disablePortals, maxHeight);
        const dropdown = (
            <Paper role="menu" component="ul" square style={ dropdownStyle }>
                <PickerSuggestions suggestions={ suggestions } { ...otherProps } />
            </Paper>
        );
        return disablePortals ? dropdown : createPortal(dropdown, document.body);
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
    fetchDelay: number,
    disablePortals: bool
};

export default PickerDropdown;
