import { describe, expect, jest, test } from '@jest/globals';

import { eventAction, EventSource } from "api/events";
import { ActionContext } from "state/action-types";
import { nodeCardStoriesSet } from "state/nodecards/actions";
import reducer from "state/nodecards/reducer";

jest.mock("util/html", () => ({safeHtml: (html: string | null | undefined) => html}));

const context: ActionContext = {
    ownerName: "alice",
    ownerNameOrUrl: "alice",
    ownerFullName: null,
    ownerSourceUri: null,
    homeOwnerName: "bob",
    homeOwnerNameOrUrl: "bob",
    homeOwnerFullName: null,
    homeOwnerSourceUri: null,
    homeOwnerGender: null,
    homeOwnerAvatar: null,
    searchName: "search"
};

describe.each<[EventSource, string, string]>([
    ["NODE", "alice", "bob"],
    ["HOME", "bob", "alice"]
])("node card post count from %s events", (source, nodeName, otherNodeName) => {
    const statusEvent = (feedName: string, total: number) => ({
        ...eventAction({
            type: "FEED_STATUS_UPDATED" as const,
            sourceNode: nodeName,
            feedName,
            status: {total, totalPinned: 0}
        }, source),
        context
    });

    test("updates the correct card, including when the last post is deleted", () => {
        let state = reducer(undefined, {...nodeCardStoriesSet("alice", 10, 100), context});
        state = reducer(state, {...nodeCardStoriesSet("bob", 10, 100), context});
        const updated = reducer(state, statusEvent("timeline", 11));

        expect(updated.cards[nodeName]?.stories.storiesTotal).toBe(11);
        expect(updated.cards[otherNodeName]).toBe(state.cards[otherNodeName]);
        expect(updated.cards[nodeName]?.stories.lastStoryCreatedAt).toBe(100);
        expect(state.cards[nodeName]?.stories.storiesTotal).toBe(10);
        expect(reducer(updated, statusEvent("timeline", 0)).cards[nodeName]?.stories.storiesTotal).toBe(0);
    });

    test("ignores counts from other feeds", () => {
        const state = reducer(undefined, {...nodeCardStoriesSet(nodeName, 10, 100), context});

        expect(reducer(state, statusEvent("news", 20))).toBe(state);
    });
});
