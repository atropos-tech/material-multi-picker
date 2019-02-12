import React, { useState } from "react";
import MultiPicker from "../../src/index";
import { getSuggestedFruitSync } from "./common";

function getDynamicSuggestionItems(inputValue) {
    const basicSuggestions = getSuggestedFruitSync(inputValue);
    if (basicSuggestions.map(item => item.name).includes(inputValue) || inputValue.length === 0) {
        return basicSuggestions;
    }
    return [ ...basicSuggestions, { name: inputValue }];
}

export default function DynamicSuggestionsDemo() {
    const [items, setItems] = useState([]);
    return (
        <MultiPicker
            value={ items }
            onChange={ setItems }
            itemToString={ fruit => fruit.name }
            getSuggestedItems={ getDynamicSuggestionItems }
            label="Your favourite fruit"
            fullWidth
        />
    );
}
