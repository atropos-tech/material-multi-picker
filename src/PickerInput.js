import React from "react";
import { func, string, bool, node, object } from "prop-types";
import { TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = {
    InputRoot: {
        display: "flex",
        flexWrap: "wrap",
        padding: "4px 0"
    },
    inputRoot: {
        flex: "1 1 auto",
        minWidth: "200px"
    }
};

function PickerInput({ value, onChange, startAdornment, classes, fullWidth, label, ...otherProps }) {
    const InputProps = {
        inputProps: {
            ...otherProps,
            style: { flex: "1 1 auto", minWidth: "200px", width: "auto" }
        },
        startAdornment: startAdornment.length ? startAdornment : false, //needed to make the label appear correctly,
        classes: { root: classes.InputRoot }
    };

    //this ensures that the label will be shown above the input field if there are selected items,
    //even if there is no input text
    const InputLabelProps = {
        shrink: Boolean(value.length || startAdornment.length)
    };
    return (
        <TextField
            label={ label }
            value={ value }
            onChange={ onChange }
            InputProps={ InputProps }
            InputLabelProps={ InputLabelProps }
            fullWidth={ fullWidth }
        />
    );
}

PickerInput.propTypes = {
    label: string,
    value: string.isRequired,
    onChange: func.isRequired,
    fullWidth: bool,
    startAdornment: node,
    classes: object
};

PickerInput.defaultProps = {
    label: "",
    fullWidth: false,
    startAdornment: false
};

export default withStyles(styles)(PickerInput);
