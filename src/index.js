import React, { PureComponent } from "react";
import Downshift from "downshift";
import PickerInput from "./PickerInput";
import PickerDropdown from "./PickerDropdown";
import PickerChips from "./PickerChips";
import { func, array, bool, string, number, any, object, node } from "prop-types";
import { isBackspace, asPromise, getLast, LOADING, assertSuggestionsValid, materialColorPropType } from "./utils";
import { getGlobalCache } from "./globalCache";
import { withStyles } from "@material-ui/core";
import styles from "./styles";

export { NOT_ENOUGH_CHARACTERS } from "./utils";

class MultiPicker extends PureComponent {

    constructor(props) {
        super(props);
        this.state = { inputValue: "", allSuggestions: {} };

        const { useGlobalCache } = props;
        if (useGlobalCache) {
            this.unsubscribeGlobalCache = getGlobalCache(useGlobalCache).subscribeToUpdates(() => this.forceUpdate());
        }
    }

    componentWillUnmount() {
        clearTimeout(this.delayedLookup);
        this.unsubscribeGlobalCache();
    }

    handleInputChange(inputChangeEvent) {
        const { fetchDelay = 0 } = this.props;
        const inputValue = inputChangeEvent.target.value;
        this.setState({ inputValue }, () => {
            const existingSuggestions = this.getSuggestions();
            if ( !existingSuggestions ) {
                clearTimeout(this.delayedLookup);
                this.delayedLookup = setTimeout(
                    () => this.fetchSuggestionsFor(inputValue),
                    fetchDelay
                );
            }
        });
    }

    fetchSuggestionsFor(inputValue) {
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
    }

    safeItemToString(item) {
        // downshift has an issue where it sometimes calls itemToString with "null"
        // this is a temporary workaround
        return item && this.props.itemToString(item);
    }

    updateSuggestions(inputValue, suggestions) {
        const { useGlobalCache } = this.props;
        if ( useGlobalCache ) {
            getGlobalCache(useGlobalCache).setValue(inputValue, suggestions);
        } else {
            this.setState(oldState => {
                const allSuggestions = {
                    ...oldState.allSuggestions,
                    [inputValue]: suggestions
                };
                return { allSuggestions };
            });
        }
    }

    handleKeyDown(keyDownEvent) {
        const { inputValue } = this.state;
        if (!inputValue.length && isBackspace(keyDownEvent)) {
            const { value } = this.props;
            const lastItem = getLast(value);
            if (lastItem) {
                this.handleDeleteItem(lastItem);
            }
        }
    }

    handleBlur() {
        if (this.props.clearInputOnBlur) {
            this.setState({ inputValue: "" });
        }
    }

    handleAddItem(itemToAdd) {
        const { value, onChange } = this.props;
        onChange([...value, itemToAdd]);
        this.setState({ inputValue: "" });
    }

    handleDeleteItem(itemToDelete) {
        const { value, onChange } = this.props;
        onChange(value.filter(item => this.safeItemToString(item) !== this.safeItemToString(itemToDelete)));
    }

    getSuggestions() {
        const { useGlobalCache } = this.props;
        const { inputValue, allSuggestions } = this.state;
        const suggestions = useGlobalCache ? getGlobalCache(useGlobalCache).getValue(inputValue) : allSuggestions[inputValue];
        if ( Array.isArray(suggestions) ) {
            // exclude suggestions that have already been picked
            // otherwise we get an ID clash
            const selectedIds = this.props.value.map(item => this.safeItemToString(item));
            return suggestions.filter(suggestion => !selectedIds.includes(this.safeItemToString(suggestion)));
        }
        return suggestions;
    }

    renderInputAdornment() {
        const { disabled, value, itemToLabel, itemToAvatar, itemToPopover, chipColor, variant, classes } = this.props;
        return value.length ?
            <PickerChips
                key='picker-chips'
                selectedItems= { value }
                color={ chipColor }
                classes={ classes }
                onDelete={ itemToDelete => this.handleDeleteItem(itemToDelete) }
                itemToString={ item => this.safeItemToString(item) }
                itemToLabel={ itemToLabel }
                itemToAvatar={ itemToAvatar }
                itemToPopover={ itemToPopover }
                disabled={ disabled }
                variant={ variant }
            />
            : false;
    }

    renderDownshift({ getInputProps, ...dropdownProps }) {
        const { disabled, error, fullWidth, label, SuggestionComponent, ErrorComponent, variant, helperText, required, name } = this.props;

        return (
            <div style={ { position: "relative" } }>
                <PickerInput
                    {
                    ...getInputProps({
                        startAdornment: this.renderInputAdornment(),
                        onChange: inputChangeEvent => this.handleInputChange(inputChangeEvent),
                        onKeyDown: keyDownEvent => this.handleKeyDown(keyDownEvent),
                        onBlur: blurEvent => this.handleBlur(blurEvent),
                        error,
                        disabled
                    })
                    }
                    fullWidth={ fullWidth }
                    label={ label }
                    variant={ variant }
                    helperText={ helperText }
                    required={ required }
                    name={ name }
                />
                <PickerDropdown
                    suggestions={ this.getSuggestions() }
                    SuggestionComponent={ SuggestionComponent }
                    ErrorComponent={ ErrorComponent }
                    {...dropdownProps}
                />
            </div>
        );
    }

    render() {
        const { inputValue } = this.state;
        return (
            <Downshift
                inputValue={ inputValue }
                onSelect={ itemToAdd => this.handleAddItem(itemToAdd) }
                itemToString={ item => this.safeItemToString(item) }
                fullWidth
            >
                { (...args) => this.renderDownshift(...args) }
            </Downshift>
        );
    }
}

MultiPicker.propTypes = {
    value: array.isRequired,
    onChange: func.isRequired,
    getSuggestedItems: func.isRequired,
    itemToLabel: func,
    itemToString: func.isRequired,
    itemToAvatar: func,
    itemToPopover: func,
    fullWidth: bool,
    error: bool,
    label: string,
    fetchDelay: number,
    SuggestionComponent: any,
    ErrorComponent: any,
    chipColor: materialColorPropType,
    useGlobalCache: string,
    classes: object,
    disabled: bool,
    clearInputOnBlur: bool,
    variant: string,
    helperText: node,
    required: bool,
    name: string
};

export default withStyles(styles)(MultiPicker);
