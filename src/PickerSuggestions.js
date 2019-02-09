import React from "react";
import { MenuItem, LinearProgress, Typography } from "@material-ui/core";
import { LOADING, isError } from "./utils";
import { string, array, func, number, any, oneOfType, symbol } from "prop-types";

const REMOVE_PADDING = { padding: 0, height: "auto" };

const LOADING_MESSAGE = (
    <>
        <Typography variant='h6' align="center" gutterBottom>
            Loading suggestions&hellip;
        </Typography>
        <LinearProgress />
    </>
);

function DefaultSuggestion({ itemId }) {
    return <Typography style={ { padding: "11px 16px" } }>{ itemId }</Typography>;
}

function DefaultEmptyMessage({ inputValue }) {
    return (
        <Typography variant='subtitle1' align="center" className='no-suggestions-message'>
            No suggestions found for <strong>{ inputValue }</strong>
        </Typography>
    );
}

DefaultEmptyMessage.propTypes = {
    inputValue: string.isRequired
};

DefaultSuggestion.propTypes = {
    itemId: string.isRequired
};

function DefaultError() {
    return (
        <Typography variant='h6' align="center" gutterBottom className='suggestion-error-message'>
            An error occurred!
        </Typography>
    );
}

function PickerSuggestions(
    { suggestions, getItemProps, highlightedIndex, itemToString, inputValue, selectedItems, SuggestionComponent = DefaultSuggestion, ErrorComponent = DefaultError }
) {
    if ( isError(suggestions) ) {
        return (<ErrorComponent error={ suggestions } />);
    }
    if ( Array.isArray(suggestions) ) {
        if ( suggestions.length ) {
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
        if ( inputValue.length ) {
            return <DefaultEmptyMessage inputValue={ inputValue } />;
        }
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
    SuggestionComponent: any,
    ErrorComponent: any
};

export default PickerSuggestions;
