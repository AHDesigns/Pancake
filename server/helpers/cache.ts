import clone from './clone';
import startupCache from './startupCache';
import { ICache } from '@types';

export default cacheSystem;

function cacheSystem(initialValue = startupCache()): ICache {
    const cache = initialValue;
    return {
        all() {
            return clone(cache);
        },
        set(repo, key, value) {
            if (cache[repo]) {
                cache[repo][key] = value;
            }
            return this;
        },
        get(repo, key) {
            return cache[repo] && cache[repo][key];
        },
    } as ICache;
}
