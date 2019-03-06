import { oneOf, oneOfType, array, instanceOf } from "prop-types";

export const noop = () => { /* do nothing */ };

export const isError = possibleError => possibleError instanceof Error;

export const BACKSPACE_KEYCODE = 8;
export const isBackspace = keyEvent => keyEvent.keyCode === BACKSPACE_KEYCODE;

export function getLast(sourceArray) {
    if (sourceArray.length) {
        return sourceArray[sourceArray.length - 1];
    }
}

export function asPromise(delegate) {
    return new Promise(( resolve, reject ) => {
        try {
            resolve(delegate());
        } catch (error) {
            reject(error);
        }
    });
}

export const LOADING = Symbol("loading");
export const NOT_ENOUGH_CHARACTERS = Symbol("not enough characters");

export function assertSuggestionsValid(suggestions) {
    if (Array.isArray(suggestions)) {
        return true;
    }
    if (suggestions === NOT_ENOUGH_CHARACTERS) {
        return true;
    }
    throw new Error(`Invalid suggestions returned - expected an array, but instead got ${suggestions}`);
}

export const suggestionsPropType = oneOfType([
    array,
    instanceOf(Error),
    oneOf([ LOADING, NOT_ENOUGH_CHARACTERS ])
]);

export const materialColorPropType = oneOf(["default", "primary", "secondary"]);
