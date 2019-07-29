import React, { useState, useRef } from "react";
import Downshift from "downshift";
import PickerInput from "./PickerInput";
import PickerDropdown from "./PickerDropdown";
import PickerChips from "./PickerChips";
import { func, array, bool, string, number, any, object, node } from "prop-types";
import { noop, isBackspace, getLast, materialColorPropType } from "./utils";
import { withStyles } from "@material-ui/core";
import styles from "./styles";

export { NOT_ENOUGH_CHARACTERS } from "./utils";

function MultiPicker(props) {

    const { itemToString, value, onChange, error, disabled } = props;
    const safeItemToString = item => item && itemToString(item);

    const [ inputValue, setInputValue ] = useState("");

    const inputRef = useRef();
    const downshiftRef = useRef();

    function handleAddItem(itemToAdd) {
        // downshift sends a deselect event when you press ESC, we ignore it
        if (itemToAdd) {
            onChange([...value, itemToAdd]);
            setInputValue("");
        }
    }

    function handleDeleteItem(itemToDelete) {
        onChange(value.filter(item => safeItemToString(item) !== safeItemToString(itemToDelete)));
    }

    function handleKeyDown(keyDownEvent) {
        if (!inputValue.length && isBackspace(keyDownEvent)) {
            const lastItem = getLast(value);
            if (lastItem) {
                handleDeleteItem(lastItem);
            }
        }
    }

    function handleBlur(blurEvent) {
        const { clearInputOnBlur, onBlur = noop } = props;
        if (clearInputOnBlur) {
            setInputValue("");
        }
        onBlur(blurEvent);
    }

    function handleFocus(focusEvent) {
        const { showDropdownOnFocus, onFocus = noop } = props;
        if (showDropdownOnFocus) {
            downshiftRef.current.openMenu();
        }
        onFocus(focusEvent);
    }

    const { itemToLabel, itemToAvatar, itemToPopover, chipColor, variant, classes } = props;
    const startAdornment = value.length ?
        <PickerChips
            key='picker-chips'
            selectedItems= { value }
            color={ chipColor }
            classes={ classes }
            onDelete={ itemToDelete => handleDeleteItem(itemToDelete) }
            itemToString={ safeItemToString }
            itemToLabel={ itemToLabel }
            itemToAvatar={ itemToAvatar }
            itemToPopover={ itemToPopover }
            disabled={ disabled }
            variant={ variant }
        />
        : false;

    return (
        <Downshift
            ref={ downshiftRef }
            inputValue={ inputValue }
            onSelect={ itemToAdd => handleAddItem(itemToAdd) }
            itemToString={ safeItemToString }
            fullWidth
        >
            {
                ({ getInputProps, ...dropdownProps }) => (
                    <div style={ { position: "relative" } }>
                        <PickerInput
                            {
                            ...getInputProps({
                                startAdornment,
                                onChange: inputChangeEvent => setInputValue(inputChangeEvent.target.value),
                                onKeyDown: handleKeyDown,
                                onBlur: handleBlur,
                                onFocus: focusEvent => handleFocus(focusEvent),
                                onDragStart: props.onDragStart,
                                error,
                                disabled
                            })
                            }
                            fullWidth={ props.fullWidth }
                            label={ props.label }
                            variant={ props.variant }
                            helperText={ props.helperText }
                            required={ props.required }
                            name={ props.name }
                            inputRef={ inputRef }
                            autoFocus={ props.autoFocus }
                        />
                        <PickerDropdown
                            SuggestionComponent={ props.SuggestionComponent }
                            ErrorComponent={ props.ErrorComponent }
                            maxHeight={ props.maxDropdownHeight }
                            anchorElement={ inputRef.current }
                            itemToString={ safeItemToString }
                            useGlobalCache={ props.useGlobalCache }
                            getSuggestedItems={ props.getSuggestedItems }
                            fetchDelay={ props.fetchDelay }
                            pickedItems={ props.value }
                            disablePortals={ props.disablePortals }
                            {...dropdownProps }
                        />
                    </div>
                )
            }
        </Downshift>
    );
}

MultiPicker.propTypes = {
    value: array.isRequired,
    onChange: func.isRequired,
    onBlur: func,
    onFocus: func,
    onDragStart: func,
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
    name: string,
    maxDropdownHeight: number,
    autoFocus: bool,
    showDropdownOnFocus: bool,
    disablePortals: bool
};

export default withStyles(styles)(MultiPicker);
