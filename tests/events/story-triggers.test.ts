import { describe, expect, jest, test } from '@jest/globals';

import { FeedReference, PostingInfo } from "api";
import { eventAction } from "api/events";
import { ClientAction } from "state/action";
import { ActionContext } from "state/action-types";
import feedTriggers from "state/feeds/triggers";
import reducer from "state/postings/reducer";
import { PostingsState } from "state/postings/state";
import { ClientState } from "state/state";
import { collectTriggers, invokeTriggers } from "state/trigger";

jest.mock("api", () => ({}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("util/html", () => ({}));
jest.mock("util/text", () => ({}));

const triggers = collectTriggers(feedTriggers);
const context: ActionContext = {
    ownerName: "author", ownerNameOrUrl: "author", ownerFullName: null, ownerSourceUri: null,
    homeOwnerName: "reader", homeOwnerNameOrUrl: "reader", homeOwnerFullName: null,
    homeOwnerSourceUri: null, homeOwnerGender: null, homeOwnerAvatar: null, searchName: "search"
};
const posting: PostingInfo = {
    id: "post-1", revisionId: "revision-1", totalRevisions: 1, ownerName: "author", bodySrcHash: "hash",
    body: {text: "Normal post"}, heading: "Normal post", createdAt: 100, revisionCreatedAt: 100
};
const reference: FeedReference = {
    feedName: "timeline", storyId: "story-1", publishedAt: 100, pinned: false, moment: 100
};
const otherReference: FeedReference = {
    feedName: "timeline", storyId: "story-2", publishedAt: 90, moment: 90
};

function applyEvent(state: PostingsState, event: ClientAction): PostingsState {
    let updated = reducer(state, {...event, context});
    invokeTriggers(triggers, {...event, context}, {
        getState: () => ({postings: updated}) as ClientState,
        dispatch: <T extends ClientAction>(action: T): T => {
            updated = reducer(updated, {...action, context});
            return action;
        }
    });
    return updated;
}

interface StoryEventSource {
    source: "NODE" | "HOME";
    nodeName: string;
    otherNodeName: string;
}

describe.each([
    {source: "NODE" as const, nodeName: "author", otherNodeName: "reader"},
    {source: "HOME" as const, nodeName: "reader", otherNodeName: "author"}
])("$source story events update posting feed references", ({source, nodeName, otherNodeName}: StoryEventSource) => {
    const added = eventAction({
        type: "STORY_ADDED" as const, sourceNode: nodeName, id: "story-1", storyType: "posting-added" as const,
        feedName: "timeline", postingId: "post-1", publishedAt: 100, pinned: false, moment: 100
    }, source);
    const deleted = eventAction({
        type: "STORY_DELETED" as const, sourceNode: nodeName, id: "story-1", storyType: "posting-added" as const,
        feedName: "timeline", postingId: "post-1", moment: 100
    }, source);
    const updated = eventAction({
        ...added.payload, type: "STORY_UPDATED" as const, pinned: true, moment: 200
    }, source);

    function initialState(feedReferences: FeedReference[] | null | undefined): PostingsState {
        return {
            [nodeName]: {
                "post-1": {posting: {...posting, feedReferences}, visitRecorded: true},
                "other-post": {posting: {...posting, id: "other-post", feedReferences: [reference]}}
            },
            [otherNodeName]: {"post-1": {posting: {...posting, feedReferences: [reference]}}}
        };
    }

    test("adds a reference using postingId and preserves other stories and postings", () => {
        const state = initialState([otherReference]);
        const result = applyEvent(state, added);

        expect(result[nodeName]?.["post-1"]?.posting).toMatchObject({
            ...posting, feedReferences: [otherReference, expect.objectContaining(reference)]
        });
        expect(result[nodeName]?.["post-1"]?.visitRecorded).toBe(true);
        expect(result[nodeName]?.["other-post"]).toBe(state[nodeName]?.["other-post"]);
        expect(result[otherNodeName]).toBe(state[otherNodeName]);
        expect(state[nodeName]?.["post-1"]?.posting?.feedReferences).toEqual([otherReference]);
    });

    test.each([{references: undefined}, {references: null}, {references: []}])(
        "adds the first reference when feedReferences is $references",
        ({references}: {references: FeedReference[] | null | undefined}) => {
            const result = applyEvent(initialState(references), added);

            expect(result[nodeName]?.["post-1"]?.posting?.feedReferences)
                .toEqual([expect.objectContaining(reference)]);
        }
    );

    test("repeated additions do not duplicate an existing story", () => {
        const state = initialState([otherReference, reference]);
        const result = applyEvent(applyEvent(state, added), added);

        expect(result[nodeName]?.["post-1"]?.posting?.feedReferences)
            .toEqual([otherReference, expect.objectContaining(reference)]);
    });

    test("removes only the deleted story from the posting on the event's node", () => {
        const state = initialState([reference, otherReference]);
        const result = applyEvent(state, deleted);

        expect(result[nodeName]?.["post-1"]?.posting).toEqual({...posting, feedReferences: [otherReference]});
        expect(result[nodeName]?.["other-post"]).toBe(state[nodeName]?.["other-post"]);
        expect(result[otherNodeName]).toBe(state[otherNodeName]);
        expect(state[nodeName]?.["post-1"]?.posting?.feedReferences).toEqual([reference, otherReference]);
        expect(applyEvent(result, deleted)).toEqual(result);
    });

    test("updates reference attributes without duplicating the story", () => {
        const result = applyEvent(initialState([otherReference, reference]), updated);

        expect(result[nodeName]?.["post-1"]?.posting?.feedReferences).toEqual([
            otherReference, expect.objectContaining({...reference, pinned: true, moment: 200})
        ]);
    });

    test.each([added, deleted, updated])("$type ignores missing postings and visit-only entries", (action: ClientAction) => {
        for (const state of [{}, {[nodeName]: {}}, {[nodeName]: {"post-1": {visitRecorded: true}}}]) {
            expect(applyEvent(state, action)).toEqual(state);
        }
    });

    test.each([
        {...added, payload: {...added.payload, postingId: null}},
        {...deleted, payload: {...deleted.payload, postingId: null}},
        {...updated, payload: {...updated.payload, postingId: null}}
    ])("$type ignores stories without a postingId", (action: ClientAction) => {
        const state = initialState([reference, otherReference]);

        expect(applyEvent(state, action)).toEqual(state);
    });
});
