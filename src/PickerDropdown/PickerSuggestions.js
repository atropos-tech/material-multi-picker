import React from "react";
import { MenuItem, withStyles } from "@material-ui/core";
import { LOADING, NOT_ENOUGH_CHARACTERS, isError, suggestionsPropType } from "../utils";
import { string, func, number, any, object } from "prop-types";
import DefaultError from "./DefaultError";
import DefaultSuggestion from "./DefaultSuggestion";
import DefaultEmptyMessage from "./DefaultEmptyMessage";
import DefaultLoadingMessage from "./DefaultLoadingMessage";
import DefaultMoreCharactersMessage from "./DefaultMoreCharactersMessage";

const HIGHLIGHT_GREY_SHADE = 300;

const styles = theme => ({
    highlighted: {
        backgroundColor: theme.palette.grey[HIGHLIGHT_GREY_SHADE]
    }
});

function PickerSuggestions(
    { suggestions, getItemProps, highlightedIndex, itemToString, inputValue, SuggestionComponent = DefaultSuggestion, ErrorComponent = DefaultError, classes }
) {
    if ( isError(suggestions) ) {
        return (<ErrorComponent error={ suggestions } inputValue={ inputValue } />);
    }
    if ( suggestions === NOT_ENOUGH_CHARACTERS ) {
        return <DefaultMoreCharactersMessage />;
    }
    if ( suggestions === LOADING ) {
        return <DefaultLoadingMessage inputValue={ inputValue } />;
    }
    if ( Array.isArray(suggestions) ) {
        if ( suggestions.length ) {
            return (
                <>
                    {
                        suggestions.map((item, index) => {
                            const itemId = itemToString(item);
                            const isHighlighted = highlightedIndex === index;

                            const menuItemProps = getItemProps({
                                index,
                                item,
                                role: "menuitem",
                                className: isHighlighted ? classes.highlighted : "",
                                style: {
                                    padding: 0,
                                    height: "auto"
                                },
                            });
                            return (
                                <MenuItem className="suggestion" key={ itemId } {...menuItemProps}>
                                    <SuggestionComponent itemId={ itemId } item={ item } isHighlighted={ isHighlighted } inputValue={ inputValue } />
                                </MenuItem>
                            );
                        })
                    }
                </>
            );
        }
        if ( inputValue.length ) {
            return <DefaultEmptyMessage inputValue={ inputValue } />;
        } else {
            return false;
        }
    }

    console.error(suggestions);
    throw new Error("should never happen!");
}

PickerSuggestions.propTypes = {
    suggestions: suggestionsPropType,
    getItemProps: func.isRequired,
    highlightedIndex: number,
    itemToString: func.isRequired,
    inputValue: string.isRequired,
    SuggestionComponent: any,
    ErrorComponent: any,
    classes: object
};

export default withStyles(styles)(PickerSuggestions);
