import React, { useState } from "react";
import MultiPicker from "../../src/index";
import { ALL_FRUITS, getSuggestedFruitSync } from "./common";

const RECOMMENDED_FRUITS = ALL_FRUITS.slice(0, 4);

function getSuggestedFruit(searchString) {
    if (searchString.length > 0) {
        return getSuggestedFruitSync(searchString);
    }
    return RECOMMENDED_FRUITS;
}

export default function ShopDropdownOnFocus() {
    const [items, setItems] = useState([]);
    return (
        <MultiPicker
            value={ items }
            onChange={ setItems }
            itemToString={ fruit => fruit.name }
            getSuggestedItems={ getSuggestedFruit }
            label="Your favourite fruit"
            fullWidth
            showDropdownOnFocus
        />
    );
}
