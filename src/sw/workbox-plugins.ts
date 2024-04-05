export class UseCacheKeyPlugin {

    private readonly key: string;

    constructor(key: string) {
        this.key = key;
    }

    async cacheKeyWillBeUsed(): Promise<Request | string> {
        return this.key;
    }

}
