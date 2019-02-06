import React from "react";
import createReactClass from "create-react-class";
import Downshift from "downshift";
import keycode from "keycode";
import PickerInput from "./PickerInput";
import PickerDropdown from "./PickerDropdown";
import PickerChip from "./PickerChip";
import { func, array, bool, string } from "prop-types";

function getLast(sourceArray) {
    if (sourceArray.length) {
        return sourceArray[sourceArray.length - 1];
    }
}

const MultiPicker = createReactClass({
    propTypes: {
        value: array.isRequired,
        onChange: func.isRequired,
        getSuggestedItems: func.isRequired,
        itemToString: func.isRequired,
        fullWidth: bool,
        label: string
    },
    getInitialState() {
        return { inputValue: "" };
    },
    handleInputChange(inputChangeEvent) {
        this.setState({ inputValue: inputChangeEvent.target.value });
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
        console.log("WAT", itemToAdd);
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
    renderDownshift({ getInputProps, ...dropdownProps }) {
        const { getSuggestedItems, value, fullWidth, label } = this.props;
        return (
            <div>
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
                <PickerDropdown selectedItems={ value } getSuggestedItems={ getSuggestedItems } {...dropdownProps} />
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
