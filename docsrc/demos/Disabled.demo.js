import React, { useState } from "react";
import MultiPicker from "../../src/index";
import { getSuggestedFruitSync, ALL_FRUITS } from "./common";

export default function DisabledDemo() {
    const [items, setItems] = useState(ALL_FRUITS.slice(0, 2));
    return (
        <MultiPicker
            value={ items }
            onChange={ setItems }
            itemToString={ fruit => fruit.name }
            getSuggestedItems={ getSuggestedFruitSync }
            label="Your favourite fruit"
            fullWidth
            disabled
        />
    );
}
