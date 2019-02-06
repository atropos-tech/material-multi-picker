import React from "react";
import createReactClass from "create-react-class";
import { render } from "react-dom";
import MultiPicker from "../index";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { blue, red } from "@material-ui/core/colors";

const ALL_ITEMS = [
    {value: "apple", rows: 15 },
    {value: "pear", rows: 2 },
    {value: "orange", rows: 7 },
    {value: "grape", rows: 20 },
    {value: "banana", rows: 500 },
    {value: "papaya", rows: 230 },
];

const itemToString = item => item.value;

function getSuggestedItems(searchString, selectedItems) {
    return ALL_ITEMS
        .filter(item => item.value.toLowerCase().includes(searchString.toLowerCase()))
        .filter(item => !selectedItems.includes(item));
}

const sandboxTheme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: red
    },
    typography: {
        useNextVariants: true,
    }
});

const Sandbox = createReactClass({
    getInitialState() {
        return { selectedItems: [] };
    },
    handleSelectedItemsChange(selectedItems) {
        this.setState({ selectedItems });
    },
    render() {
        const { selectedItems } = this.state;
        return (
            <MuiThemeProvider theme={ sandboxTheme }>
                <Typography variant="h2">Preview Picker</Typography>
                <section>
                    <Typography variant="h5">Simple suggestion list</Typography>
                    <div style={ { width: "700px" } }>
                        <MultiPicker
                            value={ selectedItems }
                            onChange={ this.handleSelectedItemsChange }
                            getSuggestedItems={ getSuggestedItems }
                            itemToString={ itemToString }
                            label="Your favourite fruit"
                            fullWidth
                        />
                    </div>
                </section>
            </MuiThemeProvider>
        );
    }
});

render(<Sandbox />, document.getElementById("sandbox"));
