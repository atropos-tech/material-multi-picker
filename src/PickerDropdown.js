import React from "react";
import { Paper, MenuItem, LinearProgress, Typography } from "@material-ui/core";
import LOADING from "./symbols";

const isError = possibleError => possibleError instanceof Error;

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

function PickerSuggestions({ suggestions, getItemProps, highlightedIndex, itemToString }) {
    if ( isError(suggestions) ) {
        return ERROR_MESSAGE;
    }
    if ( Array.isArray(suggestions) ) {
        return (
            <>
                {
                    suggestions.map((item, index) => {
                        const itemProps = getItemProps({
                            index,
                            item,
                            style: {
                                backgroundColor: highlightedIndex === index ? "lightgray" : "white"
                            },
                        });
                        const itemString = itemToString(item);
                        return <MenuItem className="suggestion" key={ itemString } {...itemProps}>{ itemString }</MenuItem>;
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

function PickerDropdown({ isOpen, suggestions, ...otherProps }) {
    if ( isOpen && suggestions ) {
        return (
            <Paper square style={ { position: "absolute", zIndex: 100, width: "100%" } }>
                <PickerSuggestions suggestions={ suggestions } {...otherProps} />
            </Paper>
        );
    }
    return false;
}

export default PickerDropdown;
