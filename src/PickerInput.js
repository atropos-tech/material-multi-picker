import React from "react";
import { func, string, bool, node, object } from "prop-types";
import { TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const ONE_QUARTER = 0.25;
const ONE_HALF = 0.5;

const styles = theme => ({
    InputRoot: {
        display: "flex",
        flexWrap: "wrap",
        padding: `${ theme.spacing.unit * ONE_HALF }px 0`
    },
    InputLabelRoot: {
        top: theme.spacing.unit
    },
    InputLabelShrink: {
        top: 0
    },
    inputRoot: {
        flex: "1 1 auto",
        marginTop: theme.spacing.unit * ONE_QUARTER,
        minWidth: "200px",
        width: "auto"
    }
});

function PickerInput({ value, onChange, startAdornment, classes, fullWidth, label, onBlur, onKeyDown, disabled, ...otherProps }) {
    const InputProps = {
        inputProps: {
            ...otherProps,
            className: classes.inputRoot
        },
        startAdornment: startAdornment.length ? startAdornment : false, //needed to make the label appear correctly
        classes: { root: classes.InputRoot }
    };

    //this ensures that the label will be shown above the input field if there are selected items,
    //even if there is no input text
    const InputLabelProps = {
        shrink: Boolean(value.length || startAdornment.length),
        classes: {
            root: classes.InputLabelRoot,
            shrink: classes.InputLabelShrink
        }
    };
    return (
        <TextField
            label={ label }
            value={ value }
            onChange={ onChange }
            onBlur={ onBlur }
            onKeyDown={ onKeyDown }
            InputProps={ InputProps }
            InputLabelProps={ InputLabelProps }
            fullWidth={ fullWidth }
            disabled={ disabled }
        />
    );
}

PickerInput.propTypes = {
    disabled: bool,
    label: string,
    value: string.isRequired,
    onChange: func.isRequired,
    onBlur: func.isRequired,
    onKeyDown: func,
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
