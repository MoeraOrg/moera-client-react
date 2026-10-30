import { applyMiddleware, legacy_createStore } from 'redux';

import { Node, PostingInfo, StoryInfo } from "api";
import { ClientAction } from "state/action";
import { ActionContext } from "state/action-types";
import { feedPastSliceSet } from "state/feeds/actions";
import { postingLoad, postingSet, postingsSet } from "state/postings/actions";
import reducer from "state/postings/reducer";
import sagas, { loadPostingReferencesInStories } from "state/postings/sagas";
import { isPostingCached } from "state/postings/selectors";
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
jest.mock("state/remotemedia/sagas", () => ({loadRemoteMediaInEntry: jest.fn()}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("util/text", () => ({}));
jest.mock("util/html", () => ({safeHtml: (text: string) => text, safePreviewHtml: (text: string) => text}));

const context = {ownerNameOrUrl: "source.example", homeOwnerNameOrUrl: "home"} as ActionContext;
const preview = (nodeName: string, id: string) => ({url: `https://moera.page/@${nodeName}/~/post/${id}`});
const posting = (id: string, links: ReturnType<typeof preview>[] = []): PostingInfo => ({
    id, heading: "Posting", body: {text: "Body", linkPreviews: links}
} as PostingInfo);
const tick = () => new Promise(resolve => setTimeout(resolve, 0));

describe("linked posting loading", () => {
    let oldStore: typeof window.store;

    beforeEach(() => {
        oldStore = window.store;
        jest.clearAllMocks();
        const initial = {
            node: {owner: {name: "source.example"}}, home: {owner: {name: "home"}},
            postings: {}, feeds: {}, settings: {client: {meta: new Map(), values: new Map()}}
        } as unknown as ClientState;
        const middleware = createStoreMiddleware(new Map(), collectSagas(sagas));
        window.store = legacy_createStore((state = initial, action: ClientAction) => ({
            ...state, postings: reducer(state.postings, {...action, context})
        }), applyMiddleware(middleware));
        jest.mocked(Node.getPosting).mockImplementation(async (_action, _nodeName, id) => posting(id));
    });

    afterEach(() => {
        window.store = oldStore;
    });

    test("loads missing targets across nodes after caching the source and terminates backlinks", async () => {
        window.store.dispatch(postingSet(posting("cached"), "cached.example"));
        const source = posting("source", [
            preview("first.example", "same-id"), preview("second.example", "same-id"),
            preview("first.example", "same-id"), preview("cached.example", "cached"),
            preview("source.example", "source"), {url: "https://example.org/ordinary-link"}
        ]);
        source.bodyPreview = {linkPreviews: [preview("first.example", "same-id")]};
        jest.mocked(Node.getPosting).mockImplementation(async (_action, nodeName, id) => {
            if (nodeName === "source.example") {
                return source;
            }
            expect(isPostingCached(window.store.getState(), "source", "source.example")).toBe(true);
            return posting(id, [preview("source.example", "source")]);
        });

        window.store.dispatch(postingLoad("source", "source.example"));
        await tick();

        expect(jest.mocked(Node.getPosting).mock.calls.map(call => [call[1], call[2]])).toEqual([
            ["source.example", "source"],
            ["first.example", "same-id"], ["second.example", "same-id"]
        ]);
        expect(window.store.getState().postings["source.example"]?.source?.references).toHaveLength(5);
        expect(isPostingCached(window.store.getState(), "same-id", "first.example")).toBe(true);
        expect(isPostingCached(window.store.getState(), "same-id", "second.example")).toBe(true);
    });

    test("replaces references on refresh and clears them when previews disappear", async () => {
        jest.mocked(Node.getPosting).mockResolvedValueOnce(posting("source", [preview("old.example", "old")]));
        window.store.dispatch(postingLoad("source", "source.example"));
        await tick();
        jest.mocked(Node.getPosting).mockResolvedValueOnce(posting("source", [preview("new.example", "new")]));
        window.store.dispatch(postingLoad("source", "source.example"));
        await tick();

        expect(window.store.getState().postings["source.example"]?.source?.references)
            .toEqual([{nodeName: "new.example", postingId: "new"}]);

        window.store.dispatch(postingLoad("source", "source.example"));
        await tick();
        expect(window.store.getState().postings["source.example"]?.source?.references).toEqual([]);
    });

    test("saving a batch alone does not follow links between its posts", async () => {
        const postings = [
            posting("first", [preview("source.example", "second")]),
            posting("second", [preview("source.example", "first")])
        ];
        const action = postingsSet(postings, "source.example");
        window.store.dispatch(action);
        await tick();
        expect(Node.getPosting).not.toHaveBeenCalled();
        expect(window.store.getState().postings["source.example"]?.first?.references).toEqual([]);
        expect(window.store.getState().postings["source.example"]?.second?.references)
            .toEqual([]);
    });

    test("loads links from feed stories after they have been cached under the feed node", async () => {
        const stories = [{id: "story", posting: posting("source", [preview("target.example", "target")])}] as StoryInfo[];
        const action = feedPastSliceSet("feed.example", "news", stories, 100, 0, 0, 0);
        window.store.dispatch(action);
        loadPostingReferencesInStories({...action, context}, stories, "feed.example");
        await tick();

        expect(window.store.getState().postings["feed.example"]?.source?.references)
            .toEqual([{nodeName: "target.example", postingId: "target"}]);
        expect(isPostingCached(window.store.getState(), "target", "target.example")).toBe(true);
        expect(Node.getPosting).toHaveBeenCalledTimes(1);
    });
});
