import React, { useState } from "react";
import MultiPicker from "../index";
import { getSuggestedFruitSync } from "./common";

const SERVER_RESPONSE_TIME_IN_MILLISECONDS = 800;
const FETCH_DELAY_IN_MILLISECONDS = 500;

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
            fetchDelay={ FETCH_DELAY_IN_MILLISECONDS }
            fullWidth
        />
    );
}
