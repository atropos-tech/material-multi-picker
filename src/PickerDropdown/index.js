import React from "react";
import createReactClass from "create-react-class";
import { Paper } from "@material-ui/core";
import PickerSuggestions from "./PickerSuggestions";
import { bool } from "prop-types";
import { suggestionsPropType } from "../utils";

const DELAYED_HIDE_MILLISECONDS = 50;

const DROPDOWN_STYLE = {
    position: "absolute",
    zIndex: 20,
    width: "100%"
};

const PickerDropdown = createReactClass({
    propTypes: {
        isOpen: bool,
        suggestions: suggestionsPropType
    },
    componentWillUnmount() {
        clearTimeout(this.delayedUpdate);
    },
    shouldComponentUpdate(nextProps) {
        //issue #1 - avoid flickering by delaying render update when the suggestions are empty
        if (!nextProps.suggestions || nextProps.suggestions === []) {
            clearTimeout(this.delayedUpdate);
            this.delayedUpdate = setTimeout(
                () => this.forceUpdate(),
                DELAYED_HIDE_MILLISECONDS
            );
            return false;
        }
        return true;
    },
    render() {
        const { isOpen, suggestions, ...otherProps } = this.props;
        if ( isOpen && suggestions ) {
            return (
                <Paper square style={ { DROPDOWN_STYLE } }>
                    <PickerSuggestions suggestions={ suggestions } { ...otherProps } />
                </Paper>
            );
        }
        return false;
    }
});

export default PickerDropdown;
