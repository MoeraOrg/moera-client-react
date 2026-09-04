import { describe, expect, jest, test } from '@jest/globals';

import { eventAction } from "api/events";
import reducer from "state/nodecards/reducer";

jest.mock("util/html", () => ({safeHtml: (html: string | null | undefined) => html}));

describe("node card source URI", () => {
    test("updates the profile source URI from a remote full-name event", () => {
        const action = eventAction({
            type: "REMOTE_NODE_FULL_NAME_CHANGED",
            sourceNode: "home",
            name: "alice",
            fullName: "Alice",
            nodeSourceUri: "source:https://t.me/alice",
            title: "Writer"
        }, "HOME");

        const state = reducer(undefined, action as any);

        expect(state.cards.alice?.details.profile.sourceUri).toBe("source:https://t.me/alice");
    });
});
