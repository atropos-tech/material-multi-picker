import { useState, useEffect, useRef } from "react";
import { asPromise, LOADING, assertSuggestionsValid } from "./utils";
import { getGlobalCache } from "./globalCache";

export { NOT_ENOUGH_CHARACTERS } from "./utils";

function useForceUpdate() {
    const [ , setState ] = useState();
    return () => setState({});
}

function useLoadingCache(globalCacheId) {
    const [ cache, setCache ] = useState({});
    const forceUpdate = useForceUpdate();
    const globalCache = globalCacheId ? getGlobalCache(globalCacheId) : false;

    useEffect(() => {
        if (globalCache) {
            return globalCache.subscribeToUpdates(forceUpdate); //returns an unsubscribe function
        }
    }, [globalCache]);

    function getValue(key) {
        if (globalCache) {
            return globalCache.getValue(key);
        }
        return cache[key];
    }

    function setValue(key, value) {
        if (globalCache) {
            globalCache.setValue(key, value);
        } else {
            setCache(previousCache => ({ ...previousCache, [key]: value }));
        }
    }

    return [
        getValue,
        setValue,
        key => setValue(key, LOADING)
    ];
}

function useIsMounted() {
    const isMounted = useRef(true);
    useEffect(() => () => {
        isMounted.current = false;
    }, []);
    return () => isMounted.current;
}

export default function useCachedSuggestions(inputValue, chosenItems, getSuggestedItems, globalCacheId, fetchDelay = 0) {
    const [ getSuggestions, storeSuggestions, setSuggestionsLoading ] = useLoadingCache(globalCacheId);
    const isMounted = useIsMounted();
    useEffect(() => {
        let finishedTimeout = false;
        const existingSuggestions = getSuggestions(inputValue);
        if (!existingSuggestions) {
            setSuggestionsLoading(inputValue);
            const timeout = setTimeout(() => {
                finishedTimeout = true;
                asPromise(() => getSuggestedItems(inputValue, chosenItems) ).then(suggestions => {
                    if (isMounted()) {
                        assertSuggestionsValid(suggestions);
                        storeSuggestions(inputValue, suggestions);
                    }
                }).catch(error => {
                    if (isMounted()) {
                        storeSuggestions(inputValue, error);
                    }
                });
            }, fetchDelay);

            return () => {
                if (!finishedTimeout) {
                    clearTimeout(timeout);
                    storeSuggestions(inputValue, undefined);
                }
            };
        }
    }, [inputValue, chosenItems]);

    return getSuggestions(inputValue) || [];
}
