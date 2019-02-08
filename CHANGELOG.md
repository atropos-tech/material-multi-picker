# 0.2.0 - released 08/02/2019
 * Allow users to add custom icons to item pills with `itemToAvatar` prop
 * Fix incorrect spacing for input label (caused by extra padding)
 * Fix issue where the component would fail due to calling `itemToString` with `null`
 * Improvements to documentation, unit tests, sandbox demo, and linting
 * Fix issue making it impossible to create a custom SuggestionComponent that filled the available width in the dropdown

# 0.1.0 - released 07/02/2019
Initial release
 * Basic multipicking behaviour
 * Asynchronous suggestion fetching if `getSuggestionItems` returns a promise
 * Customisable pill appearance
 * Customisable suggestion appearance
 * Handling errors thrown by `getSuggestionItems`
 * Throttling calls to `getSuggestionItems`