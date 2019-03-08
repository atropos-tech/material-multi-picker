# 1.8.0 - released 08/03/2019
 * Add `showDropdownOnFocus` prop that causes the picker to open the dropdown whenever it receives the focus
 * Fix error where `onBlur` callbacks wouldn't be passed the event
 * Correct peer dependencies to require React 16.3+ instead of 16.0+ (because we use `React.createRef()`)
 * Minor improvements to docs

# 1.7.0 - released 07/03/2019
 * Add `autoFocus` prop that causes the picker to be focused when it mounts
 * Fix bug where the picker would not have the focus styling when it had the focus
 * Docs now include contents of README.md

# 1.6.0 - released 06/03/2019
 * Add `onFocus`, `onBlur` and `onDragStart` props to support Redux Form
 * Fix issue where dropdown did not appear directly under the input field if `helperText` prop was provided
 * Fix console errors on unmounting if the global cache wasn't being used
 
# 1.5.2 - released 06/03/2019
 * Fix incorrect contents of `lib` causing spurious errors

# 1.5.1 - released 01/03/2019
 * Fix issue where "outlined" and "filled" variants would sometimes be too wide for their containers

# 1.5.0 - released 01/03/2019
 * Add `maxDropdownHeight` prop to allow for scrollable dropdowns
 * Make docs work better on mobile devices

# 1.4.1 - released 28/02/2019
 * Make component more lightweight by using React classes instead of `create-react-class`
 * Use PureComponents for performance improvement
 * Kill some spurious console errors

# 1.4.0 - released 27/02/2019
 * Add `variant` prop which controls the visual style of the picker
 * Add `name` prop which applies a "name" attribute to the underlying input field
 * Add `required` prop which shows a "required" star if set
 * Add `helperText` prop which shows helper text below the picker
 * Add an interactive sandbox in docs

# 1.3.0 - released 21/02/2019
 * Add `error` prop which shows the picker in an error state

# 1.2.0 - released 20/02/2019
 * Add `clearInputOnBlur` prop which removes the input value whenever the picker loses focus

# 1.1.0 - released 19/02/2019
 * Allow disabling the component with `disabled` prop
 * Fix issue where selecting a suggestion with the keyboard would not cause a visual highlight

# 1.0.0 - released 13/02/2019
 * Allow shared suggestion caching with `useGlobalCache` prop
 * More improvements to live docs

# 0.4.0 - released 11/02/2019
 * Allow custom chip popovers with `itemToPopover` prop
 * Allow customisation of chip colors with `chipColor` prop
 * Improve proptype checking (reduces errors in console)
 * Reworked and published [docs/demo page](https://atropos-tech.github.io/material-multi-picker/index.html)
 * Removed some dependencies that weren't really needed (`keycode` and `react-addons-test-utils`)
 * Fix issue where component height would slightly shift after the first item was selected

# 0.3.0 - released 10/02/2019
 * Allow customisation of the error message with `ErrorComponent` prop
 * The "loading&hellip;" message now explicity says what string the user was searching for
 * Picker now shows a special "no suggestions found" message if there are no suggestions (as long as the input is not empty)
 * Don't show suggestions in the dropdown that have already been picked (otherwise we get duplicate item keys)
 * [Feature #9](https://github.com/atropos-tech/material-multi-picker/issues/9) - `getSuggestedItems` can now return a special `NOT_ENOUGH_CHARACTERS` symbol to get a message specific to that case
 * Fix [issue #8](https://github.com/atropos-tech/material-multi-picker/issues/8) - text field style now correctly changes when the picker loses focus
 * Fix [issue #6](https://github.com/atropos-tech/material-multi-picker/issues/6) - error dropdown now has more error-like style

# 0.2.2 - released 09/02/2019
 * Fix [issue #2](https://github.com/atropos-tech/material-multi-picker/issues/2) - adding, removing, and then re-adding an item did not work correctly

# 0.2.1 - released 08/02/2019
 * Fix [issue #1](https://github.com/atropos-tech/material-multi-picker/issues/1) - prevent flickering during typing when using synchronous suggestions

# 0.2.0 - released 08/02/2019
 * Allow custom icons in item chips with `itemToAvatar` prop
 * Fix incorrect spacing for input label (caused by extra padding)
 * Fix issue where the component would fail due to calling `itemToString` with `null`
 * Improvements to documentation, unit tests, sandbox demo, and linting
 * Fix issue making it impossible to create a custom SuggestionComponent that filled the available width in the dropdown

# 0.1.0 - released 07/02/2019
Initial release
 * Basic multipicking behaviour
 * Asynchronous suggestion fetching if `getSuggestedItems` returns a promise
 * Customisable pill appearance
 * Customisable suggestion appearance
 * Handling errors thrown by `getSuggestedItems`
 * Throttling calls to `getSuggestedItems`