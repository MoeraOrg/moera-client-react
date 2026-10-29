function createPattern(codes) {
    const root = {terminal: false, children: new Map()};
    for (const code of codes) {
        let node = root;
        for (const char of code) {
            if (!node.children.has(char)) {
                node.children.set(char, {terminal: false, children: new Map()});
            }
            node = node.children.get(char);
        }
        node.terminal = true;
    }

    function render(node) {
        if (node.children.size === 0) {
            return "";
        }
        // Share prefixes through the trie, then merge branches with identical suffixes.
        const suffixes = new Map();
        for (const [char, child] of node.children) {
            const suffix = render(child);
            if (!suffixes.has(suffix)) {
                suffixes.set(suffix, []);
            }
            suffixes.get(suffix).push(char);
        }
        const alternatives = Array.from(suffixes, ([suffix, chars]) => {
            // Codes contain only hex digits and hyphens; escape hyphens inside character classes.
            const prefix = chars.length === 1 ? chars[0] : `[${chars.join("").replaceAll("-", "\\-")}]`;
            return prefix + suffix;
        });
        const pattern = alternatives.length === 1 ? alternatives[0] : `(?:${alternatives.join("|")})`;
        return node.terminal ? `(?:${pattern})?` : pattern;
    }

    return `^(?:${render(root)})$`;
}

function createTwemojiData(version, emojis) {
    const codes = [...new Set(emojis)].sort();
    const normalized = new Map(codes.map(code => [code.replaceAll("-fe0f", ""), code]));
    const selectorBases = new Set();
    for (const code of codes) {
        const parts = code.split("-");
        if (parts.includes("200d")) {
            parts.forEach((part, index) => {
                if (parts[index + 1] === "fe0f") {
                    selectorBases.add(part);
                }
            });
        }
    }

    // Most ZWJ filenames restore selectors after these bases, unless a skin tone follows.
    // Preserve any exceptions so a future catalog need not follow the same naming convention.
    const exceptions = {};
    for (const [key, code] of normalized) {
        const parts = key.split("-");
        const predicted = parts.includes("200d")
            ? parts.map((part, index) => selectorBases.has(part) && !/^1f3f[b-f]$/.test(parts[index + 1] ?? "")
                ? `${part}-fe0f` : part).join("-")
            : key;
        if (predicted !== code) {
            exceptions[key] = code;
        }
    }

    return {
        version,
        pattern: createPattern([...normalized.keys()].sort()),
        selectorBases: [...selectorBases].sort(),
        exceptions
    };
}

module.exports = {createTwemojiData};
