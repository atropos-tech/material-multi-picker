import React, { useState } from "react";
import MultiPicker from "../src/index";
import { getSuggestedFruitSync } from "./common";

const SERVER_RESPONSE_TIME_IN_MILLISECONDS = 800;

function getSuggestedFruitAsync(inputValue) {
    if ( !inputValue.length ) {
        return Promise.resolve([]);
    }
    return new Promise(resolve => {
        setTimeout(
            () => resolve(getSuggestedFruitSync(inputValue)),
            SERVER_RESPONSE_TIME_IN_MILLISECONDS
        );
    });
}

export default function AsynchronousDemo() {
    const [items, setItems] = useState([]);
    return (
        <MultiPicker
            value={ items }
            onChange={ setItems }
            itemToString={ fruit => fruit.name }
            getSuggestedItems={ getSuggestedFruitAsync }
            label="Your favourite fruit"
            fullWidth
        />
    );
}
