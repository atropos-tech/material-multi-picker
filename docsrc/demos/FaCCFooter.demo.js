import React, { useState } from "react";
import MultiPicker from "../../src/index";
import { ALL_FRUITS } from "./common";
import { Card, Typography, Button, Link } from "@material-ui/core";

export function getSuggestedFruitSync(searchString) {
    return ALL_FRUITS
        .filter(item => item.name.toLowerCase().includes(searchString.toLowerCase()));
}

export default function FaCCFooter() {
    const [items, setItems] = useState([]);
    return (
        <MultiPicker
            value={ items }
            onChange={ setItems }
            itemToString={ fruit => fruit.name }
            getSuggestedItems={ getSuggestedFruitSync }
            label="Your favourite fruit"
            fullWidth
        >
            {(selectedItems, handleDelete) => selectedItems.map(item =>
                (<Card style={{padding: "1rem", margin: "0.2rem"}} key={item.name}>
                    <Typography variant="h6" style={{textTransform: "capitalize"}}>{item.name}</Typography>
                    <Typography>
                        {item.detail}
                        <Link href={`https://en.wikipedia.org/w/index.php?search=${item.name}`} target="_blank"> Find out more?</Link>
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={() => handleDelete(item)}>Remove?</Button>
                </Card>)
            )}
        </MultiPicker>
    );
}
