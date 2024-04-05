import { WorkboxPlugin } from 'workbox-core';
import { CacheKeyWillBeUsedCallbackParam } from "workbox-core/src/types";

type CacheKey = string | ((url: string) => string);

export class UseCacheKeyPlugin implements WorkboxPlugin {

    private readonly key: CacheKey;

    constructor(key: CacheKey) {
        this.key = key;
    }

    async cacheKeyWillBeUsed({request: {url}}: CacheKeyWillBeUsedCallbackParam): Promise<Request | string> {
        if (typeof(this.key) === "function") {
            return this.key(url);
        } else {
            return this.key;
        }
    }

}
