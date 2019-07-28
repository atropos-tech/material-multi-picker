import React, { useState } from "react";
import MultiPicker from "../../src/index";
import { getSuggestedFruitSync } from "./common";
import { Button } from "@material-ui/core";
import { getGlobalCache } from "../../src/globalCache";

const SERVER_RESPONSE_TIME_IN_MILLISECONDS = 2000;

function getSuggestedFruitSloooow(inputValue) {
    if ( !inputValue.length ) {
        return Promise.resolve([]);
    }
    return new Promise(resolve => {
        setTimeout(
            () => resolve(getSuggestedFruitSync(inputValue)),
            SERVER_RESPONSE_TIME_IN_MILLISECONDS
        );
    });
}

export default function GlobalCacheDemo() {
    const [ items1, setItems1 ] = useState([]);
    const [ items2, setItems2 ] = useState([]);
    return (
        <>
            <MultiPicker
                value={ items1 }
                onChange={ setItems1 }
                itemToString={ fruit => fruit.name }
                getSuggestedItems={ getSuggestedFruitSloooow }
                useGlobalCache="shared-fruit"
                label="Your favourite fruit 1"
                fullWidth
            />
            <MultiPicker
                value={ items2 }
                onChange={ setItems2 }
                itemToString={ fruit => fruit.name }
                getSuggestedItems={ getSuggestedFruitSloooow }
                useGlobalCache="shared-fruit"
                label="Your favourite fruit 2"
                fullWidth
            />
            <Button color='primary' variant='contained' onClick={ () => getGlobalCache("shared-fruit").clearAll() }>Clear cache</Button>
        </>
    );
}
