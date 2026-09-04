import { describe, expect, jest, test } from '@jest/globals';

import { formatNodeName } from "ui/instant/instant-elements";

jest.mock("util/html", () => ({
    htmlEntities: (value: string | null | undefined) => value?.replaceAll("&", "&amp;")
}));
jest.mock("api", () => ({NodeName: {shorten: (value: string | null | undefined) => value}}));

describe("instant node name", () => {
    test("keeps the source URI in the generated mention markup", () => {
        const html = formatNodeName({
            ownerName: "alice",
            ownerFullName: "Alice",
            ownerSourceUri: "source:https://t.me/alice?x=1&y=2"
        });

        expect(html).toBe(
            '<span class="node-name" data-nodename="alice" '
            + 'data-source-uri="source:https://t.me/alice?x=1&amp;y=2">Alice</span>'
        );
    });
});
