import { describe, expect, test } from '@jest/globals';

import { NodeSourceUri } from "util/node-source-uri";

describe("node source URI", () => {
    test("identifies the service from the URI", () => {
        expect(NodeSourceUri.parse("https://t.me/moera").getService()).toBe("telegram");
        expect(NodeSourceUri.parse("https://example.com/moera").getService()).toBeUndefined();
    });
});
