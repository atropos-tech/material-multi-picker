import React from "react";
import createReactClass from "create-react-class";
import Downshift from "downshift";
import PickerInput from "./PickerInput";
import PickerDropdown from "./PickerDropdown";
import PickerChips from "./PickerChips";
import { func, array, bool, string, number, any } from "prop-types";
import { isBackspace, asPromise, getLast, LOADING, assertSuggestionsValid, materialColorPropType } from "./utils";

export { NOT_ENOUGH_CHARACTERS } from "./utils";


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
        SuggestionComponent: any,
        ErrorComponent: any,
        chipColor: materialColorPropType
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
            assertSuggestionsValid(suggestions);
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
        if (!inputValue.length && isBackspace(keyDownEvent)) {
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
    getSuggestions() {
        const { inputValue, allSuggestions } = this.state;
        const suggestions = allSuggestions[inputValue];
        if ( Array.isArray(suggestions) ) {
            // exclude suggestions that have already been picked
            // otherwise we get an ID clash
            const selectedIds = this.props.value.map(this.safeItemToString);
            return suggestions.filter(suggestion => !selectedIds.includes(this.safeItemToString(suggestion)));
        }
        return suggestions;
    },
    renderDownshift({ getInputProps, ...dropdownProps }) {
        const { fullWidth, label, value, itemToLabel, itemToAvatar, chipColor, SuggestionComponent, ErrorComponent } = this.props;
        const suggestions = this.getSuggestions();
        const startAdornment = value.length ? [
            <PickerChips
                key='picker-chips'
                selectedItems= { value }
                color={ chipColor }
                onDelete={ this.handleDeleteItem }
                itemToString={ this.safeItemToString }
                itemToLabel={ itemToLabel }
                itemToAvatar= { itemToAvatar }
            />
        ] : [];
        return (
            <div style={ { position: "relative" } }>
                <PickerInput
                    {
                    ...getInputProps({
                        startAdornment,
                        onChange: this.handleInputChange,
                        onKeyDown: this.handleKeyDown
                    })
                    }
                    fullWidth={ fullWidth }
                    label={ label }
                />
                <PickerDropdown
                    suggestions={ suggestions }
                    SuggestionComponent={ SuggestionComponent }
                    ErrorComponent={ ErrorComponent }
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
