import clone from './clone';

export default cacheSystem;

function cacheSystem(initialValue = {}) {
    const cache = initialValue;
    return {
        /**
         * Get clone of whole cache
         */
        all() {
            return clone(cache);
        },
        /**
         * Set value for deeply nested key in cache (overwrites previous value)
         *
         * @param {string[]} key - Key name
         * @param {*} value - any value
         * @return {object} this - The cache object itself for chaining
         *
         * @example
         *
         *     set(['foo', 'bar'], true)
         */
        set(keys = [], value) {
            mutate(keys, value, cache);
            return this;
        },
        /**
         * Get value from cache by key
         *
         * @param {string[]} keys Key name
         *
         * @example
         *
         *     get(['foo', 'bar'])
         */
        get(keys = []) {
            return path(keys, cache);
        },
    };
}

function path(keys = [], data = {}) {
    return keys.reduce((value, key) => value[key] || {}, data);
}

/* eslint-disable no-param-reassign */
function mutate(keys = [], value, data = {}) {
    return keys.reduce((obj, key, idx) => {
        // check if final key
        if (idx === keys.length - 1) {
            obj[key] = value;
            return data;
        }

        if (obj[key] === undefined) {
            obj[key] = {};
            return obj[key];
        }

        return obj[key];
    }, data);
}
/* eslint-enable */
