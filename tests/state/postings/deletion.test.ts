import { FeedReference, Node, PostingInfo, StoryInfo } from "api";
import { ClientAction } from "state/action";
import { ActionContext, WithContext } from "state/action-types";
import detailedPostingTriggers from "state/detailedposting/triggers";
import { emptyFeed } from "state/feeds/empty";
import feedsReducer from "state/feeds/reducer";
import { ExtStoryInfo } from "state/feeds/state";
import { postingDelete, postingDeleted } from "state/postings/actions";
import postingsReducer from "state/postings/reducer";
import sagas from "state/postings/sagas";
import { Saga } from "state/saga";
import { ClientState } from "state/state";
import { dispatch, select } from "state/store-sagas";
import { storyDelete } from "state/stories/actions";
import storySagas from "state/stories/sagas";
import { collectTriggers, invokeTriggers } from "state/trigger";
import { MinimalStoryInfo } from "ui/types";

jest.mock("api", () => ({
    Node: {deletePosting: jest.fn(), deleteStory: jest.fn(), deleteStories: jest.fn(), deleteFeedStories: jest.fn()}
}));
jest.mock("state/store-sagas", () => ({dispatch: jest.fn(), select: jest.fn()}));
jest.mock("ui/browser", () => ({}));
jest.mock("ui/instant/instant-types", () => ({getInstantTypeDetails: () => null}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("util/html", () => ({}));
jest.mock("util/text", () => ({}));

const nodeName = "author";
const context = {ownerNameOrUrl: nodeName, homeOwnerNameOrUrl: "home"} as ActionContext;
const deleteSaga = sagas.find((entry: Saga) => entry.action === "POSTING_DELETE")!;
const deleteStorySaga = storySagas.find((entry: Saga) => entry.action === "STORY_DELETE")!;
type DeleteFeedStoriesCall = Parameters<typeof Node.deleteFeedStories>;
const selected = select as jest.Mock;
const dispatched = jest.mocked(dispatch);
const triggers = collectTriggers(detailedPostingTriggers);
let state: ClientState;
let posting: PostingInfo;

function applyAction(action: ClientAction): void {
    const signal = {...action, context} as WithContext<ClientAction>;
    state = {
        ...state,
        postings: postingsReducer(state.postings, signal),
        feeds: feedsReducer(state.feeds, signal)
    };
    invokeTriggers(triggers, signal, {
        getState: () => state,
        dispatch: <T extends ClientAction>(action: T): T => {
            dispatch(action);
            return action;
        }
    });
}

function storyIds(feedName: string): string[] {
    return state.feeds[nodeName]?.[feedName]?.stories.map((story: ExtStoryInfo) => story.id) ?? [];
}

async function deletePosting(feedName: string | null, story: MinimalStoryInfo | null): Promise<void> {
    const action = Object.assign(postingDelete(posting.id, nodeName, feedName, story), {context});
    applyAction(action);
    await deleteSaga.saga(action);
}

beforeEach(() => {
    posting = {
        id: "post-1", revisionId: "revision-1", totalRevisions: 1, ownerName: nodeName, bodySrcHash: "hash",
        body: {text: "Post"}, heading: "Post", createdAt: 100, revisionCreatedAt: 100,
        feedReferences: [
            {feedName: "timeline", storyId: "original", publishedAt: 100, moment: 100},
            {feedName: "timeline", storyId: "repost", publishedAt: 200, moment: 200},
            {feedName: "news", storyId: "news-1", publishedAt: 300, moment: 300},
            {feedName: "news", storyId: "news-2", publishedAt: 400, moment: 400},
            {feedName: "explore", storyId: "explore-1", publishedAt: 500, moment: 500}
        ]
    };
    state = {
        node: {owner: {name: nodeName}, root: {api: "https://author/moera/api"}}, home: {owner: {name: "home"}},
        navigation: {page: "timeline"}, detailedPosting: {id: posting.id},
        settings: {client: {meta: new Map(), values: new Map()}},
        postings: {[nodeName]: {[posting.id]: {posting}}},
        feeds: {
            [nodeName]: Object.fromEntries(["timeline", "news", "explore"].map(feedName => {
                const stories: StoryInfo[] = posting.feedReferences!
                    .filter((ref: FeedReference) => ref.feedName === feedName)
                    .map((ref: FeedReference) => ({
                        id: ref.storyId, feedName, storyType: "posting-added", postingId: posting.id,
                        createdAt: ref.publishedAt, publishedAt: ref.publishedAt, moment: ref.moment
                    }));
                stories.push({
                    id: `${feedName}-unrelated`, feedName, storyType: "posting-added", postingId: "other-post",
                    createdAt: 600, publishedAt: 600, moment: 600
                });
                return [feedName, {...emptyFeed, after: 0, stories, status: {...emptyFeed.status, total: stories.length}}];
            }))
        }
    } as unknown as ClientState;
    selected.mockImplementation((selector?: (state: ClientState) => unknown) => selector ? selector(state) : state);
    dispatched.mockImplementation(applyAction);
});

afterEach(() => {
    expect(Node.deletePosting).not.toHaveBeenCalled();
    expect(Node.deleteStories).not.toHaveBeenCalled();
    for (const call of jest.mocked(Node.deleteFeedStories).mock.calls) {
        expect(call.slice(3)).toEqual([null, null, null, "post-1", null, false]);
    }
});

test("deletes all timeline and news references of an original posting and keeps other feeds", async () => {
    state.navigation.page = "detailedposting";

    await deletePosting("timeline", {id: "repost", publishedAt: 200, moment: 200});

    expect(Node.deleteStory).toHaveBeenCalledWith(expect.anything(), nodeName, "repost");
    expect(jest.mocked(Node.deleteFeedStories).mock.calls.map((call: DeleteFeedStoriesCall) => call[2]))
        .toEqual(["timeline", "news"]);
    expect(storyIds("timeline")).toEqual(["timeline-unrelated"]);
    expect(storyIds("news")).toEqual(["news-unrelated"]);
    expect(storyIds("explore")).toEqual(["explore-1", "explore-unrelated"]);
    expect(state.postings[nodeName]?.[posting.id]).toMatchObject({
        deleting: false, posting: {feedReferences: [{feedName: "explore", storyId: "explore-1"}]}
    });
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
        type: "POSTING_DELETED",
        payload: {id: "post-1", nodeName, moment: 200, feedReferences: [
            {feedName: "explore", storyId: "explore-1", publishedAt: 500, moment: 500}
        ]}
    }));
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
        type: "JUMP_NEAR", payload: {path: "/timeline?before=200", query: null, hash: null}
    }));
});

test.each(["news", "explore"])(
    "deletes the selected %s story of a remote post along with its timeline", async (feedName: string) => {
        posting.receiverName = "remote";
        posting.receiverPostingId = "remote-post";
        const ref = posting.feedReferences!.find((ref: FeedReference) => ref.feedName === feedName)!;

        await deletePosting(feedName, {id: ref.storyId, publishedAt: ref.publishedAt, moment: ref.moment});

        expect(Node.deleteStory).toHaveBeenCalledWith(expect.anything(), nodeName, ref.storyId);
        expect(jest.mocked(Node.deleteFeedStories).mock.calls.map((call: DeleteFeedStoriesCall) => call[2]))
            .toEqual(["timeline"]);
        expect(storyIds("timeline")).toEqual(["timeline-unrelated"]);
        expect(storyIds("news")).toEqual(feedName === "news" ? ["news-2", "news-unrelated"]
            : ["news-1", "news-2", "news-unrelated"]);
        expect(storyIds("explore")).toEqual(feedName === "explore" ? ["explore-unrelated"]
            : ["explore-1", "explore-unrelated"]);
        expect(state.postings[nodeName]?.[posting.id]?.deleting).toBe(false);
    }
);

test("deletes the selected story even when it is absent from cached feed references", async () => {
    posting.feedReferences = posting.feedReferences!.filter((ref: FeedReference) => ref.storyId !== "explore-1");

    await deletePosting("explore", {id: "explore-1", publishedAt: 500, moment: 500});

    expect(Node.deleteStory).toHaveBeenCalledWith(expect.anything(), nodeName, "explore-1");
    expect(storyIds("explore")).toEqual(["explore-unrelated"]);
    expect(state.postings[nodeName]?.[posting.id]).toBeUndefined();
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
        type: "POSTING_DELETED", payload: {id: "post-1", nodeName, moment: 200, feedReferences: []}
    }));
});

test("omits the selected story notification when its feed name is null", async () => {
    await deletePosting(null, {id: "explore-1", publishedAt: 500, moment: 500});

    expect(Node.deleteStory).toHaveBeenCalledWith(expect.anything(), nodeName, "explore-1");
    expect(dispatched).not.toHaveBeenCalledWith(expect.objectContaining({
        type: "STORY_DELETED", payload: expect.objectContaining({story: expect.objectContaining({id: "explore-1"})})
    }));
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
        type: "POSTING_DELETED", payload: {id: "post-1", nodeName, moment: 200, feedReferences: []}
    }));
    expect(state.postings[nodeName]?.[posting.id]).toBeUndefined();
});

test.each([false, true])("saves remaining references when cached references are empty: %s", (empty: boolean) => {
    if (empty) {
        posting.feedReferences = [];
    }
    posting.earliestPublishedAt = 100;
    state.postings[nodeName]![posting.id]!.deleting = true;
    const remainingReferences: FeedReference[] = [
        {feedName: "news", storyId: "news-2", publishedAt: 400, moment: 400}
    ];

    applyAction(postingDeleted(posting.id, remainingReferences, nodeName, 200));

    expect(state.postings[nodeName]?.[posting.id]).toMatchObject({
        deleting: false,
        posting: {...posting, feedReferences: remainingReferences, earliestPublishedAt: null}
    });
});

test("returns to the timeline without a before parameter when there was no timeline reference", async () => {
    state.navigation.page = "detailedposting";
    posting.feedReferences = posting.feedReferences!.filter((ref: FeedReference) => ref.feedName !== "timeline");

    await deletePosting(null, null);

    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
        type: "POSTING_DELETED", payload: expect.objectContaining({moment: null})
    }));
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
        type: "JUMP_NEAR", payload: {path: "/timeline", query: null, hash: null}
    }));
});

test("deletes from the posting page without a selected story using posting-scoped feed requests", async () => {
    await deletePosting(null, null);

    expect(Node.deleteStory).not.toHaveBeenCalled();
    expect(jest.mocked(Node.deleteFeedStories).mock.calls.map((call: DeleteFeedStoriesCall) => call[2]))
        .toEqual(["timeline", "news"]);
    expect(storyIds("timeline")).toEqual(["timeline-unrelated"]);
    expect(storyIds("news")).toEqual(["news-unrelated"]);
    expect(storyIds("explore")).toEqual(["explore-1", "explore-unrelated"]);
});

test("deleting a single repost of an original keeps the other timeline and news stories", async () => {
    const action = Object.assign(storyDelete(
        nodeName, {id: "repost", publishedAt: 200, moment: 200}, "timeline", posting.id
    ), {context});

    await deleteStorySaga.saga(action);

    expect(Node.deleteFeedStories).not.toHaveBeenCalled();
    expect(storyIds("timeline")).toEqual(["original", "timeline-unrelated"]);
    expect(storyIds("news")).toEqual(["news-1", "news-2", "news-unrelated"]);
});

test("a failure deleting the selected story preserves the post and clears the deleting flag", async () => {
    const error = new Error("offline");
    jest.mocked(Node.deleteStory).mockRejectedValue(error);

    await deletePosting("timeline", {id: "repost", publishedAt: 200, moment: 200});

    expect(Node.deleteFeedStories).not.toHaveBeenCalled();
    expect(storyIds("timeline")).toEqual(["original", "repost", "timeline-unrelated"]);
    expect(state.postings[nodeName]?.[posting.id]).toMatchObject({deleting: false, posting});
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({type: "ERROR_THROWN", payload: {e: error}}));
});

test("a bulk failure preserves undeleted stories after deleting the selected story", async () => {
    const error = new Error("offline");
    jest.mocked(Node.deleteFeedStories).mockRejectedValue(error);

    await deletePosting("timeline", {id: "repost", publishedAt: 200, moment: 200});

    expect(storyIds("timeline")).toEqual(["original", "timeline-unrelated"]);
    expect(storyIds("news")).toEqual(["news-1", "news-2", "news-unrelated"]);
    expect(state.postings[nodeName]?.[posting.id]?.deleting).toBe(false);
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({type: "ERROR_THROWN", payload: {e: error}}));
});
