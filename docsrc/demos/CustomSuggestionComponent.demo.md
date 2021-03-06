The default suggestion component just displays the id of the item (extracted with `itemToString()`) in a plain format. You can supply a React component as the `SuggestionComponent` prop, which will have access to the following props:

| Prop name | Type | Description |
| --------- | ---- | ----------- |
| `itemId` | string | The unique ID of the item (from `itemToString`) |
| `item` | any | The suggestion generated by your `getSuggestedItems` function |
| `isHighlighted` | boolean | `true` if the user is currently highlighting this suggestion (either with keyboard navigation, or by hovering over with the mouse) |
| `inputValue` | string | The string currently entered in the text input field. |

This can be good for emphasising search text and providing more information about the suggestion.
