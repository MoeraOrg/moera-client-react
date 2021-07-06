export function mapWithKeysOnly<Key, Value>(map: Map<Key, Value> | null,
                                            keys: Key[] | Set<Key>): Map<Key, Value> | null {
    if (map == null) {
        return map;
    }
    if (Array.isArray(keys)) {
        keys = new Set(keys);
    }
    let result = new Map();
    keys.forEach(key => {
        const value = map.get(key);
        if (value != null) {
            result.set(key, value)
        }
    });
    return result;
}

export function mapWithoutKeys<Key, Value>(map: Map<Key, Value> | null,
                                           keys: Key[] | Set<Key>): Map<Key, Value> | null {
    if (map == null) {
        return map;
    }
    if (Array.isArray(keys)) {
        keys = new Set(keys);
    }
    let result = new Map();
    map.forEach((value, key) => {
        if (!(keys as Set<Key>).has(key)) {
            result.set(key, value)
        }
    });
    return result;
}

type MapFilter<Value, Key> = (v: Value, k: Key) => boolean;

export function mapFilter<Key, Value>(map: Map<Key, Value> | null,
                                      filter: MapFilter<Value, Key>): Map<Key, Value> | null {
    if (map == null) {
        return map;
    }
    let result = new Map();
    map.forEach((value, key) => {
        if (filter(value, key)) {
            result.set(key, value)
        }
    });
    return result;
}

export function mapEquals<Key, Value>(map1: Map<Key, Value> | null, map2: Map<Key, Value> | null): boolean {
    if ((map1 == null || map1.size === 0) && (map2 == null || map2.size === 0)) {
        return true;
    }
    if (map1 == null || map1.size === 0 || map2 == null || map2.size === 0) {
        return false;
    }
    if (map1.size !== map2.size) {
        return false;
    }
    // @ts-ignore
    for (const [key, value] of map1) {
        if (!map2.has(key) || map2.get(key) !== value) {
            return false;
        }
    }
    return true;
}
