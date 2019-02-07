Multipicker, uses React 16, material-ui 3, and downshift.

# Usage
Install with `npm install material-multi-picker` or `yarn add material-multi-picker`.

```javascript
import MultiPicker from 'material-multi-picker';

const things = [
    "raindrops on roses", "whiskers on kittens", "bright copper kettles", "warm woolen mittens"
]

function getSuggestions(inputValue) {
    return things.filter(thing => thing.includes(inputValue));
}

function MyPicker({ items, onItemsChange }) {
    return (
        <MultiPicker
            value={ items }
            onChange={ onItemsChange }
            getSuggestedItems={ getSuggestions }
            itemToString={ item => item }
        />
    );
}
```

## Props

| Prop name | Type | Required? | Description |
| --------- | ---- | --------- | ----------- |
| `value`   | array | yes | The items currently displayed as "selected" in the picker. They will appear as a series of "pills". |
| `onChange` | function(newValue) | yes | Callback fired by the componnent when the user changes the selected items. |
| `getSuggestedItems` | function(inputValue, selectedItems) | yes | Used by the picker to get the suggestions that will appear in the dropdown. Return an array of items or a promise that resolves to an array of items. |
| `itemToString` | function(item) | yes | Used by the picker to extract a unique identifer string for an item (must return a string). |
| `itemToLabel` | function(item) | no | Used by the picker to populate the pill labels. If not supplied, the results of `itemToString` will be used. |
| `fullWidth` | boolean | no | As in Material UI, determines whether the picker will grow to fill available horizontal space. Defaults to `false` |
| `label` | string | no | The label applied to the input field. Defaults to `""`. |
| `fetchDelay` | number | no | The delay between the last keypress and the picker fetching suggestions. Useful to avoid spamming a service! Defaults to `0`. |
| `SuggestionComponent` | React components | no | Custom component used to render suggestions in the picker dropdown (see below for a list of supplied props). Defaults to the result of `itemToString`. |

# Todo
* keyboard support for pills navigation
* finish readme
* publish to npm
* sandbox for custom suggestion generation

