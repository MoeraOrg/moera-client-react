import { describe, expect, jest, test } from '@jest/globals';

import { htmlToEmoji, replaceEmojis, safeHtml, safePreviewHtml } from "util/html";

jest.mock("util/media-images", () => ({}));

describe("emoji rendering in HTML", () => {
    test.each([
        ["🤷‍♀", "🤷‍♀"],
        ["👩🏽‍💻", "👩🏽‍💻"],
        ["&#129335;&#8205;&#9792;&#65039;", "🤷‍♀️"],
        ["🤷&zwj;♀️", "🤷‍♀️"],
        ["&#x1f937;‍♀️", "🤷‍♀️"]
    ])("renders a whole emoji from %s", (input, expected) => {
        const element = document.createElement("div");
        element.innerHTML = replaceEmojis(`<p>${input}</p>`);

        expect(element.querySelectorAll(".emoji")).toHaveLength(1);
        expect(element.querySelector(".emoji")?.textContent).toBe(expected);
        expect(element.textContent).toBe(expected);
    });

    test("preserves unsupported emoji sequences beside supported ones", () => {
        const element = document.createElement("div");
        element.innerHTML = replaceEmojis("🙂‍↔️ 🤷‍♀ 🫩🏻");

        expect(element.querySelectorAll(".emoji")).toHaveLength(1);
        expect(element.querySelector(".emoji")?.textContent).toBe("🤷‍♀");
        expect(element.textContent).toBe("🙂‍↔️ 🤷‍♀ 🫩🏻");
    });

    test("keeps emojis inside attributes and escaped markup as text", () => {
        const element = document.createElement("div");
        element.innerHTML = replaceEmojis(
            '<a href="/🤷‍♀" title="👩🏽‍💻">🤷‍♀</a> &lt;img src=x onerror=alert(1)&gt;'
        );

        expect(element.querySelector("a")?.getAttribute("href")).toBe("/🤷‍♀");
        expect(element.querySelector("a")?.getAttribute("title")).toBe("👩🏽‍💻");
        expect(element.querySelectorAll(".emoji")).toHaveLength(1);
        expect(element.querySelector("img")).toBeNull();
        expect(element.textContent).toBe("🤷‍♀ <img src=x onerror=alert(1)>");
    });

    test.each([safeHtml, safePreviewHtml])("keeps composed emojis intact when sanitizing posts", sanitize => {
        const element = document.createElement("div");
        element.innerHTML = sanitize('<p>🤷‍♀ 👁️‍🗨️</p><script>alert(1)</script>', null, false);

        expect(element.querySelectorAll(".emoji")).toHaveLength(2);
        expect(element.querySelector("script")).toBeNull();
        expect(element.textContent).toBe("🤷‍♀ 👁️‍🗨️");
        expect(element.querySelector(".emoji")?.getAttribute("style")).toContain("1f937-200d-2640-fe0f.svg");
    });

    test("does not nest emoji markup when rendering the same HTML again", () => {
        const html = replaceEmojis("👩🏽‍💻");

        expect(replaceEmojis(html)).toBe(html);
    });

    test("restores composed emojis when converting rendered HTML back to text", () => {
        const html = '<b class="emoji" style="background-image: url(emoji.svg)">👩🏽‍💻</b>';

        expect(htmlToEmoji(html)).toBe("👩🏽‍💻");
    });
});
