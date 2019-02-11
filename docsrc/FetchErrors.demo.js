import React, { useState } from "react";
import MultiPicker from "../src/index";

const SERVER_RESPONSE_TIME_IN_MILLISECONDS = 800;

function getSuggestedFruitAsyncError(inputValue) {
    if ( !inputValue.length ) {
        return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
        setTimeout(
            () => reject(new Error("Suggestion fetch failed!")),
            SERVER_RESPONSE_TIME_IN_MILLISECONDS
        );
    });
}

export default function HandleErrorsDemo() {
    const [items, setItems] = useState([]);
    return (
        <MultiPicker
            value={ items }
            onChange={ setItems }
            itemToString={ fruit => fruit.name }
            getSuggestedItems={ getSuggestedFruitAsyncError }
            label="Your favourite fruit"
            fullWidth
        />
    );
}
