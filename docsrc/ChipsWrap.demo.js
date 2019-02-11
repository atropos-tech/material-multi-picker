import React, { useState } from "react";
import MultiPicker from "../src/index";
import { getSuggestedFruitSync, ALL_FRUITS } from "./common";

export default function ChipsWrapDemo() {
    const [items, setItems] = useState(ALL_FRUITS);
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
