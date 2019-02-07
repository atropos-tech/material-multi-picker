import React from "react";
import createReactClass from "create-react-class";
import Downshift from "downshift";
import keycode from "keycode";
import PickerInput from "./PickerInput";
import PickerDropdown from "./PickerDropdown";
import PickerChip from "./PickerChip";
import { func, array, bool, string, number } from "prop-types";
import LOADING from "./symbols";

function getLast(sourceArray) {
    if (sourceArray.length) {
        return sourceArray[sourceArray.length - 1];
    }
}

function asPromise(delegate) {
    return new Promise(( resolve, reject ) => {
        try {
            resolve(delegate());
        } catch (error) {
            reject(error);
        }
    });
}

const MultiPicker = createReactClass({
    propTypes: {
        value: array.isRequired,
        onChange: func.isRequired,
        getSuggestedItems: func.isRequired,
        itemToString: func.isRequired,
        fullWidth: bool,
        label: string,
        fetchDelay: number
    },
    getInitialState() {
        return { inputValue: "", allSuggestions: {} };
    },
    handleInputChange(inputChangeEvent) {
        const { fetchDelay = 0 } = this.props;
        const inputValue = inputChangeEvent.target.value;
        this.setState({ inputValue });

        clearTimeout(this.delayedLookup);
        this.delayedLookup = setTimeout(
            () => this.getSuggestionsFor(inputValue),
            fetchDelay
        );
    },
    getSuggestionsFor(inputValue) {
        const { getSuggestedItems, value } = this.props;
        this.updateSuggestions(inputValue, LOADING);
        asPromise( () => getSuggestedItems(inputValue, value) ).then(suggestions => {
            this.updateSuggestions(inputValue, suggestions);
            return true;
        }).catch(error => {
            this.updateSuggestions(inputValue, error);
            console.error(error);
        });
    },
    updateSuggestions(inputValue, suggestions) {
        this.setState(oldState => {
            const allSuggestions = {
                ...oldState.allSuggestions,
                [inputValue]: suggestions
            };
            return { allSuggestions };
        });
    },
    handleKeyDown(keyDownEvent) {
        const { inputValue } = this.state;
        if (!inputValue.length && keycode(keyDownEvent) === "backspace") {
            const { value } = this.props;
            const lastItem = getLast(value);
            if (lastItem) {
                this.handleDeleteItem(lastItem);
            }
        }
    },
    handleAddItem(itemToAdd) {
        const { value, onChange } = this.props;
        onChange([...value, itemToAdd]);
        this.setState({ inputValue: "" });
    },
    handleDeleteItem(itemToDelete) {
        const { value, onChange } = this.props;
        onChange(value.filter(item => item !== itemToDelete));
    },
    getInputAdornments() {
        const { value, itemToString } = this.props;
        return value.map(item =>
            (
                <PickerChip
                    key={ itemToString(item) }
                    item={ item }
                    label={ itemToString(item) }
                    onDelete={ () => this.handleDeleteItem(item) }
                />
            )
        );
    },
    getSuggestions() {
        const { inputValue, allSuggestions } = this.state;
        return allSuggestions[inputValue];
    },
    renderDownshift({ getInputProps, ...dropdownProps }) {
        const { value, fullWidth, label } = this.props;
        const suggestions = this.getSuggestions();
        return (
            <div style={ { position: "relative" } }>
                <PickerInput
                    {
                    ...getInputProps({
                        startAdornment: this.getInputAdornments(),
                        onChange: this.handleInputChange,
                        onKeyDown: this.handleKeyDown
                    })
                    }
                    fullWidth={ fullWidth }
                    label={ label }
                />
                <PickerDropdown selectedItems={ value } suggestions={ suggestions } {...dropdownProps} />
            </div>
        );
    },
    render() {
        const { inputValue } = this.state;
        const { itemToString } = this.props;
        return (
            <Downshift
                inputValue={ inputValue }
                onChange={ this.handleAddItem }
                itemToString={ itemToString }
                fullWidth
            >
                { this.renderDownshift }
            </Downshift>
        );
    }
});

export default MultiPicker;
