import React from "react";
import { MenuItem, LinearProgress, Typography } from "@material-ui/core";
import LOADING from "./symbols";
import { string, array, func, number, any, oneOfType, symbol } from "prop-types";

const isError = possibleError => possibleError instanceof Error;
const REMOVE_PADDING = { padding: 0, height: "auto" };

const LOADING_MESSAGE = (
    <>
        <Typography variant='h6' align="center" gutterBottom>
            Loading suggestions&hellip;
        </Typography>
        <LinearProgress />
    </>
);

const ERROR_MESSAGE = (
    <>
        <Typography variant='h6' align="center" gutterBottom className='suggestion-error-message'>
            An error occurred!
        </Typography>
    </>
);

function DefaultSuggestion({ itemId }) {
    //TODO use theme spacing
    return <Typography style={ { padding: "11px 16px" } }>{ itemId }</Typography>;
}

DefaultSuggestion.propTypes = {
    itemId: string.isRequired
};

function PickerSuggestions({ suggestions, getItemProps, highlightedIndex, itemToString, inputValue, selectedItems, SuggestionComponent = DefaultSuggestion }) {
    if ( isError(suggestions) ) {
        return ERROR_MESSAGE;
    }
    if ( Array.isArray(suggestions) ) {
        return (
            <>
                {
                    suggestions.map((item, index) => {
                        const itemId = itemToString(item);
                        const isHighlighted = highlightedIndex === index;
                        const isSelected = selectedItems.map(itemToString).includes(itemId);

                        const menuItemProps = getItemProps({
                            index,
                            item,
                            style: {
                                backgroundColor: isHighlighted ? "lightgray" : "white"
                            },
                        });
                        return (
                            <MenuItem className="suggestion" key={ itemId } {...menuItemProps} style={ REMOVE_PADDING }>
                                <SuggestionComponent itemId={ itemId } item={ item } isHighlighted={ isHighlighted } inputValue={ inputValue } isSelected={ isSelected } />
                            </MenuItem>
                        );
                    })
                }
            </>
        );
    }
    if ( suggestions === LOADING ) {
        return LOADING_MESSAGE;
    }
    throw new Error("should never happen!");
}

PickerSuggestions.propTypes = {
    suggestions: oneOfType([array, symbol]),
    getItemProps: func.isRequired,
    highlightedIndex: number,
    itemToString: func.isRequired,
    inputValue: string.isRequired,
    selectedItems: array.isRequired,
    SuggestionComponent: any
};

export default PickerSuggestions;