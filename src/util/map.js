export function mapWithKeysOnly(map, keys) {
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

export function mapWithoutKeys(map, keys) {
    if (map == null) {
        return map;
    }
    if (Array.isArray(keys)) {
        keys = new Set(keys);
    }
    let result = new Map();
    map.forEach((value, key) => {
        if (!keys.has(key)) {
            result.set(key, value)
        }
    });
    return result;
}

export function mapFilter(map, filter) {
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

export function mapEquals(map1, map2) {
    if ((map1 == null || map1.size === 0) && (map2 == null || map2.size === 0)) {
        return true;
    }
    if (map1 == null || map1.size === 0 || map2 == null || map2.size === 0) {
        return false;
    }
    if (map1.size !== map2.size) {
        return false;
    }
    for (const [key, value] of map1) {
        if (!map2.has(key) || map2.get(key) !== value) {
            return false;
        }
    }
    return true;
}
