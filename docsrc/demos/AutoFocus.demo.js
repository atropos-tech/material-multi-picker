import React, { useState } from "react";
import MultiPicker from "../../src/index";
import { Button } from "@material-ui/core";
import { getSuggestedFruitSync } from "./common";

export default function BasicDemo() {
    const [showPicker, setShowPicker] = useState(false);
    const [items, setItems] = useState([]);

    if ( showPicker ) {
        return (
            <>
                <MultiPicker
                    value={ items }
                    onChange={ setItems }
                    itemToString={ fruit => fruit.name }
                    getSuggestedItems={ getSuggestedFruitSync }
                    label="Your favourite fruit"
                    fullWidth
                    autoFocus
                />
                <Button onClick={ () => setShowPicker(false) } variant="contained" color="primary">
                    Hide Picker
                </Button>
            </>
        );
    }
    return (
        <Button onClick={ () => setShowPicker(true) } variant="contained" color="primary">
            Show Picker
        </Button>
    );

}
