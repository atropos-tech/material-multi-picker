import React, { useState } from "react";
import MultiPicker from "../../src/index";
import { getSuggestedFruitSync } from "./common";
import { NOT_ENOUGH_CHARACTERS } from "../../src/utils";

const MINIMUM_CHARACTERS = 3;

function getSuggestedFruitWithMinimum(inputValue) {
    if ( inputValue.length >= MINIMUM_CHARACTERS ) {
        return getSuggestedFruitSync(inputValue);
    }
    return NOT_ENOUGH_CHARACTERS;
}

export default function MinimumCharactersDemo() {
    const [items, setItems] = useState([]);
    return (
        <MultiPicker
            value={ items }
            onChange={ setItems }
            itemToString={ fruit => fruit.name }
            getSuggestedItems={ getSuggestedFruitWithMinimum }
            label="Your favourite fruit"
            fullWidth
        />
    );
}
