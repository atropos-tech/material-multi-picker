import React, { useState } from "react";
import MultiPicker from "../index";
import { getSuggestedFruitSync } from "./common";

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
