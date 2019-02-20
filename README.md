[![npm package](https://img.shields.io/npm/v/material-multi-picker.svg)](https://www.npmjs.com/package/material-multi-picker)
[![npm downloads](https://img.shields.io/npm/dw/material-multi-picker.svg)](https://www.npmjs.com/package/material-multi-picker)
[![licence](https://img.shields.io/npm/l/material-multi-picker.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://img.shields.io/codecov/c/gh/atropos-tech/material-multi-picker.svg)](https://codecov.io/gh/atropos-tech/material-multi-picker)
[![CircleCI](https://circleci.com/gh/atropos-tech/material-multi-picker/tree/master.svg?style=svg)](https://circleci.com/gh/atropos-tech/material-multi-picker/tree/master)
[![bundlephobia](https://img.shields.io/bundlephobia/min/material-multi-picker.svg)](https://bundlephobia.com/result?p=material-multi-picker)
[![LGTM alerts](https://img.shields.io/lgtm/alerts/g/atropos-tech/material-multi-picker.svg)](https://lgtm.com/projects/g/atropos-tech/material-multi-picker/alerts)
[![LGTM grade](https://img.shields.io/lgtm/grade/javascript/g/atropos-tech/material-multi-picker.svg)](https://lgtm.com/projects/g/atropos-tech/material-multi-picker/context:javascript)

Typeahead multipicker component, uses [React 16](https://reactjs.org/), [Material-UI 3](https://material-ui.com/), and [downshift](https://github.com/downshift-js/downshift).

This component allows users to pick multiple items from a typeahead dropdown. It's easy to use straight out-of-the-box, but allows visual customisation while remaining within the Material Design universe.

Check out the live demos in the [documentation](https://atropos-tech.github.io/material-multi-picker/index.html).

# Features
 * Functional and aesthetic with minimal configuration
 * Typeahead suggestions can be provided synchronously or asynchronously
 * Good keyboard and screenreader accessibility (due to being build on PayPal's downshift primitive)
 * Handles most errors and edge cases gracefully
 * Conforms to Material Design guidelines (due to using components from the Material UI library)
 * Key visual aspects are customisable

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

function FavouriteThingPicker() {
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

## Props
Note that this component can only be used as a [Controlled Component](https://reactjs.org/docs/forms.html).

| Prop name | Type | Required? | Description |
| --------- | ---- | --------- | ----------- |
| `value`   | array | yes | The items currently displayed as "selected" in the picker. They will appear as a series of [Chips](https://material-ui.com/demos/chips/). |
| `onChange` | function(newValue) | yes | Callback fired by the component when the user changes the selected items. |
| `disabled` | boolean | no | If `true`, prevents all interaction with the component (chip popovers will still appear if configured) |
| `getSuggestedItems` | function(inputValue, selectedItems) | yes | Used by the picker to get the suggestions that will appear in the dropdown. Return an array of items, a promise that resolves to an array of items, or the special `NOT_ENOUGH_CHARACTERS` symbol (see below). |
| `itemToString` | function(item) | yes | Used by the picker to extract a unique identifer string for an item (must return a string). |
| `itemToLabel` | function(item) | no | Used by the picker to populate the chip labels. If not supplied, the results of `itemToString` will be used. |
| `itemToAvatar` | function(item) | no | Used by the picker to add material `<Avatar />` icons into the chips. If not supplied, chips will have no icon. |
| `itemToPopover` | function(item) | no | Used by the picker to add material [Popovers](https://material-ui.com/utils/popover/) to chips, activated on hover. If not supplied, chips will have no popover. |
| `chipColor` | `'primary'`, `'secondary'` or `'default'` | no | Which theme color to use for the chips. By default this is `undefined`, which in most themes will lead to chips being light grey. |
| `fullWidth` | boolean | no | As in Material UI, determines whether the picker will grow to fill available horizontal space. Defaults to `false` |
| `label` | string | no | The label applied to the input field. Defaults to `""`. |
| `fetchDelay` | number | no | The delay between the last keypress and the picker fetching suggestions. Useful to avoid spamming a service! Defaults to `0`. |
| `SuggestionComponent` | React component | no | Custom component used to render suggestions in the picker dropdown (see below for a list of supplied props). Defaults to the result of `itemToString`. |
| `ErrorComponent` | React component | no | Custom component used to indicate a loading error in the picker dropdown (see below for a list of supplied props). Default just shows a generic error message. |
| `useGlobalCache` | string | no | If set, this causes the picker to use a global in-memory suggestions cache with the given ID, improving performance across multiple instances |
| `clearInputOnBlur` | boolean | no | Default to `false`. If set to `true`, the typeahead input will be cleared whenever the picker loses the focus. This can be useful to avoid confusing users who move on from the picker without selecting anything from the dropdown. |

## ErrorComponent props
When supplying a custom `ErrorComponent`, you will have access to the following props:

| Prop name | Type | Description |
| --------- | ---- | ----------- |
| `error` | Error | The error encountered while loading suggestions |
| `inputValue` | string | The search string entered by the user |

## Providing Suggestions
When writing your `getSuggestedItems` function, here are some possible strategies:

### Lowercase strings before doing matching
Case is rarely significant when matching results:

```jsx
const ALL_ITEMS = [ /* your items */ ];

function getSuggestedItems(inputValue, selectedItems) {
    return ALL_ITEMS.filter(
        item => item.toLowerCase().includes(inputValue.toLowerCase())
    );
}
```

### Only pass back a maximum number of items
```jsx
const MAX_SUGGESTIONS_TO_RETURN = 15;

function getSuggestedItems(inputValue) {
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

function getSuggestedItems(inputValue) {
    if (inputValue.length >= MINIMUM_INPUT_LENGTH) {
        return fetchSuggestionsFromServer(inputValue);
    }
    return NOT_ENOUGH_CHARACTERS;    
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

### Emphasising search text in suggestions
You can use a library such as [`react-highlight-words`](https://www.npmjs.com/package/react-highlight-words) to emphasise portions of text that match the search string:

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
            SuggestionComponent={ PersonSuggestion }
        />
    );
}
```

### Customising highlighted suggestion
By default, which ever suggestion is currently highlighted by the user (either by hovering with the mouse, or by keyboard navigation) will have a visually distinct background (light grey in most themes) - as long as your custom component has a transparent background color, you don't need to do anything else. If you want to use a different visual style for highlighting, you can use the `isHighlighted` prop:

```jsx
function PersonSuggestion({ item, isHighlighted }) {
    const backgroundColor = isHighlighted ? 
    const style = {
        backgroundColor = isHighlighted ? 'blue' : 'white',
        color: isHighlighted ? 'white' : 'black'
    };
    return <Typography style={ style }>{ item.name }</Typography>;
}
```


