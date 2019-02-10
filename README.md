[![npm package](https://img.shields.io/npm/v/material-multi-picker.svg)](https://www.npmjs.com/package/material-multi-picker)
[![npm downloads](https://img.shields.io/npm/dw/material-multi-picker.svg)](https://www.npmjs.com/package/material-multi-picker)
[![licence](https://img.shields.io/npm/l/material-multi-picker.svg)](https://opensource.org/licenses/MIT)

Typeahead multipicker, uses React 16, material-ui 3, and [downshift](https://github.com/downshift-js/downshift).

# Usage
Install with `npm install material-multi-picker` or `yarn add material-multi-picker`. Make sure you have React (16+) and Material UI (3+) installed!

```jsx
import MultiPicker from 'material-multi-picker';
import React from 'react';

const favoriteThings = [
    "raindrops on roses",
    "whiskers on kittens",
    "bright copper kettles",
    "warm woolen mittens"
]

function getSuggestions(inputValue) {
    return favoriteThings.filter(
        thing => thing.includes(inputValue.toLowerCase())
    );
}

function MyPicker() {
    //use React hooks for state (React 16.8+ only)
    const [myThings, setMyThings] = useState([]);

    return (
        <MultiPicker
            value={ myThings }
            onChange={ setMyThings }
            getSuggestedItems={ getSuggestions }
            itemToString={ item => item }
        />
    );
}
```

## Demo/Sandbox
Do `npm start` to run a demo server on port 8080.

## Props

| Prop name | Type | Required? | Description |
| --------- | ---- | --------- | ----------- |
| `value`   | array | yes | The items currently displayed as "selected" in the picker. They will appear as a series of chips. |
| `onChange` | function(newValue) | yes | Callback fired by the component when the user changes the selected items. |
| `getSuggestedItems` | function(inputValue, selectedItems) | yes | Used by the picker to get the suggestions that will appear in the dropdown. Return an array of items, a promise that resolves to an array of items, or the special `NOT_ENOUGH_CHARACTERS` symbol (see below). |
| `itemToString` | function(item) | yes | Used by the picker to extract a unique identifer string for an item (must return a string). |
| `itemToLabel` | function(item) | no | Used by the picker to populate the chip labels. If not supplied, the results of `itemToString` will be used. |
| `itemToAvatar` | function(item) | no | Used by the picker to add material `<Avatar />` icons into the chips. If not supplied, chips will have no icon. |
| `fullWidth` | boolean | no | As in Material UI, determines whether the picker will grow to fill available horizontal space. Defaults to `false` |
| `label` | string | no | The label applied to the input field. Defaults to `""`. |
| `fetchDelay` | number | no | The delay between the last keypress and the picker fetching suggestions. Useful to avoid spamming a service! Defaults to `0`. |
| `SuggestionComponent` | React component | no | Custom component used to render suggestions in the picker dropdown (see below for a list of supplied props). Defaults to the result of `itemToString`. |
| `ErrorComponent` | React component | no | Custom component used to indicate a loading error in the picker dropdown (see below for a list of supplied props). Default just shows a generic error message. |

## ErrorComponent props
When supplying a custom `SuggestionComponent`, you will have access to the following props:

| Prop name | Type | Description |
| --------- | ---- | ----------- |
| `error` | Error | The error encountered while loading suggestions |
| `inputValue` | string | The search string entered by the user |

## Providing Suggestions
When writing your `getSuggestedItems` function, here are some possible strategies:

### Lowercase strings before doing matching
Case is rarely significant when matching results:

```jsx
function getSuggestedItems(inputValue, selectedItems) {
    return items.filter(
        item => item.toLowerCase().includes(inputValue.toLowerCase())
    );
}
```

### Only pass back a maximum number of items
```jsx
const MAX_SUGGESTIONS_TO_RETURN = 15;

function getSuggestedItems(inputValue, selectedItems) {
    return fetchSuggestionsFromServer(inputValue).then(suggestions => {
        return suggestions.slice(0, MAX_SUGGESTIONS_TO_RETURN);
    });
}
```

### Require a minimum number of characters in the input before showing anything
If you return the special `NOT_ENOUGH_CHARACTERS` symbol, a message will be displayed to users explaining that they need to type more characters.

```jsx
import { NOT_ENOUGH_CHARACTERS } from 'material-multi-picker';

const MINIMUM_INPUT_LENGTH = 3;

function getSuggestedItems(inputValue, selectedItems) {
    if (inputValue.length < MINIMUM_INPUT_LENGTH) {
        return NOT_ENOUGH_CHARACTERS;
    }
    //otherwise do a real lookup
}
```

### Allow users to create new suggestions by creating dynamic items
```jsx
function getSuggestedItems(inputValue, selectedItems) {
    const suggestions = getMatchingSuggestions(inputValue);

    //only create a dynamic suggestion if no exact match exists
    if ( !suggestions.map(getName).includes(inputValue) ) {
        // set a dynamic=true flag, this lets us use a 
        // special display style for this item
        return [ ...suggestions, { name: inputValue, dynamic: true }];
    }
}
```

### Combine federated results from multiple sources
```jsx
function getSuggestedItems(inputValue, selectedItems) {
    //wait for both servers to return results
    return Promises.all([ 
        fetchSuggestionsFromStaffServer(inputValue),
        fetchSuggestionsFromCustomerServer(inputValue)
    ]).then(([ staffSuggestions, customerSuggestions ]) => {
        //concatenate results from both servers
        return [...staffSuggestions, ...customerSuggestions];
    });
}
```

## Customising chips

### Changing chip text with `itemToLabel`
Providing an `itemToLabel` function allows customisation of the text that appears in the chips.

```jsx

const people = [{ id: 'jbloggs', name: 'Joe Bloggs' }];

function getPeople(inputValue) {
    people.filter(person => person.name.toLowerCase().includes(inputValue.toLowerCase()))
}

function PeoplePicker() {
    //use React hooks for state (React 16.8+ only)
    const [myThings, setMyThings] = useState([]);

    return (
        <MultiPicker
            value={ myThings }
            onChange={ setMyThings }
            getSuggestedItems={ getPeople }
            itemToString={ item => item.id }
            itemToLabel={ item => item.name }
        />
    );
}
```

### Changing the chip icon with `itemToAvatar`
You can use [Material Avatar icons](https://material-ui.com/demos/avatars/) to augment the appearance of chips in the picker:

```jsx
const people = [{ id: 'jbloggs', name: 'Joe Bloggs', imageUrl: 'https://images.people/jbloggs.jpg' }];

function getPeople(inputValue) {
    people.filter(person => person.name.toLowerCase().includes(inputValue.toLowerCase()))
}

function PeoplePicker() {
    //use React hooks for state (React 16.8+ only)
    const [myThings, setMyThings] = useState([]);

    return (
        <MultiPicker
            value={ myThings }
            onChange={ setMyThings }
            getSuggestedItems={ getPeople }
            itemToString={ person => person.id }
            itemToAvatar={ person => <Avatar src={ person.imageUrl } /> }
        />
    );
}
```

## Customising suggestions in the dropdown
The default suggestion component just displays the id of the item (extracted with `itemToString()`) in a plain format. You can supply a React component as the `SuggestionComponent` prop, which will have access to the following props:

| Prop name | Type | Description |
| --------- | ---- | ----------- |
| `itemId` | string | The unique ID of the item (from `itemToString`) |
| `item` | any | The suggestion generated by your `getSuggestedItems` function |
| `isHighlighted` | boolean | `true` if the user is currently highlighting this suggestion (either with keyboard navigation, or by hovering over with the mouse) |
| `inputValue` | string | The string currently entered in the text input field. Useful for highlighting portions of text to indicate matches. |

It's a good idea to avoid interactive or clickable elements in your component, as they may interfere with the picker's event handling.

### Highlighting search text in suggestions
You can use a library such as [`react-highlight-words`](https://www.npmjs.com/package/react-highlight-words) to highlight portions of text that match the search string:

```jsx
import Highlighter from 'react-highlight-words';

const people = [{ id: 'jbloggs', name: 'Joe Bloggs' }];

function getPeople(inputValue) {
    people.filter(person => person.name.toLowerCase().includes(inputValue.toLowerCase()))
}

function PersonSuggestion({ item }) {
    return <Highlighter style={ {  backgroundColor: "#ff7" }}>{ item.name }</Highlighter>;
}

function PeoplePicker() {
    //use React hooks for state (React 16.8+ only)
    const [myThings, setMyThings] = useState([]);

    return (
        <MultiPicker
            value={ myThings }
            onChange={ setMyThings }
            getSuggestedItems={ getPeople }
            itemToString={ person => person.id }
            SuggestionComponn
        />
    );
}
```



