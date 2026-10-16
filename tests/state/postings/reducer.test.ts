import { describe, expect, jest, test } from '@jest/globals';

import { PostingInfo, ReactionTotalsInfo, StoryInfo } from "api";
import { eventAction } from "api/events";
import { ClientAction } from "state/action";
import { ActionContext } from "state/action-types";
import { isDetailedPostingToBeLoaded } from "state/detailedposting/selectors";
import {
    postingCommentAddedBlocked, postingCommentCountUpdate, postingOperationsUpdated, postingReact, postingReactionDelete,
    postingsReactionSet, postingVisitRecorded
} from "state/postings/actions";
import reducer from "state/postings/reducer";
import { getPosting, isPostingCached } from "state/postings/selectors";
import { PostingsState } from "state/postings/state";
import { ClientState } from "state/state";
import { storyAdded, storyDeleted, storyUpdated } from "state/stories/actions";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { REL_CURRENT } from "util/rel-node-name";

jest.mock("api", () => ({}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("util/html", () => ({}));
jest.mock("util/text", () => ({}));

const context: ActionContext = {
    ownerName: "author", ownerNameOrUrl: "author", ownerFullName: null, ownerSourceUri: null,
    homeOwnerName: "author", homeOwnerNameOrUrl: "author", homeOwnerFullName: null,
    homeOwnerSourceUri: null, homeOwnerGender: null, homeOwnerAvatar: null, searchName: "search"
};

const posting: PostingInfo = {
    id: "post-1", revisionId: "revision-1", totalRevisions: 1, ownerName: "author", bodySrcHash: "hash",
    body: {text: "Normal post"}, heading: "Normal post", createdAt: 100, revisionCreatedAt: 100,
    totalComments: 4, sheriffs: [SHERIFF_GOOGLE_PLAY_TIMELINE]
};
const story: StoryInfo = {
    id: "story-1", feedName: "timeline", storyType: "posting-added", createdAt: 100, publishedAt: 100,
    moment: 100, posting
};
const totals: ReactionTotalsInfo = {entryId: "post-1", positive: [], negative: []};
const reaction = {negative: false, emoji: 128077};
const remoteReaction = eventAction({
    type: "REMOTE_REACTION_ADDED" as const, sourceNode: "author", remoteNodeName: "author",
    remotePostingId: "post-1", ...reaction, createdAt: 100
}, "HOME");
const blockReaction = eventAction({
    type: "BLOCKED_BY_USER_ADDED" as const, sourceNode: "author",
    blockedByUser: {
        id: "block-1", nodeName: "author", postingId: "post-1", blockedOperation: "reaction" as const, createdAt: 100
    }
}, "HOME");

interface PostingUpdate {
    action: ClientAction;
    changes: Partial<PostingInfo>;
}

const updates: PostingUpdate[] = [
    {
        action: postingOperationsUpdated("post-1", REL_CURRENT, {view: "public"}),
        changes: {operations: {view: "public"}}
    },
    {
        action: storyAdded(REL_CURRENT, story),
        changes: {feedReferences: [{feedName: "timeline", storyId: "story-1", publishedAt: 100, moment: 100}]}
    },
    {
        action: storyUpdated(REL_CURRENT, story),
        changes: {feedReferences: [{feedName: "timeline", storyId: "story-1", publishedAt: 100, moment: 100}]}
    },
    {action: storyDeleted(REL_CURRENT, story, "timeline", "post-1"), changes: {feedReferences: []}},
    {action: postingReact("post-1", false, 128077, REL_CURRENT), changes: {clientReaction: reaction}},
    {action: postingsReactionSet([], [totals], "author"), changes: {reactions: totals}},
    {action: postingCommentCountUpdate("post-1", "author", 1), changes: {totalComments: 5}},
    {
        action: eventAction({type: "POSTING_VIEWED" as const, sourceNode: "author", id: "post-1", viewCount: 3}, "HOME"),
        changes: {viewCount: 3}
    },
    {action: remoteReaction, changes: {clientReaction: reaction}},
    {
        action: postingCommentAddedBlocked("post-1", "block-1", REL_CURRENT),
        changes: {blockedInstants: [{id: "block-1", storyType: "comment-added"}]}
    },
    {
        action: eventAction({
            type: "BLOCKED_INSTANT_ADDED" as const, sourceNode: "author",
            blockedInstant: {id: "block-1", storyType: "comment-added" as const, entryId: "post-1", createdAt: 100}
        }, "HOME"),
        changes: {blockedInstants: [{id: "block-1", storyType: "comment-added"}]}
    },
    {
        action: eventAction({
            type: "BLOCKED_BY_USER_ADDED" as const, sourceNode: "author",
            blockedByUser: {
                id: "block-1", nodeName: "author", postingId: "post-1",
                blockedOperation: "comment" as const, createdAt: 100
            }
        }, "HOME"),
        changes: {blockedOperations: ["addComment"]}
    },
    {
        action: blockReaction,
        changes: {blockedOperations: ["addReaction"], blockedCommentOperations: ["addReaction"]}
    }
];

describe.each(updates)("posting partial update $action.type", ({action, changes}: PostingUpdate) => {
    test.each<[string, PostingsState]>([
        ["a missing node", {}],
        ["a missing posting entry", {author: {}}],
        ["visit metadata without a posting", {author: {"post-1": {visitRecorded: true}}}]
    ])("ignores %s without creating an incomplete posting", (_name: string, state: PostingsState) => {
        expect(reducer(state, {...action, context})).toEqual(state);
    });

    test("updates a loaded posting and preserves its content", () => {
        const original = {...posting, feedReferences: [{feedName: "timeline", storyId: "story-1", moment: 90}]};
        const state: PostingsState = {author: {"post-1": {posting: original, visitRecorded: true}}};
        const updated = reducer(state, {...action, context});

        expect(updated.author?.["post-1"]?.posting).toMatchObject(changes);
        expect(updated.author?.["post-1"]?.posting?.body).toEqual({text: "Normal post"});
        expect(updated.author?.["post-1"]?.posting?.sheriffs).toEqual([SHERIFF_GOOGLE_PLAY_TIMELINE]);
        expect(updated.author?.["post-1"]?.visitRecorded).toBe(true);
        expect(state.author?.["post-1"]?.posting).toBe(original);
        expect(original).toEqual({...posting, feedReferences: [{feedName: "timeline", storyId: "story-1", moment: 90}]});
    });
});

describe("posting updates with partially populated caches", () => {
    test("a late visit confirmation and reaction refresh do not prevent loading the posting", () => {
        const visited = reducer(undefined, {...postingVisitRecorded("post-1", REL_CURRENT), context});
        const postings = reducer(visited, {...postingsReactionSet([], [totals], "author"), context});
        const state = {
            postings,
            detailedPosting: {id: "post-1", loading: false},
            node: {owner: {name: "author"}},
            home: {owner: {name: "author"}},
            settings: {client: {meta: new Map(), values: new Map()}}
        } as unknown as ClientState;

        expect(getPosting(state, "post-1", REL_CURRENT)).toBeNull();
        expect(isPostingCached(state, "post-1", REL_CURRENT)).toBe(false);
        expect(isDetailedPostingToBeLoaded(state)).toBe(true);
        expect(postings.author?.["post-1"]?.visitRecorded).toBe(true);
    });

    test("a reaction refresh updates loaded postings while ignoring metadata-only and absent entries", () => {
        const state: PostingsState = {
            author: {"post-1": {posting}, pending: {visitRecorded: true}}
        };
        const updated = reducer(state, {
            ...postingsReactionSet([], [totals, {...totals, entryId: "pending"}, {...totals, entryId: "absent"}], "author"),
            context
        });

        expect(updated.author?.["post-1"]?.posting?.reactions).toEqual(totals);
        expect(updated.author?.pending).toEqual({visitRecorded: true});
        expect(updated.author?.absent).toBeUndefined();
    });

    test.each([
        {action: remoteReaction, changes: {clientReaction: reaction}},
        {action: postingCommentCountUpdate("post-1", "author", 1), changes: {totalComments: 5}}
    ])("$action.type updates a cached copy without creating its uncached original", ({action, changes}: PostingUpdate) => {
        const state: PostingsState = {
            author: {"post-1": {visitRecorded: true}},
            reader: {copy: {posting: {...posting, id: "copy", receiverName: "author", receiverPostingId: "post-1"}}}
        };
        const updated = reducer(state, {...action, context});

        expect(updated.author?.["post-1"]).toEqual({visitRecorded: true});
        expect(updated.reader?.copy?.posting).toMatchObject(changes);
        expect(updated.reader?.copy?.posting?.body).toEqual({text: "Normal post"});
    });

    test("a node-wide block applies only to loaded postings", () => {
        const state: PostingsState = {author: {"post-1": {posting}, pending: {visitRecorded: true}}};
        const updated = reducer(state, {
            ...blockReaction,
            payload: {...blockReaction.payload, blockedByUser: {...blockReaction.payload.blockedByUser, postingId: null}},
            context
        });

        expect(updated.author?.["post-1"]?.posting?.blockedOperations).toEqual(["addReaction"]);
        expect(updated.author?.["post-1"]?.posting?.blockedCommentOperations).toEqual(["addReaction"]);
        expect(updated.author?.pending).toEqual({visitRecorded: true});
    });
});

describe.each([
    postingReactionDelete("post-1", REL_CURRENT),
    eventAction({
        type: "REMOTE_REACTION_DELETED" as const, sourceNode: "author",
        remoteNodeName: "author", remotePostingId: "post-1"
    }, "HOME")
])("reaction removal $type", (action: ClientAction) => {
    test("does not create a posting after skipping a reaction update", () => {
        const visited = reducer(undefined, {...postingVisitRecorded("post-1", REL_CURRENT), context});
        const reacted = reducer(visited, {...remoteReaction, context});

        expect(reducer(reacted, {...action, context})).toEqual(visited);
    });

    test("removes a loaded posting's reaction while preserving its content", () => {
        const state: PostingsState = {author: {"post-1": {posting: {...posting, clientReaction: reaction}}}};
        const updated = reducer(state, {...action, context});

        expect(updated.author?.["post-1"]?.posting?.clientReaction).toBeUndefined();
        expect(updated.author?.["post-1"]?.posting?.body).toEqual({text: "Normal post"});
        expect(state.author?.["post-1"]?.posting?.clientReaction).toEqual(reaction);
    });
});

describe.each(["comment", "reaction"])("posting %s block removal", (blockedOperation: "comment" | "reaction") => {
    const added = eventAction({
        type: "BLOCKED_BY_USER_ADDED" as const, sourceNode: "author",
        blockedByUser: {id: "block-1", nodeName: "author", postingId: "post-1", blockedOperation, createdAt: 100}
    }, "HOME");
    const deleted = eventAction({type: "BLOCKED_BY_USER_DELETED" as const, ...added.payload}, "HOME");

    test.each<[string, PostingsState]>([
        ["an uncached posting", {}],
        ["visit metadata without a posting", {author: {"post-1": {visitRecorded: true}}}]
    ])("does not create %s after skipping a block", (_name: string, state: PostingsState) => {
        const blocked = reducer(state, {...added, context});

        expect(reducer(blocked, {...deleted, context})).toEqual(state);
    });

    test.each([undefined, null])("handles a newly loaded posting with block lists set to %s", (missing: null | undefined) => {
        const state: PostingsState = {
            author: {"post-1": {posting: {...posting, blockedOperations: missing, blockedCommentOperations: missing}}}
        };
        const updated = reducer(state, {...deleted, context});

        expect(updated.author?.["post-1"]?.posting?.blockedOperations).toEqual([]);
        if (blockedOperation === "reaction") {
            expect(updated.author?.["post-1"]?.posting?.blockedCommentOperations).toEqual([]);
        }
        expect(updated.author?.["post-1"]?.posting?.body).toEqual({text: "Normal post"});
    });

    test("removes the requested block while preserving another block", () => {
        const state: PostingsState = {
            author: {"post-1": {posting: {
                ...posting, blockedOperations: ["addComment", "addReaction"], blockedCommentOperations: ["addReaction"]
            }}}
        };
        const updated = reducer(state, {...deleted, context});

        expect(updated.author?.["post-1"]?.posting?.blockedOperations)
            .toEqual(blockedOperation === "comment" ? ["addReaction"] : ["addComment"]);
        expect(updated.author?.["post-1"]?.posting?.blockedCommentOperations)
            .toEqual(blockedOperation === "reaction" ? [] : ["addReaction"]);
    });
});
