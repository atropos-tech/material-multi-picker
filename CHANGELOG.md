# 0.3.0 - released 10/02/2019
 * Allow users to customise the error message with `ErrorComponent` prop
 * The "loading&hellip;" message now explicity says what string the user was searching for
 * Picker now shows a special "no suggestions found" message if there are no suggestions (as long as the input is not empty)
 * [Feature #9](https://github.com/atropos-tech/material-multi-picker/issues/9) - `getSuggestedItems` can now return a special `NOT_ENOUGH_CHARACTERS` symbol to get a message specific to that case
 * Fix [issue #8](https://github.com/atropos-tech/material-multi-picker/issues/8) - text field style now correctly changes when the picker loses focus
 * Fix [issue #6](https://github.com/atropos-tech/material-multi-picker/issues/6) - error dropdown now has more error-like style

# 0.2.2 - released 09/02/2019
 * Fix [issue #2](https://github.com/atropos-tech/material-multi-picker/issues/2) - adding, removing, and then re-adding an item did not work correctly

# 0.2.1 - released 08/02/2019
 * Fix [issue #1](https://github.com/atropos-tech/material-multi-picker/issues/1) - prevent flickering during typing when using synchronous suggestions

# 0.2.0 - released 08/02/2019
 * Allow users to add custom icons to item pills with `itemToAvatar` prop
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