export const isFunction = possibleFunction => typeof possibleFunction === "function";

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
