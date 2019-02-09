import React from "react";
import createReactClass from "create-react-class";
import Downshift from "downshift";
import keycode from "keycode";
import PickerInput from "./PickerInput";
import PickerDropdown from "./PickerDropdown";
import PickerChip from "./PickerChip";
import { func, array, bool, string, number, any } from "prop-types";
import { isFunction, asPromise, getLast, LOADING } from "./utils";

const defaultAvatar = () => undefined;

const MultiPicker = createReactClass({
    propTypes: {
        value: array.isRequired,
        onChange: func.isRequired,
        getSuggestedItems: func.isRequired,
        itemToLabel: func,
        itemToString: func.isRequired,
        itemToAvatar: func,
        fullWidth: bool,
        label: string,
        fetchDelay: number,
        SuggestionComponent: any
    },
    componentWillUnmount() {
        clearTimeout(this.delayedLookup);
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
    safeItemToString(item) {
        // downshift has an issue where it sometimes calls itemToString with "null"
        // this is a temporary workaround
        return item && this.props.itemToString(item);
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
        onChange(value.filter(item => this.safeItemToString(item) !== this.safeItemToString(itemToDelete)));
    },
    getChipLabel(item) {
        const { itemToLabel } = this.props;
        return isFunction(itemToLabel) ? itemToLabel(item) : this.safeItemToString(item);
    },
    getInputAdornments() {
        const { value, itemToAvatar = defaultAvatar } = this.props;
        return value.map(item =>
            (
                <PickerChip
                    key={ this.safeItemToString(item) }
                    item={ item }
                    label={ this.getChipLabel(item) }
                    onDelete={ () => this.handleDeleteItem(item) }
                    avatar={ itemToAvatar(item) }
                />
            )
        );
    },
    getSuggestions() {
        const { inputValue, allSuggestions } = this.state;
        return allSuggestions[inputValue];
    },
    renderDownshift({ getInputProps, ...dropdownProps }) {
        const { value, fullWidth, label, SuggestionComponent } = this.props;
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
                <PickerDropdown
                    selectedItems={ value }
                    suggestions={ suggestions }
                    SuggestionComponent={ SuggestionComponent }
                    {...dropdownProps}
                />
            </div>
        );
    },
    render() {
        const { inputValue } = this.state;
        return (
            <Downshift
                inputValue={ inputValue }
                onSelect={ this.handleAddItem }
                itemToString={ this.safeItemToString }
                fullWidth
            >
                { this.renderDownshift }
            </Downshift>
        );
    }
});

export default MultiPicker;
