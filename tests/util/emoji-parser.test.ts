import { describe, expect, test } from '@jest/globals';

import { parseEmojis } from "util/emoji-parser";

describe("emoji sequences", () => {
    test.each([
        ["🤷‍♀", "1f937-200d-2640-fe0f"],
        ["🤷🏽‍♀", "1f937-1f3fd-200d-2640-fe0f"],
        ["🤦🏻‍♂", "1f926-1f3fb-200d-2642-fe0f"],
        ["🕵‍♀️", "1f575-fe0f-200d-2640-fe0f"],
        ["🕵🏽‍♀", "1f575-1f3fd-200d-2640-fe0f"],
        ["🏋‍♀", "1f3cb-fe0f-200d-2640-fe0f"],
        ["🏋🏿‍♀", "1f3cb-1f3ff-200d-2640-fe0f"],
        ["❤‍🔥", "2764-fe0f-200d-1f525"],
        ["👩🏽‍❤‍👨🏻", "1f469-1f3fd-200d-2764-fe0f-200d-1f468-1f3fb"],
        ["👩🏽‍💻", "1f469-1f3fd-200d-1f4bb"],
        ["👨‍👩‍👧‍👦", "1f468-200d-1f469-200d-1f467-200d-1f466"],
        ["👩🏻‍🤝‍👩🏿", "1f469-1f3fb-200d-1f91d-200d-1f469-1f3ff"],
        ["👁️‍🗨️", "1f441-200d-1f5e8"],
        ["🏳‍🌈", "1f3f3-fe0f-200d-1f308"],
        ["🐦‍⬛", "1f426-200d-2b1b"],
        ["🫷🏽", "1faf7-1f3fd"],
        ["🩷", "1fa77"],
        ["♾️", "267e"],
        ["©️", "a9"],
        ["®️", "ae"],
        ["™️", "2122"],
        ["#️⃣", "23-20e3"],
        ["1⃣", "31-20e3"],
        ["🇺🇦", "1f1fa-1f1e6"],
        ["🏴\u{e0067}\u{e0062}\u{e0065}\u{e006e}\u{e0067}\u{e007f}",
            "1f3f4-e0067-e0062-e0065-e006e-e0067-e007f"]
    ])("renders %s as one complete emoji", (text, code) => {
        const entities = parseEmojis(text);

        expect(entities).toHaveLength(1);
        expect(entities[0]).toMatchObject({text, indices: [0, text.length]});
        expect(entities[0].url.endsWith(`/${code}.svg`)).toBe(true);
    });

    test.each(["🙂‍↔️", "🚶‍♀️‍➡️", "🫩🏻", "😀‍🦄", "©", "®", "™", "©︎", "1 # *", "\ufe0e\ufe0f"])(
        "leaves unsupported sequences and text unchanged: %s", text => {
            expect(parseEmojis(text)).toEqual([]);
        }
    );

    test("preserves UTF-16 offsets around adjacent emojis and unsupported sequences", () => {
        const entities = parseEmojis("a🙂‍↔️🤷‍♀👍🏿z");

        expect(entities.map(({text, indices}) => ({text, indices}))).toEqual([
            {text: "🤷‍♀", indices: [6, 10]},
            {text: "👍🏿", indices: [10, 14]}
        ]);
    });
});
