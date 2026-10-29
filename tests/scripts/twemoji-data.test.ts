import { describe, expect, test } from '@jest/globals';

import { createTwemojiData } from "../../scripts/lib/twemoji-data";

describe("Twemoji catalog generation", () => {
    test("recognizes exactly the catalog despite shared prefixes and suffixes", () => {
        const codes = ["1", "1-1", "121", "1a1", "12", "2", "a-1", "a21", "aa1", "f00", "f01"];
        const data = createTwemojiData("15.0.3", codes);
        const pattern = new RegExp(data.pattern);
        const accepted: string[] = [];
        const visit = (candidate: string) => {
            if (pattern.test(candidate)) {
                accepted.push(candidate);
            }
            if (candidate.length < 5) {
                for (const char of "-012af") {
                    visit(candidate + char);
                }
            }
        };

        visit("");

        expect(accepted.sort()).toEqual([...codes].sort());
        expect(pattern.test("x1")).toBe(false);
        expect(pattern.test("1x")).toBe(false);
    });

    test("derives selector rules and preserves unusual SVG filenames as exceptions", () => {
        const data = createTwemojiData("15.0.3", [
            "2640",
            "2640-fe0f-200d-2642-fe0f",
            "1f575-fe0f-200d-2640-fe0f",
            "1f575-1f3fd-200d-2640-fe0f",
            "1f441-200d-1f5e8",
            // Future catalogs may contain names that do not follow the usual selector rules.
            "1f575-200d-1f9d1",
            "1f9d1-fe0f"
        ]);

        expect(data.version).toBe("15.0.3");
        expect([...data.selectorBases].sort()).toEqual(["1f575", "2640", "2642"]);
        expect(data.exceptions).toEqual({
            "1f575-200d-1f9d1": "1f575-200d-1f9d1",
            "1f9d1": "1f9d1-fe0f"
        });
        expect(new RegExp(data.pattern).test("1f575-200d-2640")).toBe(true);
        expect(new RegExp(data.pattern).test("1f575-fe0f-200d-2640-fe0f")).toBe(false);
    });

    test("generates stable data regardless of manifest order or duplicates", () => {
        const codes = ["1f600", "1f601", "1f575-fe0f-200d-2640-fe0f", "1f441-200d-1f5e8"];

        expect(createTwemojiData("15.0.3", [...codes].reverse().concat(codes[0])))
            .toEqual(createTwemojiData("15.0.3", codes));
    });
});
