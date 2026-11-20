import { Node, NodeApiError, SubscriptionInfo } from "api";
import { ClientAction } from "state/action";
import { ActionContext } from "state/action-types";
import { feedSubscribe, feedSubscribed, recommendationDont } from "state/feeds/actions";
import { emptyFeed } from "state/feeds/empty";
import sagas from "state/feeds/sagas";
import triggers from "state/feeds/triggers";
import { wakeUp } from "state/navigation/actions";
import { nodeCardPeopleSet, nodeCardSubscriptionSet } from "state/nodecards/actions";
import nodeCardsReducer from "state/nodecards/reducer";
import {
    peopleGeneralLoaded, peopleSelectedSubscribe, peopleSelectToggle, subscribersLoaded, subscriptionsLoaded
} from "state/people/actions";
import peopleReducer from "state/people/reducer";
import peopleSagas from "state/people/sagas";
import peopleTriggers from "state/people/triggers";
import { collectSagas, invokeSaga, Saga } from "state/saga";
import { ClientState } from "state/state";
import { dispatch, select } from "state/store-sagas";
import { collectTriggers, invokeTriggers } from "state/trigger";
import { REL_HOME } from "util/rel-node-name";

jest.mock("api", () => ({
    Node: {
        getFeedStatus: jest.fn(), getFeedSlice: jest.fn(),
        excludeNodeFromRecommendations: jest.fn(), deleteFeedStories: jest.fn(),
        createSubscription: jest.fn(), searchSubscriptions: jest.fn(), getPeopleGeneral: jest.fn()
    },
    NodeApiError: jest.requireActual("api/error").NodeApiError,
    NodeName: jest.requireActual("api/node-name").NodeName,
    SettingTypes: jest.requireActual("api/setting-types")
}));
jest.mock("ui/browser", () => ({}));
jest.mock("ui/instant/instant-types", () => ({getInstantTypeDetails: () => null}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("util/html", () => ({}));
jest.mock("util/names-list", () => ({}));
jest.mock("state/store-sagas", () => ({dispatch: jest.fn(), select: jest.fn()}));

const getStatus = jest.mocked(Node.getFeedStatus);
const getSlice = jest.mocked(Node.getFeedSlice);
const dispatched = jest.mocked(dispatch);
const selected = select as jest.Mock;
const updateSaga = sagas.find((entry: Saga) => entry.action === "FEEDS_UPDATE")!;
let state: ClientState;

async function wakeUpFeeds(): Promise<void> {
    const context = {
        ownerName: state.node.owner.name,
        ownerNameOrUrl: state.node.owner.name,
        homeOwnerName: state.home.owner.name,
        homeOwnerNameOrUrl: state.home.owner.name ?? state.home.root.location
    } as ActionContext;
    const action = Object.assign(wakeUp(), {context});
    invokeTriggers(collectTriggers(triggers), action, {
        getState: () => state,
        dispatch: <T extends ClientAction>(signal: T): T => {
            dispatch(signal);
            return signal;
        }
    });
    const update = dispatched.mock.calls.find(([signal]: [ClientAction]) => signal.type === "FEEDS_UPDATE")![0];
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

        expect(getStatus.mock.calls.map(
            ([, nodeName, feedName]: Parameters<typeof Node.getFeedStatus>) => [nodeName, feedName]
        )).toEqual([
            ["alice", "timeline"], ["alice", "news"], ["alice", "explore"], ["alice", "instant"],
            ["bob", "timeline"]
        ]);
        expect(getSlice.mock.calls.map(
            ([, nodeName, feedName]: Parameters<typeof Node.getFeedSlice>) => [nodeName, feedName]
        )).toEqual([
            ["alice", "news"], ["bob", "timeline"]
        ]);
        expect(dispatched).not.toHaveBeenCalledWith(expect.objectContaining({type: "ERROR_THROWN"}));
    });

    test("uses the home URL when the home owner name is not known", async () => {
        state.home.owner.name = null;
        state.feeds = {"https://alice.example": {news: emptyFeed}, bob: {news: emptyFeed}};

        await wakeUpFeeds();

        expect(getStatus.mock.calls.map(
            ([, nodeName, feedName]: Parameters<typeof Node.getFeedStatus>) => [nodeName, feedName]
        )).toEqual([
            ["https://alice.example", "news"]
        ]);
    });

    test("refreshes only timelines when there is no home node", async () => {
        state.home.owner.name = null;
        state.home.root.location = null;

        await wakeUpFeeds();

        expect(getStatus.mock.calls.map(
            ([, nodeName, feedName]: Parameters<typeof Node.getFeedStatus>) => [nodeName, feedName]
        )).toEqual([
            ["alice", "timeline"], ["bob", "timeline"]
        ]);
        expect(getSlice.mock.calls.map(
            ([, nodeName, feedName]: Parameters<typeof Node.getFeedSlice>) => [nodeName, feedName]
        )).toEqual([
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
            expect(Node.deleteFeedStories)
                .toHaveBeenCalledWith(action, REL_HOME, "news", "posting-added", "bob", null, null, true);
            expect(Node.deleteFeedStories)
                .toHaveBeenCalledWith(action, REL_HOME, "explore", "posting-added", "bob", null, null, true);
            expect(Node.deleteFeedStories).toHaveBeenCalledTimes(2);
        } else {
            expect(Node.deleteFeedStories).not.toHaveBeenCalled();
        }
        expect(dispatched).not.toHaveBeenCalledWith(expect.objectContaining({type: "ERROR_THROWN"}));
    });
});

describe("feed subscription", () => {
    const subscribeSaga = sagas.find((entry: Saga) => entry.action === "FEED_SUBSCRIBE")!;
    const create = jest.mocked(Node.createSubscription);
    const search = jest.mocked(Node.searchSubscriptions);
    const dispatchedTypes = () => dispatched.mock.calls.map(([signal]: [ClientAction]) => signal.type);
    const existing: SubscriptionInfo = {
        id: "existing", type: "feed", feedName: "news", remoteNodeName: "bob", remoteFeedName: "timeline",
        createdAt: 100, reason: "user", contact: {nodeName: "bob", distance: 1, hasFeedSubscription: true}
    };
    const context = {
        ownerName: "alice", ownerNameOrUrl: "alice", homeOwnerName: "alice", homeOwnerNameOrUrl: "alice"
    } as ActionContext;
    const alreadyExists = new NodeApiError("subscription.already-exists", "Already subscribed");

    beforeEach(() => {
        state = {home: {introduced: true}} as unknown as ClientState;
        selected.mockImplementation((selector?: (state: ClientState) => unknown) => selector ? selector(state) : state);
    });

    test("restores the matching subscription and satisfies the instant after a duplicate response", async () => {
        const action = {...feedSubscribe("bob", "timeline", "instant-id"), context};
        let cards = nodeCardsReducer(undefined, {...nodeCardPeopleSet("bob", 5, 2), context});
        cards = nodeCardsReducer(cards, {...nodeCardSubscriptionSet("bob", null, null), context});
        cards = nodeCardsReducer(cards, action);
        dispatched.mockImplementation((signal: ClientAction) => {
            cards = nodeCardsReducer(cards, {...signal, context});
        });
        create.mockRejectedValue(alreadyExists);
        const matching = {
            ...existing, remoteNodeName: "bob_0", contact: {nodeName: "bob_0", distance: 1, hasFeedSubscription: true}
        };
        search.mockResolvedValue([{...matching, id: "other-feed", feedName: "explore"}, matching]);

        await subscribeSaga.saga(action);

        expect(create).toHaveBeenCalledWith(
            action, REL_HOME, {type: "feed", feedName: "news", remoteNodeName: "bob", remoteFeedName: "timeline"},
            ["subscription.already-exists"]
        );
        expect(search).toHaveBeenCalledWith(action, REL_HOME, {
            type: "feed", feeds: [{nodeName: "bob_0", feedName: "timeline"}]
        });
        expect(cards.cards.bob.subscription).toMatchObject({subscribing: false, subscription: {id: "existing"}});
        expect(cards.cards.bob.people.subscribersTotal).toBe(5);
        expect(dispatchedTypes()).toEqual(["FEED_SUBSCRIBED", "STORY_SATISFY"]);
        expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
            type: "STORY_SATISFY", payload: {nodeName: REL_HOME, feedName: "instant", id: "instant-id"}
        }));
    });

    test("clears the pending subscription when it disappears before the duplicate lookup", async () => {
        const action = {...feedSubscribe("bob", "timeline", "instant-id"), context};
        create.mockRejectedValue(alreadyExists);
        search.mockResolvedValue([]);

        await subscribeSaga.saga(action);

        expect(dispatchedTypes()).toEqual(["FEED_SUBSCRIBE_FAILED"]);
    });

    test("still reports other subscription errors", async () => {
        const action = {...feedSubscribe("bob", "timeline", "instant-id"), context};
        const error = new NodeApiError("authentication.required", "Authorization required");
        create.mockRejectedValue(error);

        await subscribeSaga.saga(action);

        expect(search).not.toHaveBeenCalled();
        expect(dispatchedTypes()).toEqual(["FEED_SUBSCRIBE_FAILED", "ERROR_THROWN"]);
        expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({type: "ERROR_THROWN", payload: {e: error}}));
    });

    test.each([true, false])("refreshes the People total with the duplicate response first = %s",
        async (duplicateFirst: boolean) => {
            const loaded = peopleReducer(undefined, {...subscriptionsLoaded([]), context});
            const people = peopleReducer(loaded, {
                ...subscribersLoaded([
                    {id: "subscriber-bob", nodeName: "bob", type: "feed", feedName: "timeline", createdAt: 100}
                ]),
                context
            });
            state = {
                ...state,
                node: {root: {api: "https://alice.example/moera"}},
                navigation: {page: "people"},
                people: peopleReducer(people, {...peopleGeneralLoaded({feedSubscriptionsTotal: 5}), context})
            } as ClientState;
            const registeredSagas = collectSagas(peopleSagas);
            const registeredTriggers = collectTriggers(peopleTriggers);
            const refreshes: Promise<void>[] = [];
            const dispatchAction = <T extends ClientAction>(signal: T): T => {
                const action = {...signal, context};
                state.people = peopleReducer(state.people, action);
                if (signal.type === "FEED_SUBSCRIBED") {
                    invokeTriggers(registeredTriggers, action, {getState: () => state, dispatch: dispatchAction});
                }
                if (signal.type === "PEOPLE_GENERAL_LOAD") {
                    refreshes.push(invokeSaga(registeredSagas, action));
                }
                return signal;
            };
            dispatched.mockImplementation(dispatchAction);
            const getGeneral = jest.mocked(Node.getPeopleGeneral);
            getGeneral.mockResolvedValue({feedSubscriptionsTotal: 6});

            dispatchAction(feedSubscribed("bob", existing, !duplicateFirst));
            dispatchAction(feedSubscribed("bob", existing, duplicateFirst));

            expect(state.people.subscriptionsTotal).toBe(duplicateFirst ? 5 : 6);
            await Promise.all(refreshes);

            expect(getGeneral).toHaveBeenCalledTimes(1);
            expect(state.people.subscriptionsTotal).toBe(6);
        }
    );

    test("continues a bulk subscription when a selected contact already has a matching subscription", async () => {
        const action = {...peopleSelectedSubscribe(), context};
        const peopleSubscribeSaga = peopleSagas.find((entry: Saga) => entry.action === action.type)!;
        let people = peopleReducer(undefined, {...subscriptionsLoaded([]), context});
        people = peopleReducer(people, {...peopleGeneralLoaded({feedSubscriptionsTotal: 5}), context});
        people = peopleReducer(people, {
            ...subscribersLoaded([
                {id: "subscriber-bob", nodeName: "bob", type: "feed", feedName: "timeline", createdAt: 100},
                {id: "subscriber-carol", nodeName: "carol", type: "feed", feedName: "timeline", createdAt: 100}
            ]),
            context
        });
        people = peopleReducer(people, {...peopleSelectToggle("bob"), context});
        people = peopleReducer(people, {...peopleSelectToggle("carol"), context});
        state.people = people;
        dispatched.mockImplementation((signal: ClientAction) => {
            people = peopleReducer(people, {...signal, context});
        });
        create.mockRejectedValueOnce(alreadyExists).mockResolvedValueOnce({
            ...existing, id: "new", remoteNodeName: "carol",
            contact: {nodeName: "carol", distance: 1, hasFeedSubscription: true}
        });
        search.mockResolvedValue([existing]);

        await peopleSubscribeSaga.saga(action);

        expect(people.contacts.bob.subscription?.id).toBe("existing");
        expect(people.contacts.bob.contact.hasFeedSubscription).toBe(true);
        expect(people.contacts.carol.subscription?.id).toBe("new");
        expect(people.subscriptionsTotal).toBe(6);
        expect(dispatchedTypes()).toEqual([
            "OPEN_PROGRESS_BOX", "FEED_SUBSCRIBED", "UPDATE_PROGRESS_BOX",
            "FEED_SUBSCRIBED", "UPDATE_PROGRESS_BOX", "CLOSE_PROGRESS_BOX"
        ]);
        expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
            type: "UPDATE_PROGRESS_BOX", payload: {done: 2, total: 2}
        }));
    });
});
