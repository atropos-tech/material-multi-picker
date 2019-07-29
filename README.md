[![npm package](https://img.shields.io/npm/v/material-multi-picker.svg)](https://www.npmjs.com/package/material-multi-picker)
[![npm downloads](https://img.shields.io/npm/dw/material-multi-picker.svg)](https://www.npmjs.com/package/material-multi-picker)
[![licence](https://img.shields.io/npm/l/material-multi-picker.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://img.shields.io/codecov/c/gh/atropos-tech/material-multi-picker.svg)](https://codecov.io/gh/atropos-tech/material-multi-picker)
[![CircleCI](https://circleci.com/gh/atropos-tech/material-multi-picker/tree/master.svg?style=svg)](https://circleci.com/gh/atropos-tech/material-multi-picker/tree/master)
[![bundlephobia](https://img.shields.io/bundlephobia/min/material-multi-picker.svg)](https://bundlephobia.com/result?p=material-multi-picker)
[![LGTM alerts](https://img.shields.io/lgtm/alerts/g/atropos-tech/material-multi-picker.svg)](https://lgtm.com/projects/g/atropos-tech/material-multi-picker/alerts)
[![LGTM grade](https://img.shields.io/lgtm/grade/javascript/g/atropos-tech/material-multi-picker.svg)](https://lgtm.com/projects/g/atropos-tech/material-multi-picker/context:javascript)

Typeahead multipicker component, uses [React 16](https://reactjs.org/), [Material-UI 3 or 4](https://material-ui.com/), and [downshift](https://github.com/downshift-js/downshift).

This component allows users to pick multiple items from a typeahead dropdown. It's easy to use straight out-of-the-box, but allows visual customisation while remaining within the Material Design universe.

Check out the live demos in the [documentation](https://atropos-tech.github.io/material-multi-picker/index.html).

![Animated image of picker component in being used to select multiple fruits from a dropdown list](picker-demo.gif)

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
import React, { useState } from 'react';

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
    const  [myThings, setMyThings ] = useState([]);

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
Note that the picker can only be used as a [Controlled Component](https://reactjs.org/docs/forms.html).

| Prop name | Type | Required? | Description |
| --------- | ---- | --------- | ----------- |
| `value`   | array | yes | The items currently displayed as "selected" in the picker. They will appear as a series of [Chips](https://material-ui.com/demos/chips/). |
| `onChange` | function(newValue) | yes | Callback fired by the component when the user changes the selected items. |
| `getSuggestedItems` | function(inputValue, selectedItems) | yes | Used by the picker to get the suggestions that will appear in the dropdown. Return an array of items, a promise that resolves to an array of items, or the special `NOT_ENOUGH_CHARACTERS` symbol (see below). |
| `itemToString` | function(item) | yes | Used by the picker to extract a unique identifer string for an item (must return a string). |
| `name` | string | no | If set, the same name will be applied to the input field |
| `disabled` | boolean | no | If `true`, prevents all interaction with the component (chip popovers will still appear if configured) |
| `error` | boolean | no | If `true`, the picker will display in an errored state (using theme colors) |
| `required` | boolean | no | If `true`, the picker will indicate that the value is required |
| `variant` | `'standard'`, `'filled'`, or `'outlined'` | no | Sets the display style of the field (as with the Material UI text field). Defaults to `'standard'`. |
| `maxDropdownHeight` | number | no | Maximum height of the dropdown element (in pixels). If there are too many suggestions, the dropdown will become scrollable. Defaults to unlimited height. |
| `itemToLabel` | function(item) | no | Used by the picker to populate the chip labels. If not supplied, the results of `itemToString` will be used. |
| `itemToAvatar` | function(item) | no | Used by the picker to add material `<Avatar />` icons into the chips. If not supplied, chips will have no icon. |
| `itemToPopover` | function(item) | no | Used by the picker to add material [Popovers](https://material-ui.com/utils/popover/) to chips, activated on hover. If not supplied, chips will have no popover. |
| `chipColor` | `'primary'`, `'secondary'` or `'default'` | no | Which theme color to use for the chips. By default this is `undefined`, which in most themes will lead to chips being light grey. |
| `fullWidth` | boolean | no | As in Material UI, determines whether the picker will grow to fill available horizontal space. Defaults to `false` |
| `autoFocus` | boolean | no | As in Material UI, when `true` this causes the picker to get the focus when it mounts. Defaults to `false` |
| `showDropdownOnFocus` | boolean | no | When `true`, causes the picker to show the suggestions dropdown whenever the picker gets the focus, even if the user has not typed anything. Defaults to `false`. |
| `label` | string | no | The label applied to the input field. Defaults to `""`. |
| `helperText` | string | no | The helper text applied to the field (rendered below the picker). Defaults to `""`. |
| `fetchDelay` | number | no | The delay between the last keypress and the picker fetching suggestions. Useful to avoid spamming a service! Defaults to `0`. |
| `SuggestionComponent` | React component | no | Custom component used to render suggestions in the picker dropdown (see below for a list of supplied props). Defaults to the result of `itemToString`. |
| `ErrorComponent` | React component | no | Custom component used to indicate a loading error in the picker dropdown (see below for a list of supplied props). Default just shows a generic error message. |
| `useGlobalCache` | string | no | If set, this causes the picker to use a global in-memory suggestions cache with the given ID, improving performance across multiple instances |
| `clearInputOnBlur` | boolean | no | Default to `false`. If set to `true`, the typeahead input will be cleared whenever the picker loses the focus. This can be useful to avoid confusing users who move on from the picker without selecting anything from the dropdown. |
| `disablePortals` | boolean | no | Defaults to `false`. If set to `true`, the dropdown will be rendered inline in the DOM instead of using `<body>` as the parent (can be useful for testing or limiting CSS scope)

### Requiring a minimum number of characters in the input
Sometimes you may want to wait for the user to enter several characters before doing a suggestions lookup - this can reduce load on APIs and avoids bringing back unhelpful results. You can do this just by testing the length of the input in your `getSuggestedItems()` function and returning an empty array, but this doesn't tell the users that they need to enter more characters. Instead, return the special `NOT_ENOUGH_CHARACTERS` symbol, and a dropdown message will be displayed to users explaining that they need to type more characters.

```javascript
import { NOT_ENOUGH_CHARACTERS } from 'material-multi-picker';
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

## Handling errors
If your `getSuggestedItems()` function throws an error, or if it returns a Promise that fails, the picker will show an Error dropdown. You can override the default appearance and behaviour of this dropdown using the `ErrorComponent`. Your custom `ErrorComponent`, you will have access to the following props:

| Prop name | Type | Description |
| --------- | ---- | ----------- |
| `error` | Error | The error encountered while loading suggestions |
| `inputValue` | string | The search string entered by the user |

# Migration 

## 1.x => 2.x
 * Make sure you're using React 16.8 or better (both `react` and `react-dom`)
