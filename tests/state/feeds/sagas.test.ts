import { Node } from "api";
import { ActionContext } from "state/action-types";
import { recommendationDont } from "state/feeds/actions";
import { emptyFeed } from "state/feeds/empty";
import sagas from "state/feeds/sagas";
import triggers from "state/feeds/triggers";
import { wakeUp } from "state/navigation/actions";
import { ClientState } from "state/state";
import { dispatch, select } from "state/store-sagas";
import { collectTriggers, invokeTriggers } from "state/trigger";
import { REL_HOME } from "util/rel-node-name";

jest.mock("api", () => ({
    Node: {
        getFeedStatus: jest.fn(), getFeedSlice: jest.fn(),
        excludeNodeFromRecommendations: jest.fn(), deleteFeedStories: jest.fn()
    },
    SettingTypes: jest.requireActual("api/setting-types")
}));
jest.mock("ui/browser", () => ({}));
jest.mock("ui/instant/instant-types", () => ({getInstantTypeDetails: () => null}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("state/store-sagas", () => ({dispatch: jest.fn(), select: jest.fn()}));

const getStatus = Node.getFeedStatus as jest.Mock;
const getSlice = Node.getFeedSlice as jest.Mock;
const dispatched = dispatch as jest.Mock;
const selected = select as jest.Mock;
const updateSaga = sagas.find(entry => entry.action === "FEEDS_UPDATE")!;
let state: ClientState;

async function wakeUpFeeds(): Promise<void> {
    const context = {
        ownerName: state.node.owner.name,
        ownerNameOrUrl: state.node.owner.name,
        homeOwnerName: state.home.owner.name,
        homeOwnerNameOrUrl: state.home.owner.name ?? state.home.root.location
    } as ActionContext;
    const action = Object.assign(wakeUp(), {context});
    invokeTriggers(collectTriggers(triggers), action, {getState: () => state, dispatch});
    const update = dispatched.mock.calls.find(([signal]) => signal.type === "FEEDS_UPDATE")![0];
    await updateSaga.saga(Object.assign(update, {context}));
}

describe("feed refresh after waking up", () => {
    beforeEach(() => {
        const loadedFeed = {...emptyFeed, loadedStatus: true, after: 100};
        state = {
            home: {introduced: true, owner: {name: "alice"}, root: {location: "https://alice.example"}},
            node: {owner: {name: "bob"}, root: {location: "https://bob.example"}},
            settings: {client: {meta: new Map(), values: new Map()}},
            tokens: {},
            feeds: {
                alice: {
                    timeline: emptyFeed, news: loadedFeed, explore: emptyFeed, instant: emptyFeed
                },
                bob: {
                    timeline: loadedFeed, news: loadedFeed, explore: loadedFeed, instant: loadedFeed
                }
            }
        } as unknown as ClientState;
        selected.mockImplementation((selector?: (state: ClientState) => unknown) => selector ? selector(state) : state);
        getStatus.mockResolvedValue({total: 0, totalPinned: 0});
        getSlice.mockResolvedValue({
            stories: [], before: Number.MAX_SAFE_INTEGER, after: 100, totalInPast: 0, totalInFuture: 0
        });
    });

    test("refreshes home feeds and remote timelines without requesting remote private feeds", async () => {
        await wakeUpFeeds();

        expect(getStatus.mock.calls.map(([, nodeName, feedName]) => [nodeName, feedName])).toEqual([
            ["alice", "timeline"], ["alice", "news"], ["alice", "explore"], ["alice", "instant"],
            ["bob", "timeline"]
        ]);
        expect(getSlice.mock.calls.map(([, nodeName, feedName]) => [nodeName, feedName])).toEqual([
            ["alice", "news"], ["bob", "timeline"]
        ]);
        expect(dispatched).not.toHaveBeenCalledWith(expect.objectContaining({type: "ERROR_THROWN"}));
    });

    test("uses the home URL when the home owner name is not known", async () => {
        state.home.owner.name = null;
        state.feeds = {"https://alice.example": {news: emptyFeed}, bob: {news: emptyFeed}};

        await wakeUpFeeds();

        expect(getStatus.mock.calls.map(([, nodeName, feedName]) => [nodeName, feedName])).toEqual([
            ["https://alice.example", "news"]
        ]);
    });

    test("refreshes only timelines when there is no home node", async () => {
        state.home.owner.name = null;
        state.home.root.location = null;

        await wakeUpFeeds();

        expect(getStatus.mock.calls.map(([, nodeName, feedName]) => [nodeName, feedName])).toEqual([
            ["alice", "timeline"], ["bob", "timeline"]
        ]);
        expect(getSlice.mock.calls.map(([, nodeName, feedName]) => [nodeName, feedName])).toEqual([
            ["bob", "timeline"]
        ]);
    });
});

describe("do not recommend a node", () => {
    test.each([false, true])("handles existing recommendations with deleteAll=%s", async (deleteAll: boolean) => {
        state = {
            home: {introduced: true},
            settings: {
                node: {
                    meta: new Map([["recommendations.source", {type: "string"}]]),
                    values: new Map([["recommendations.source", "recommendations.example"]])
                }
            }
        } as unknown as ClientState;
        selected.mockImplementation((selector?: (state: ClientState) => unknown) => selector ? selector(state) : state);
        const action = Object.assign(recommendationDont("bob", deleteAll), {context: {} as ActionContext});

        await sagas.find((entry: {action: string}) => entry.action === "RECOMMENDATION_DONT")!.saga(action);

        expect(Node.excludeNodeFromRecommendations).toHaveBeenCalledWith(action, "recommendations.example", "bob");
        if (deleteAll) {
            expect(Node.deleteFeedStories).toHaveBeenCalledWith(action, REL_HOME, "news", "posting-added", "bob", true);
            expect(Node.deleteFeedStories).toHaveBeenCalledWith(action, REL_HOME, "explore", "posting-added", "bob", true);
            expect(Node.deleteFeedStories).toHaveBeenCalledTimes(2);
        } else {
            expect(Node.deleteFeedStories).not.toHaveBeenCalled();
        }
        expect(dispatched).not.toHaveBeenCalledWith(expect.objectContaining({type: "ERROR_THROWN"}));
    });
});
