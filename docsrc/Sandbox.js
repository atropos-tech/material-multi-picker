import React, { useState } from "react";
import MultiPicker from "../src/index";
import { getSuggestedFruitSync, ALL_FRUITS } from "./demos/common";
import { atomDark as codeStyle } from "react-syntax-highlighter/dist/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ControlPanel from "./ControlPanel";
import { Paper, Divider, Typography } from "@material-ui/core";

const CONTROL_PANEL_FIELDS = [
    { propName: "label", label: "Label", defaultValue: "Your favourite fruit", propType: "string" },
    { propName: "required", label: "Required", defaultValue: false, propType: "bool" },
    { propName: "error", label: "Error State", defaultValue: false, propType: "bool" },
    { propName: "disabled", label: "Disabled", defaultValue: false, propType: "bool" },
    { propName: "fullWidth", label: "Full Width", defaultValue: true, propType: "bool" },
    { propName: "chipColor", label: "Chip Color", defaultValue: "default", propType: "oneOf", options: ["default", "primary", "secondary"] },
    { propName: "clearInputOnBlur", label: "Clear Input on Blur", defaultValue: false, propType: "bool" },
    { propName: "fetchDelay", label: "Fetch Delay", defaultValue: 0, propType: "oneOf", options: [0, 100, 500, 2000] },
    { propName: "variant", label: "Display variant", defaultValue: "standard", propType: "oneOf", options: ["standard", "filled", "outlined"] },
    { propName: "helperText", label: "Helper text", defaultValue: "", propType: "string" }
];

const DEFAULT_SANDBOX_PROPS = CONTROL_PANEL_FIELDS.reduce((props, field) => {
    props[field.propName] = field.defaultValue;
    return props;
}, {});

const isPropSet = propValue => typeof propValue !== "undefined";

function generateSource(sandboxProps) {
    const sandboxPropCode = Object.entries(sandboxProps).filter(isPropSet).map(entry => {
        const [propName, propValue] = entry;
        if ( typeof propValue === "string") {
            return `        ${propName}="${propValue}"`;
        }
        return `        ${propName}={ ${JSON.stringify(propValue) } }`;
    }).join("\n");
    return `
function MyPicker() {
    //requires React 16.8+
    const [ items, setItems ] = useState(ALL_FRUITS.slice(0, 2));
    return <MultiPicker
        value={ items }
        onChange={ setItems }
        itemToString={ fruit => fruit.name }
        getSuggestedItems={ getSuggestedFruitSync }
${sandboxPropCode}        
    />;
}
`.trim();
}

export default function Sandbox() {
    const [ items, setItems ] = useState(ALL_FRUITS.slice(0, 2));
    const [ sandboxProps, setSandboxProps ] = useState(DEFAULT_SANDBOX_PROPS);

    return (
        <Paper>
            <div style={ { display: "flex", alignItems: "stretch" } }>
                <ControlPanel fields={ CONTROL_PANEL_FIELDS } value={ sandboxProps } onChange={ setSandboxProps } />
                <div style={ { flex: "1 1 0" } }>
                    <Typography variant="h6">Source</Typography>
                    <SyntaxHighlighter language="jsx" style={ codeStyle }>{ generateSource(sandboxProps) }</SyntaxHighlighter>
                </div>
            </div>
            <Divider />
            <div style={ { padding: "32px" } }>
                <Typography variant="h6">Result</Typography>
                <MultiPicker
                    value={ items }
                    onChange={ setItems }
                    itemToString={ fruit => fruit.name }
                    getSuggestedItems={ getSuggestedFruitSync }
                    { ...sandboxProps }
                />
            </div>
        </Paper>

    );
}
