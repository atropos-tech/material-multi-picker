import React, { useState } from "react";
import { Avatar, Typography } from "@material-ui/core";
import MultiPicker from "../../src/index";
import { getSuggestedFruitSync, ALL_FRUITS } from "./common";

const NUMBER_OF_FRUITS_TO_SHOW = 3;

const fruitAvatars = item => <Avatar alt={ item.name } src={ item.image } />;

const fruitPopover = item => (
    <div style={ { display: "flex", alignItems: "center", padding: "4px 8px" } }>
        <img src={ item.image } style={ { height: "20px", width: "20px" } } />
        <Typography variant='subtitle1'>{ item.detail }</Typography>
    </div>
);

const fruitNameWithStock = fruit => `${fruit.name} (${fruit.stock})`;

export default function BasicDemo() {
    const [items, setItems] = useState(ALL_FRUITS.slice(0, NUMBER_OF_FRUITS_TO_SHOW));
    return (
        <MultiPicker
            value={ items }
            onChange={ setItems }
            itemToString={ fruit => fruit.name }
            getSuggestedItems={ getSuggestedFruitSync }
            chipColor='primary'
            itemToAvatar={ fruitAvatars }
            itemToLabel={ fruitNameWithStock }
            itemToPopover={ fruitPopover }
            label="Your favourite fruit"
            fullWidth
        />
    );
}
