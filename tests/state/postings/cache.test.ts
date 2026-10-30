import { PostingInfo, StoryInfo } from "api";
import { ActionContext } from "state/action-types";
import { feedPastSliceSet } from "state/feeds/actions";
import { ownerSwitch } from "state/node/actions";
import { postingSet, postingsPrune, postingsSet } from "state/postings/actions";
import * as cache from "state/postings/cache";
import reducer from "state/postings/reducer";
import { PostingReference, PostingsState } from "state/postings/state";
import { ClientState } from "state/state";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";

jest.mock("api", () => ({}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("util/text", () => ({}));
jest.mock("util/html", () => ({
    safeHtml: (text: string) => text,
    safePreviewHtml: (text: string) => text
}));

const context = {
    ownerName: "current", ownerNameOrUrl: "current", homeOwnerName: "home", homeOwnerNameOrUrl: "home"
} as ActionContext;
const posting = {
    id: "post", body: {text: "Posting body"}, heading: "Posting", ownerName: "author"
} as PostingInfo;

function prune(state: PostingsState, at: number, references: PostingReference[] = []): PostingsState {
    const action = postingsPrune(references, at);
    return reducer(state, {...action, context});
}

function reserve(count: number, at: number): PostingsState {
    return {spare: Object.fromEntries(Array.from({length: count}, (_, i) =>
        [`post-${i}`, {posting: {...posting, id: `post-${i}`}, lastUsedAt: at}]
    ))};
}

function collectReferences(state: Partial<ClientState>): PostingReference[] {
    return cache.getReferencedPostings({
        node: {owner: {name: "current"}},
        home: {owner: {name: "home"}},
        settings: {client: {meta: new Map(), values: new Map()}},
        ...state
    } as ClientState);
}

describe("posting cache lifetime", () => {
    beforeEach(() => jest.spyOn(Date, "now").mockReturnValue(1_000_000));
    afterEach(() => jest.restoreAllMocks());

    test("starts a grace period when a posting is loaded", () => {
        const state = reducer({}, {...postingSet(posting, "remote.example"), context});

        expect(state["remote.example"]?.post?.lastUsedAt).toBe(1000);
    });

    test("keeps remote postings across an owner switch", () => {
        const state = {remote: {post: {posting}}};

        expect(reducer(state, {...ownerSwitch("other", "https://other"), context})).toBe(state);
    });

    test("timestamps batch loads and stores them under their requested node", () => {
        const state = reducer({}, {...postingsSet([posting], "remote.example"), context});

        expect(state["remote.example"]?.post?.lastUsedAt).toBe(1000);
        expect(state.current).toBeUndefined();
    });

    test("timestamps feed postings under the feed's node", () => {
        const story = {id: "story", posting} as StoryInfo;
        const action = feedPastSliceSet("home", "news", [story], 100, 0, 0, 0);
        const state = reducer({}, {...action, context});

        expect(state.home?.post?.lastUsedAt).toBe(1000);
        expect(state.current).toBeUndefined();
    });

    test("evicts the oldest unused entry and removes its empty node bucket", () => {
        const state = {...reserve(300, 800), "old.example": {post: {posting, lastUsedAt: 100}}};
        const updated = prune(state, 1000);

        expect(updated["old.example"]).toBeUndefined();
        expect(updated.spare).toBe(state.spare);
        expect(state["old.example"].post.posting).toBe(posting);
    });

    test("allows a fresh burst above the limit until the exact one-minute boundary", () => {
        const state = reserve(301, 1000);

        expect(prune(state, 1059)).toBe(state);
        expect(Object.keys(prune(state, 1060).spare!)).toHaveLength(300);
    });

    test("keeps a referenced remote entry and 300 unused entries", () => {
        const state = {...reserve(300, 800), "remote.example": {post: {posting, lastUsedAt: 100}}};
        const updated = prune(state, 1000, [{nodeName: "remote.example", postingId: "post"}]);

        expect(updated["remote.example"]?.post?.posting).toBe(posting);
        expect(Object.keys(updated.spare!)).toHaveLength(300);
    });

    test.each([{deleting: true}, {verificationStatus: "running" as const}])(
        "keeps an entry with active operations: %o", metadata => {
            const state = {...reserve(300, 800), remote: {post: {posting, lastUsedAt: 100, ...metadata}}};

            expect(prune(state, 1000).remote?.post?.posting).toBe(posting);
        }
    );

    test("starts a grace period when a previously observed state reference is released", () => {
        const state = {...reserve(300, 1000), remote: {post: {posting, referenced: true, lastUsedAt: 100}}};
        const released = prune(state, 1000);

        expect(released.remote?.post).toMatchObject({referenced: false, lastUsedAt: 1000});
        expect(prune(released, 1059).remote?.post?.posting).toBe(posting);
        const newer = {...reserve(300, 1020), remote: released.remote};
        expect(prune(newer, 1060).remote).toBeUndefined();
    });
});

describe("posting references", () => {
    test("collects retained feed stories and pending slices once per node and posting", () => {
        const state = {
            postings: {},
            feeds: {"https://remote.example": {
                timeline: {stories: [{postingId: "post"}], pending: [{stories: [{posting: {id: "pending"}}]}]},
                news: {stories: [{postingId: "post"}], pending: []}
            }}
        } as unknown as ClientState;

        expect(collectReferences(state)).toEqual([
            {nodeName: "https://remote.example", postingId: "post"},
            {nodeName: "https://remote.example", postingId: "pending"}
        ]);
    });

    test("protects the detailed post and visible dialogs, resolving relative nodes", () => {
        const state = {
            postings: {}, feeds: {}, detailedPosting: {id: "detail"},
            reactionsDialog: {show: true, nodeName: REL_HOME, postingId: "reaction"},
            sharingsDialog: {show: true, nodeName: "remote.example", postingId: "sharing"},
            repostDialog: {show: false, nodeName: "remote.example", postingId: "closed"},
            imageEditDialog: {show: true, nodeName: REL_CURRENT, media: {captionPostingId: "caption"}}
        } as unknown as ClientState;

        expect(collectReferences(state)).toEqual(expect.arrayContaining([
            {nodeName: "current", postingId: "detail"},
            {nodeName: "home", postingId: "reaction"},
            {nodeName: "remote.example", postingId: "sharing"},
            {nodeName: "current", postingId: "caption"}
        ]));
        expect(collectReferences(state).some(ref => ref.postingId === "closed")).toBe(false);
    });

    test("follows linked posts and media from retained roots, terminating cycles and ignoring unreachable cycles", () => {
        const state = {
            node: {owner: {name: "remote"}}, detailedPosting: {id: "post"},
            feeds: {}, postings: {remote: {
                post: {
                    posting: {...posting, media: [{postingId: "caption"}]},
                    references: [{nodeName: "other", postingId: "linked"}]
                },
                caption: {posting: {...posting, media: [{postingId: "post"}]}},
                unused: {posting: {...posting, media: [{postingId: "unused"}]}},
            }, other: {
                linked: {posting, references: [{nodeName: "remote", postingId: "post"}]}
            }}
        } as unknown as ClientState;

        expect(collectReferences(state)).toEqual([
            {nodeName: "remote", postingId: "post"},
            {nodeName: "other", postingId: "linked"},
            {nodeName: "remote", postingId: "caption"}
        ]);
    });

    test("protects the caption of comment media shown in the lightbox", () => {
        const state = {
            postings: {}, feeds: {},
            lightbox: {show: true, nodeName: "media.example", postingId: "post", commentId: "comment", mediaId: "image"},
            detailedPosting: {id: "post", comments: {comments: [{
                id: "comment", media: [{postingId: "caption", media: {id: "image"}}]
            }]}}
        } as unknown as ClientState;

        expect(collectReferences(state)).toContainEqual({nodeName: "media.example", postingId: "caption"});
    });

    test("keeps an active lightbox caption when either local or remote media ID identifies the attachment", () => {
        const state = {
            postings: {...reserve(300, 800), "media.example": {caption: {posting, lastUsedAt: 100}}}, feeds: {},
            lightbox: {show: true, nodeName: "media.example", postingId: "post", commentId: "comment", mediaId: "remote"},
            detailedPosting: {id: "post", comments: {comments: [{
                id: "comment", media: [{postingId: "caption", media: {id: "local"}, remoteMedia: {mediaId: "remote"}}]
            }]}}
        } as unknown as ClientState;

        const references = collectReferences(state);
        expect(prune(state.postings, 1000, references)["media.example"]?.caption?.posting).toBe(posting);
    });

    test("resolves composer and repost references from state, using URLs when names are unavailable", () => {
        const state = {
            postings: {}, feeds: {},
            node: {owner: {name: null}, root: {location: "https://current.example"}},
            home: {owner: {name: null}, root: {location: "https://home.example"}},
            compose: {postingId: "post"},
            repostDialog: {show: true, nodeName: REL_HOME, postingId: "post"}
        } as unknown as ClientState;

        expect(collectReferences(state)).toEqual([
            {nodeName: "https://current.example", postingId: "post"},
            {nodeName: "https://home.example", postingId: "post"}
        ]);
    });
});
