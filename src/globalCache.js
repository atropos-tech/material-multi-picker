const caches = {};

function createGlobalCache() {
    const cachedData = {};
    const updateListeners = [];

    function notifyUpdate() {
        updateListeners.forEach(listener => {
            try {
                listener();
            } catch (error) {
                console.error(error);
            }
        });
    }

    function removeListener(listener) {
        const listenerIndex = updateListeners.indexOf(listener);
        if ( listenerIndex >= 0 ) {
            updateListeners.splice(listenerIndex, 1);
        }
    }

    return {
        getValue(key) {
            return cachedData[key];
        },
        setValue(key, value) {
            cachedData[key] = value;
            notifyUpdate();
        },
        subscribeToUpdates(updateListener) {
            updateListeners.push(updateListener);
            return () => removeListener(updateListener);
        },
        getListenerCount() {
            return updateListeners.length;
        }
    };
}

export function getGlobalCache(id) {
    if (!caches[id]) {
        caches[id] = createGlobalCache();
    }
    return caches[id];
}

export function resetAllCaches() {
    Object.keys(caches).forEach(key => {
        delete caches[key];
    });
}


