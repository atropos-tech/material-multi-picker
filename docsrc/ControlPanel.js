import React from "react";
import { TextField, Switch, FormControlLabel, FormGroup, FormControl, InputLabel, Select, MenuItem, Typography } from "@material-ui/core";
import { string, bool, oneOf, array, object, func } from "prop-types";

function getFieldElement({ propName, propType, label, helperText, options }, value, onUpdate) {
    if (propType === string) {
        return <TextField
            value={ value[propName] }
            onChange={ event => onUpdate(propName, event.target.value) }
            label={ label }
            helperText={ helperText }
        />;
    }
    if (propType === bool) {
        return <FormControlLabel
            control={
                <Switch
                    checked={ value[propName] }
                    onChange={ event => onUpdate(propName, event.target.checked)}
                />
            }
            label={ label }
        />;
    }
    if (propType === oneOf) {
        return (
            <FormControl>
                <InputLabel>{ label }</InputLabel>
                <Select
                    value={ value[propName] }
                    onChange={ event => onUpdate(propName, event.target.value) }
                    helperText={ helperText }
                >
                    {
                        options.map(option => (
                            <MenuItem key={ option } value={ option }>{ String(option) }</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        );
    }
    throw new Error(`Unknown prop type ${propType}`);
}

export default function ControlPanel({ fields, value, onChange }) {
    const handleUpdateValue = (propName, propValue) => onChange({ ...value, [propName]: propValue });
    return (
        <div style={ { padding: "16px", minWidth: "250px" } }>
            <Typography variant="h6">Props</Typography>
            {
                fields.map(field => (
                    <FormGroup key={ field.propName }>
                        { getFieldElement(field, value, handleUpdateValue) }
                    </FormGroup>
                ))
            }
        </div>
    );
}

ControlPanel.propTypes = {
    fields: array,
    value: object,
    onChange: func
};
