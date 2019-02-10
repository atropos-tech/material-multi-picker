import React from "react";
import createReactClass from "create-react-class";
import { Paper } from "@material-ui/core";
import PickerSuggestions from "./PickerSuggestions";
import { bool, array, oneOfType, symbol } from "prop-types";

const DELAYED_HIDE_MILLISECONDS = 50;

const PickerDropdown = createReactClass({
    propTypes: {
        isOpen: bool,
        suggestions: oneOfType([array, symbol])
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
                <Paper square style={ { position: "absolute", zIndex: 100, width: "100%" } }>
                    <PickerSuggestions suggestions={ suggestions } { ...otherProps } />
                </Paper>
            );
        }
        return false;
    }
});

export default PickerDropdown;
