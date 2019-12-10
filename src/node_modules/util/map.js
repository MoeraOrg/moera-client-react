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
