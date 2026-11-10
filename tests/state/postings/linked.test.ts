import { applyMiddleware, legacy_createStore, Store } from 'redux';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { Node, NodeName, PostingInfo, StoryInfo } from "api";
import { ClientAction } from "state/action";
import { ActionContext } from "state/action-types";
import { feedPastSliceSet } from "state/feeds/actions";
import { postingLoad, postingSet, postingsSet } from "state/postings/actions";
import reducer from "state/postings/reducer";
import sagas, { loadPostingReferences, loadPostingReferencesInStories } from "state/postings/sagas";
import { getPickedPosting, isPostingCached } from "state/postings/selectors";
import remoteMediaReducer from "state/remotemedia/reducer";
import { collectSagas } from "state/saga";
import { ClientState } from "state/state";
import { createStoreMiddleware } from "state/store-middleware";

jest.mock("api", () => ({
    Node: {getPosting: jest.fn()},
    NodeName: {expand: (name: string) => name}
}));
jest.mock("state/init-barriers", () => ({homeIntroduced: async () => {}}));
jest.mock("state/activityreactions/sagas", () => ({fillActivityReaction: async () => {}}));
jest.mock("state/blockedoperations/sagas", () => ({fillBlockedOperations: async () => {}}));
jest.mock("state/subscriptions/sagas", () => ({fillSubscription: async () => {}}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("util/text", () => ({}));
jest.mock("util/html", () => ({safeHtml: (text: string) => text, safePreviewHtml: (text: string) => text}));

const context = {
    ownerNameOrUrl: "source.example", homeOwnerName: "source.example", homeOwnerNameOrUrl: "source.example"
} as ActionContext;
const preview = (nodeName: string, id: string) => ({url: `https://moera.page/@${nodeName}/~/post/${id}`});
const posting = (id: string, links: ReturnType<typeof preview>[] = []): PostingInfo => ({
    id, heading: "Posting", body: {text: "Body", linkPreviews: links}
} as PostingInfo);
const tick = () => new Promise<void>((resolve: () => void) => setTimeout(resolve, 0));
type PostingRequest = Parameters<typeof Node.getPosting>;

describe("linked posting loading", () => {
    let oldStore: typeof window.store;
    let store: Store<ClientState, ClientAction>;

    beforeEach(() => {
        oldStore = window.store;
        jest.clearAllMocks();
        const initial = {
            node: {owner: {name: "source.example"}}, home: {owner: {name: "source.example"}},
            postings: {}, feeds: {}, remoteMedia: {}, settings: {client: {meta: new Map(), values: new Map()}}
        } as unknown as ClientState;
        const middleware = createStoreMiddleware(new Map(), collectSagas(sagas));
        store = legacy_createStore((state: ClientState = initial, action: ClientAction) => ({
            ...state,
            postings: reducer(state.postings, {...action, context}),
            remoteMedia: remoteMediaReducer(state.remoteMedia, {...action, context})
        }), applyMiddleware(middleware));
        window.store = store;
        jest.mocked(Node.getPosting).mockImplementation(async (...args: PostingRequest) => posting(args[2]));
    });

    afterEach(() => {
        window.store = oldStore;
        jest.restoreAllMocks();
    });

    test("loads missing targets across nodes after caching the source and terminates backlinks", async () => {
        store.dispatch(postingSet(posting("cached"), "cached.example"));
        const source = posting("source", [
            preview("first.example", "same-id"), preview("second.example", "same-id"),
            preview("first.example", "same-id"), preview("cached.example", "cached"),
            preview("source.example", "source"), {url: "https://example.org/ordinary-link"}
        ]);
        source.bodyPreview = {linkPreviews: [preview("first.example", "same-id")]};
        jest.mocked(Node.getPosting).mockImplementation(async (...args: PostingRequest) => {
            const [, nodeName, id] = args;
            if (nodeName === "source.example") {
                return source;
            }
            expect(isPostingCached(store.getState(), "source", "source.example")).toBe(true);
            return posting(id, [preview("source.example", "source")]);
        });

        store.dispatch(postingLoad("source", "source.example"));
        await tick();

        expect(jest.mocked(Node.getPosting).mock.calls.map((call: PostingRequest) => [call[1], call[2]])).toEqual([
            ["source.example", "source"],
            ["first.example", "same-id"], ["second.example", "same-id"]
        ]);
        expect(store.getState().postings["source.example"]?.source?.references).toHaveLength(4);
        expect(isPostingCached(store.getState(), "same-id", "first.example")).toBe(true);
        expect(isPostingCached(store.getState(), "same-id", "second.example")).toBe(true);
    });

    test("replaces references on refresh and clears them when previews disappear", async () => {
        jest.mocked(Node.getPosting).mockResolvedValueOnce(posting("source", [preview("old.example", "old")]));
        store.dispatch(postingLoad("source", "source.example"));
        await tick();
        jest.mocked(Node.getPosting).mockResolvedValueOnce(posting("source", [preview("new.example", "new")]));
        store.dispatch(postingLoad("source", "source.example"));
        await tick();

        expect(store.getState().postings["source.example"]?.source?.references)
            .toEqual([{nodeName: "new.example", postingId: "new"}]);

        store.dispatch(postingLoad("source", "source.example"));
        await tick();
        expect(store.getState().postings["source.example"]?.source?.references).toEqual([]);
    });

    test("saving a batch alone does not follow links between its posts", async () => {
        const postings = [
            posting("first", [preview("source.example", "second")]),
            posting("second", [preview("source.example", "first")])
        ];
        const action = postingsSet(postings, "source.example");
        store.dispatch(action);
        await tick();
        expect(Node.getPosting).not.toHaveBeenCalled();
        expect(store.getState().postings["source.example"]?.first?.references).toEqual([]);
        expect(store.getState().postings["source.example"]?.second?.references)
            .toEqual([]);
    });

    test("loads links from feed stories after they have been cached under the feed node", async () => {
        const stories = [{id: "story", posting: posting("source", [preview("target.example", "target")])}] as StoryInfo[];
        const action = feedPastSliceSet("feed.example", "news", stories, 100, 0, 0, 0);
        store.dispatch(action);
        loadPostingReferencesInStories({...action, context}, stories, "feed.example");
        await tick();

        expect(store.getState().postings["feed.example"]?.source?.references)
            .toEqual([{nodeName: "target.example", postingId: "target"}]);
        expect(isPostingCached(store.getState(), "target", "target.example")).toBe(true);
        expect(Node.getPosting).toHaveBeenCalledTimes(1);
    });

    test("loads missing story postings from their remote nodes and reuses cached postings", async () => {
        store.dispatch(postingSet(posting("cached"), "cached.example"));
        const stories = [
            {id: "first", storyType: "posting-added", posting: null,
                remoteNodeName: "first.example", remotePostingId: "remote"},
            {id: "second", storyType: "posting-added",
                remoteNodeName: "second.example", remotePostingId: "remote"},
            {id: "duplicate", storyType: "posting-added",
                remoteNodeName: "first.example", remotePostingId: "remote"},
            {id: "cached", storyType: "posting-added",
                remoteNodeName: "cached.example", remotePostingId: "cached"}
        ] as StoryInfo[];
        const action = {...feedPastSliceSet("feed.example", "news", stories, 100, 0, 0, 0), context};
        store.dispatch(action);
        loadPostingReferencesInStories(action, stories, "feed.example");
        await tick();

        expect(jest.mocked(Node.getPosting).mock.calls.map((call: PostingRequest) => [call[1], call[2]])).toEqual([
            ["first.example", "remote"], ["second.example", "remote"]
        ]);
        expect(isPostingCached(store.getState(), "remote", "first.example")).toBe(true);
        expect(isPostingCached(store.getState(), "remote", "second.example")).toBe(true);
        expect(isPostingCached(store.getState(), "remote", "feed.example")).toBe(false);

        loadPostingReferencesInStories(action, stories, "feed.example");
        await tick();
        expect(Node.getPosting).toHaveBeenCalledTimes(2);
    });

    test.each<Partial<StoryInfo>>([
        {posting: posting("embedded")},
        {storyType: "comment-added"},
        {remoteNodeName: null},
        {remoteNodeName: undefined},
        {remotePostingId: null},
        {remotePostingId: undefined}
    ])("does not load a remote story posting when %o", async overrides => {
        const stories = [{
            id: "story", storyType: "posting-added", posting: null,
            remoteNodeName: "remote.example", remotePostingId: "remote", ...overrides
        }] as StoryInfo[];
        const action = {...feedPastSliceSet("feed.example", "news", stories, 100, 0, 0, 0), context};
        store.dispatch(action);
        loadPostingReferencesInStories(action, stories, "feed.example");
        await tick();

        expect(Node.getPosting).not.toHaveBeenCalled();
        expect(isPostingCached(store.getState(), "remote", "remote.example")).toBe(false);
    });

    test("flattens nested picked postings before following body links and terminates cycles", async () => {
        const source = posting("source", [preview("original.example", "original"), preview("source.example", "leaf")]);
        const picked: PostingInfo = {
            ...posting("picked", [preview("source.example", "source"), preview("source.example", "sibling")]),
            receiverName: "original.example", receiverPostingId: "original"
        };
        const leaf = posting("leaf", [preview("missing.example", "missing"), preview("missing.example", "missing")]);
        const sibling = posting("sibling");
        source.linkedPostings = [picked, sibling, picked];
        picked.linkedPostings = [leaf, source];
        leaf.linkedPostings = [picked];
        jest.mocked(Node.getPosting).mockImplementation(async (...args: PostingRequest) => {
            const [, nodeName, id] = args;
            return nodeName === "source.example" && id === "source" ? source : posting(id);
        });
        const dispatched = jest.spyOn(store, "dispatch");

        store.dispatch(postingLoad("source", "source.example"));
        await tick();

        const saved = store.getState().postings["source.example"]!;
        expect(Object.keys(saved).sort()).toEqual(["leaf", "picked", "sibling", "source"]);
        for (const entry of Object.values(saved)) {
            expect(entry?.posting).not.toHaveProperty("linkedPostings");
        }
        expect(source.linkedPostings).toEqual([picked, sibling, picked]);
        expect(saved.source?.references).toEqual([
            {nodeName: "original.example", postingId: "original"},
            {nodeName: "source.example", postingId: "leaf"},
            {nodeName: "source.example", postingId: "picked"},
            {nodeName: "source.example", postingId: "sibling"}
        ]);
        expect(getPickedPosting(store.getState(), "original", "original.example")?.posting).toBe(saved.picked?.posting);
        expect(isPostingCached(store.getState(), "original", "original.example")).toBe(false);
        expect(saved.picked?.references).toEqual([
            {nodeName: "source.example", postingId: "source"},
            {nodeName: "source.example", postingId: "sibling"},
            {nodeName: "source.example", postingId: "leaf"}
        ]);
        expect(saved.leaf?.references).toEqual([
            {nodeName: "missing.example", postingId: "missing"},
            {nodeName: "source.example", postingId: "picked"},
            {nodeName: "original.example", postingId: "original"}
        ]);
        expect(jest.mocked(Node.getPosting).mock.calls.map((call: PostingRequest) => [call[1], call[2]])).toEqual([
            ["source.example", "source"], ["missing.example", "missing"]
        ]);
        const actions: ClientAction[] = dispatched.mock.calls.map(([action]) => action);
        expect(actions.flatMap((action: ClientAction) =>
            action.type === "POSTING_SET" ? [action.payload.posting.id] : []
        )).toEqual(["source", "picked", "sibling", "leaf", "missing"]);
        dispatched.mockRestore();
    });

    test("keeps cached secondary postings and does not traverse their incoming nested data", async () => {
        const cached = {
            ...posting("picked", [preview("cached-link.example", "untouched")]),
            receiverName: "remote.example", receiverPostingId: "remote"
        };
        store.dispatch(postingSet(cached, "source.example"));
        const source = {
            ...posting("source", [preview("remote.example", "remote")]),
            linkedPostings: [{
                ...posting("picked"), receiverName: "remote.example", receiverPostingId: "remote",
                linkedPostings: [posting("unvisited")]
            }]
        };
        jest.mocked(Node.getPosting).mockResolvedValueOnce(source);

        store.dispatch(postingLoad("source", "source.example"));
        await tick();

        const saved = store.getState().postings["source.example"]!;
        expect(saved.picked?.posting?.body.linkPreviews).toEqual(cached.body.linkPreviews);
        expect(saved.unvisited).toBeUndefined();
        expect(saved.source?.references).toEqual([
            {nodeName: "remote.example", postingId: "remote"}, {nodeName: "source.example", postingId: "picked"}
        ]);
        expect(getPickedPosting(store.getState(), "remote", "remote.example")?.posting).toBe(saved.picked?.posting);
        expect(Node.getPosting).toHaveBeenCalledTimes(1);
    });

    test("processes a whole feed batch before loading links to its nested postings", async () => {
        const stories = [
            {id: "first-story", posting: posting("first", [preview("feed.example", "picked")])},
            {id: "second-story", posting: {...posting("second"), linkedPostings: [posting("picked")]}}
        ] as StoryInfo[];
        const action = feedPastSliceSet("feed.example", "news", stories, 100, 0, 0, 0);
        store.dispatch(action);
        loadPostingReferencesInStories({...action, context}, stories, "feed.example");
        await tick();

        expect(store.getState().postings["feed.example"]?.second?.references)
            .toEqual([{nodeName: "feed.example", postingId: "picked"}]);
        expect(isPostingCached(store.getState(), "picked", "feed.example")).toBe(true);
        expect(Node.getPosting).not.toHaveBeenCalled();
    });

    test("does not load just-dispatched postings even if the store has not exposed them yet", () => {
        const source = {
            ...posting("source", [
                preview("source.example", "source"), preview("source.example", "picked"),
                preview("original.example", "picked")
            ]),
            linkedPostings: [{
                ...posting("picked", [preview("source.example", "picked"), preview("remote.example", "picked")]),
                receiverName: "original.example", receiverPostingId: "picked"
            }]
        };
        const dispatch = jest.spyOn(store, "dispatch").mockImplementation((action: ClientAction) => action);
        loadPostingReferences({...postingSet(source, "source.example"), context}, source, "source.example");

        const actions: ClientAction[] = dispatch.mock.calls.map(([action]) => action);
        expect(actions.filter((action: ClientAction) => action.type === "POSTING_SET")).toHaveLength(1);
        expect(actions.flatMap((action: ClientAction) => action.type === "POSTING_LOAD" ? [action.payload] : []))
            .toEqual([{nodeName: "remote.example", id: "picked"}]);
        dispatch.mockRestore();
    });

    test("uses the received picked copy for the original in a shortened Moera URL", async () => {
        jest.spyOn(NodeName, "expand").mockImplementation(jest.requireActual<typeof import("api/node-name")>("api/node-name").NodeName.expand);
        const source = {
            ...posting("dbfaf5e6-c5a8-4603-bd4b-9eeabe5fda24", [{
                url: "https://moera.page/@carol-dev/carol.localhost.localdomain:8082/post/ef3081d9-ba2f-400a-90d2-72cb50cfdfd8"
            }]),
            bodyPreview: {},
            linkedPostings: [{
                ...posting("9be1b1ca-39d6-45e5-9eea-73b960b6b659"),
                receiverName: "carol-dev_0", receiverPostingId: "ef3081d9-ba2f-400a-90d2-72cb50cfdfd8"
            }]
        };
        const action = {...postingSet(source, "source.example"), context};
        store.dispatch(action);
        loadPostingReferences(action, source, "source.example");
        await tick();

        expect(Node.getPosting).not.toHaveBeenCalled();
        const saved = store.getState().postings["source.example"]!;
        expect(saved["9be1b1ca-39d6-45e5-9eea-73b960b6b659"]?.posting).toBeDefined();
        expect(saved[source.id]?.references).toEqual([
            {nodeName: "carol-dev_0", postingId: "ef3081d9-ba2f-400a-90d2-72cb50cfdfd8"},
            {nodeName: "source.example", postingId: "9be1b1ca-39d6-45e5-9eea-73b960b6b659"}
        ]);
        expect(getPickedPosting(store.getState(), "ef3081d9-ba2f-400a-90d2-72cb50cfdfd8", "carol-dev_0")?.posting)
            .toBe(saved["9be1b1ca-39d6-45e5-9eea-73b960b6b659"]?.posting);
    });

    test("refreshing a parent clears its links while keeping the cached picked copy available", async () => {
        jest.mocked(Node.getPosting).mockResolvedValueOnce({
            ...posting("source"),
            linkedPostings: [{...posting("picked"), receiverName: "remote.example", receiverPostingId: "remote"}]
        });
        store.dispatch(postingLoad("source", "source.example"));
        await tick();
        const picked = getPickedPosting(store.getState(), "remote", "remote.example")?.posting;
        expect(picked?.id).toBe("picked");

        store.dispatch(postingLoad("source", "source.example"));
        await tick();
        expect(store.getState().postings["source.example"]?.source?.references).toEqual([]);
        expect(getPickedPosting(store.getState(), "remote", "remote.example")?.posting).toBe(picked);
    });

    test.each([
        ["POSTING_SET", "source.example"], ["POSTING_SET", "another.example"],
        ["POSTINGS_SET", "source.example"], ["POSTINGS_SET", "another.example"],
        ["FEED_PAST_SLICE_SET", "source.example"], ["FEED_PAST_SLICE_SET", "another.example"]
    ])(
        "%s makes a copy on %s available by the original node and ID", (type, nodeName) => {
            const picked = {
                ...posting("picked"), receiverName: "original.example", receiverPostingId: "original"
            };
            const action = type === "POSTING_SET"
                ? postingSet(picked, nodeName)
                : type === "POSTINGS_SET"
                    ? postingsSet([picked], nodeName)
                    : feedPastSliceSet(nodeName, "news", [{id: "story", posting: picked} as StoryInfo], 100, 0, 0, 0);

            store.dispatch(action);

            expect(getPickedPosting(store.getState(), "original", "original.example", nodeName))
                .toMatchObject({
                    posting: {id: "picked", receiverName: "original.example", receiverPostingId: "original"},
                    nodeName
                });
            expect(isPostingCached(store.getState(), "original", "original.example")).toBe(false);
        }
    );

    test("uses an alternative copy only when requested and prefers a home copy", () => {
        const picked = {...posting("picked"), receiverName: "original.example", receiverPostingId: "original"};
        store.dispatch(postingSet(picked, "another.example"));

        expect(getPickedPosting(store.getState(), "original", "original.example")).toBeNull();
        expect(getPickedPosting(store.getState(), "original", "original.example", "another.example")?.posting.id)
            .toBe("picked");

        store.dispatch(postingSet({...picked, id: "home-picked"}, "source.example"));
        store.dispatch(postingSet(picked, "another.example"));

        expect(getPickedPosting(store.getState(), "original", "original.example", "another.example")?.posting.id)
            .toBe("home-picked");
    });

    test("accumulates distinct copies across nodes and within a batch without duplicating refreshed copies", () => {
        const first = {...posting("first"), receiverName: "original.example", receiverPostingId: "original"};
        const second = {...first, id: "second"};
        store.dispatch(postingsSet([first, second, first], "another.example"));
        store.dispatch(postingSet(first, "source.example"));
        store.dispatch(postingSet(first, "another.example"));
        store.dispatch(postingSet(posting("original"), "original.example"));

        expect(store.getState().postings["original.example"]?.original?.picked).toEqual([
            {nodeName: "another.example", postingId: "first"},
            {nodeName: "another.example", postingId: "second"},
            {nodeName: "source.example", postingId: "first"}
        ]);
        expect(getPickedPosting(store.getState(), "original", "original.example", "another.example")?.posting.id)
            .toBe("original");
    });

    test("requests remote media needed to display a newly cached picked posting", async () => {
        jest.mocked(Node.getPosting).mockResolvedValueOnce({
            ...posting("source"),
            linkedPostings: [{
                ...posting("picked"),
                media: [{
                    embedded: false,
                    remoteMedia: {id: "attachment", nodeName: "media.example", mediaId: "image", grant: "grant"}
                }]
            }]
        });

        store.dispatch(postingLoad("source", "source.example"));
        await tick();

        expect(isPostingCached(store.getState(), "picked", "source.example")).toBe(true);
        expect(store.getState().remoteMedia["media.example"]?.image?.loading).toBe(true);
    });
});
