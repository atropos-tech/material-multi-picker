/* eslint-disable no-magic-numbers */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-webpack-loader-syntax */

import React, { useState } from "react";
import { render } from "react-dom";
import MultiPicker from "../index";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Typography, Avatar } from "@material-ui/core";
import { blue, red } from "@material-ui/core/colors";
import { AppleImage, PearImage, BananaImage, GrapesImage, MelonImage, RaspberryImage } from "./icons";
import Highlighter from "react-highlight-words";
import { NOT_ENOUGH_CHARACTERS } from "../utils";

// initial '!' skips usual babel-loader
// https://github.com/webpack/docs/wiki/using-loaders#loaders-in-require
import pickerInputSource from "!raw-loader!../PickerInput";

const ALL_ITEMS = [
    { name: "apple", stock: 0, image: AppleImage, detail: "Keeps the doctor away" },
    { name: "pear", stock: 14, image: PearImage, detail: "The tastiest fruit in the world" },
    { name: "banana", stock: 282, image: BananaImage, detail: "Full of lovely potassium!" },
    { name: "melon", stock: 81, image: MelonImage, detail: "Available in many different flavours" },
    { name: "raspberry", stock: 422, image: RaspberryImage, detail: "Technically not a berry, but whatevs" },
    { name: "grapes", stock: 109, image: GrapesImage, detail: "You could theoretically make wine" }
];

const itemToString = item => item.name;

function getSuggestedSyncItems(searchString) {
    return ALL_ITEMS
        .filter(item => item.name.toLowerCase().includes(searchString.toLowerCase()));
}

function getSuggestedSyncItemsMinimumLength(searchString, selectedItems) {
    if (searchString.length >= 3) {
        return getSuggestedSyncItems(searchString, selectedItems);
    }
    return NOT_ENOUGH_CHARACTERS;
}

function getSuggestedAsyncItems(searchString, selectedItems) {
    if ( !searchString.length ) {
        return Promise.resolve([]);
    }
    return new Promise(resolve => {
        setTimeout(
            () => resolve(getSuggestedSyncItems(searchString, selectedItems)),
            800
        );
    });
}

function getSuggestedAsyncItemsWithError(searchString) {
    if ( !searchString.length ) {
        return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
        setTimeout(
            () => reject(new Error("oops")),
            800
        );
    });
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

function SuggestionWithStockNumbers({ item, isHighlighted, isSelected, inputValue }) {
    const style = {
        display: "flex",
        backgroundColor: isHighlighted ? "#aaa" : "#fff",
        fontWeight: isSelected ? "bold" : "inherit",
        width: "100%"
    };
    return (
        <div style={ style }>
            <img src={ item.image } style={ { margin: "0 8px" } } />
            <div style={ { flex: "1 1 0"} }>
                <Typography variant="h6">
                    <Highlighter
                        highlightStyle={ { backgroundColor: "#ff2" } }
                        searchWords={ [ inputValue ] }
                        textToHighlight={ item.name }
                    />
                    <small>&nbsp;({ item.stock } in stock)</small>
                </Typography>
                <Typography>{ item.detail }</Typography>
            </div>
        </div>
    );
}

function getDynamicSuggestionItems(inputValue, selectedItems) {
    const basicSuggestions = getSuggestedSyncItems(inputValue, selectedItems);
    if (basicSuggestions.map(itemToString).includes(inputValue) || inputValue.length === 0) {
        return basicSuggestions;
    }
    return [ ...basicSuggestions, { name: inputValue }];
}

const fruitAvatars = item => <Avatar alt={ item.name } src={ item.image } style={ { backgroundColor: "#aaa" } } />;

const tooManyFruits = [
    { name: "papaya" },
    { name: "grapefruit" },
    { name: "coconut" },
    { name: "pomegranate" },
    { name: "starfruit" },
    { name: "blackberry" },
    { name: "quince" },
    { name: "lemon" },
    { name: "banana" },
    { name: "cranberry" },
];

const fruitPopover = item => (
    <div style={ { display: "flex", alignItems: "center", padding: "4px 8px" } }>
        <img src={ item.image } style={ { height: "20px", width: "20px" } } />
        <Typography variant='subtitle1'>{ item.detail }</Typography>
    </div>
);

function Sandbox() {
    return (
        <MuiThemeProvider theme={ sandboxTheme }>
            <pre>{ pickerInputSource }</pre>
            <div style={ { maxWidth: "750px", margin: "0 auto", marginBottom: "100px" } }>
                <Typography variant="h2">Material Multi Picker</Typography>
                <DemoSection title="Simple synchronous suggestion list" getSuggestedItems={ getSuggestedSyncItems } />
                <DemoSection title="Chips wrap onto multiple lines" getSuggestedItems={ getSuggestedSyncItems } initialValue={ tooManyFruits } />

                <Typography variant="h4">Providing suggestions</Typography>
                <DemoSection title="Minimum input length for suggestions" getSuggestedItems={ getSuggestedSyncItemsMinimumLength } />
                <DemoSection title="Asynchronous suggestion list" getSuggestedItems={ getSuggestedAsyncItems } />
                <DemoSection title="Throttling requests" getSuggestedItems={ getSuggestedAsyncItems } fetchDelay={ 800 } />
                <DemoSection title="Handle suggestion fetch errors" getSuggestedItems={ getSuggestedAsyncItemsWithError } />
                <DemoSection title="Dynamically generated suggestions" getSuggestedItems={ getDynamicSuggestionItems } />

                <Typography variant="h4">Customising presentation</Typography>
                <DemoSection title="Custom suggestion components" getSuggestedItems={ getSuggestedSyncItems } SuggestionComponent={ SuggestionWithStockNumbers } />
                <DemoSection title="Custom chip labels" getSuggestedItems={ getSuggestedSyncItems } itemToLabel={ item => `Awesome ${item.name}` } />
                <DemoSection title="Custom chip icons" getSuggestedItems={ getSuggestedSyncItems } itemToAvatar={ fruitAvatars } initialValue={ ALL_ITEMS.slice(0, 3) } />
                <DemoSection title="Themed chip colors" getSuggestedItems={ getSuggestedSyncItems } chipColor="primary" initialValue={ ALL_ITEMS.slice(0, 3) } />
                <DemoSection
                    title="Chip popovers (on hover)"
                    getSuggestedItems={ getSuggestedSyncItems }
                    itemToPopover={ fruitPopover }
                    initialValue={ ALL_ITEMS.slice(0, 3) }
                />
            </div>
        </MuiThemeProvider>
    );
}


function DemoSection({ initialValue = [], title, ...otherProps }) {
    const [items, setItems] = useState(initialValue);
    return (
        <section style={{ margin: "32px 0"}}>
            <Typography variant="h6">{ title }</Typography>
            <div style={ { width: "100%" } }>
                <MultiPicker
                    value={ items }
                    onChange={ setItems }
                    itemToString={ itemToString }
                    label="Your favourite fruit"
                    fullWidth
                    { ...otherProps }
                />
            </div>
        </section>
    );
}

render(<Sandbox />, document.getElementById("sandbox"));
