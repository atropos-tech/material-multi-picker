import React, { useState } from "react";
import MultiPicker from "../../src/index";
import { ALL_FRUITS } from "./common";

export function getSuggestedFruitSync(searchString) {
    return ALL_FRUITS
        .filter(item => item.name.toLowerCase().includes(searchString.toLowerCase()));
}

export default function BasicDemo() {
    const [items, setItems] = useState([]);
    return (
        <MultiPicker
            value={ items }
            onChange={ setItems }
            itemToString={ fruit => fruit.name }
            getSuggestedItems={ getSuggestedFruitSync }
            label="Your favourite fruit"
            fullWidth
        />
    );
}
