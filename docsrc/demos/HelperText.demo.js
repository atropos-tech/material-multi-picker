import React, { useState } from "react";
import MultiPicker from "../../src/index";
import { getSuggestedFruitSync } from "./common";

export default function HelperTextDemo() {
    const [items, setItems] = useState([]);
    return (
        <MultiPicker
            value={ items }
            onChange={ setItems }
            itemToString={ fruit => fruit.name }
            getSuggestedItems={ getSuggestedFruitSync }
            label="Your favourite fruit"
            fullWidth
            helperText="Tell us what fruits you really like"
        />
    );
}
