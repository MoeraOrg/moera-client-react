import { Node, SharingInfo } from "api";
import { ActionContext } from "state/action-types";
import { ClientState } from "state/state";
import { ExtPostingInfo } from "state/postings/state";
import { NodeCardState } from "state/nodecards/state";
import { openSharingsDialog, sharingsDialogPastSharingsLoad } from "state/sharingsdialog/actions";
import reducer from "state/sharingsdialog/reducer";
import sagas from "state/sharingsdialog/sagas";
import { dispatch, select } from "state/store-sagas";
import { collectTriggers, invokeTriggers } from "state/trigger";
import triggers from "state/sharingsdialog/triggers";
import { isPostingSharingsPermitted } from "state/sharingsdialog/selectors";

jest.mock("api", () => ({Node: {getPostingSharings: jest.fn()}}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("state/store-sagas", () => ({dispatch: jest.fn(), select: jest.fn()}));

const getSharings = Node.getPostingSharings as jest.Mock;
const dispatched = dispatch as jest.Mock;
const selected = select as jest.Mock;
let state: ClientState;

const sharing: SharingInfo = {
    id: "sharing-1", sharingType: "republish", remoteNodeName: "alice", postingId: "original",
    moment: 100, createdAt: 100
};

describe("sharings dialog loading", () => {
    beforeEach(() => {
        state = {
            sharingsDialog: reducer(undefined, openSharingsDialog("feed", "copy")),
            postings: {feed: {copy: {posting: {
                id: "copy", ownerName: "author", receiverName: "receiver", receiverPostingId: "original",
                operations: {viewSharings: "none"}, receiverOperations: {viewSharings: "public"}
            } as ExtPostingInfo}}},
            home: {owner: {name: "viewer"}, root: {location: null, api: null}},
            node: {owner: {name: "feed"}, root: {location: null, api: null}, features: null},
            settings: {client: {meta: new Map(), values: new Map()}},
            tokens: {},
            nodeCards: {cards: {}}
        } as unknown as ClientState;
        selected.mockImplementation((selector: (state: ClientState) => unknown) => selector(state));
    });

    test("loads receiver sharings, stores the page and preloads the sharers' cards", async () => {
        const slice = {before: 120, after: Number.MIN_SAFE_INTEGER, total: 1, sharings: [sharing]};
        getSharings.mockResolvedValue(slice);
        const action = Object.assign(sharingsDialogPastSharingsLoad("feed", "copy", 120), {
            context: {} as ActionContext
        });

        await sagas[0].saga(action);

        expect(getSharings).toHaveBeenCalledWith(action, "receiver", "original", 120, 40);
        expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
            type: "SHARINGS_DIALOG_PAST_SHARINGS_LOADED", payload: {nodeName: "feed", postingId: "copy", before: 120, slice}
        }));
        expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
            type: "NODE_CARDS_PRELOAD", payload: {nodeNames: ["alice"]}
        }));
    });

    test("uses the local node and posting ID for an original post", async () => {
        const posting = state.postings.feed!.copy!.posting!;
        posting.receiverName = null;
        posting.receiverPostingId = null;
        posting.operations = {viewSharings: "public"};
        getSharings.mockResolvedValue({before: 120, after: Number.MIN_SAFE_INTEGER, total: 0, sharings: []});
        const action = Object.assign(sharingsDialogPastSharingsLoad("feed", "copy", 120), {
            context: {} as ActionContext
        });

        await sagas[0].saga(action);

        expect(getSharings).toHaveBeenCalledWith(action, "feed", "copy", 120, 40);
    });

    test("loads an opened dialog without repeating the permission check", async () => {
        const posting = state.postings.feed!.copy!.posting!;
        posting.operations = {viewSharings: "public"};
        posting.receiverOperations = {viewSharings: "private"};
        const slice = {before: Number.MAX_SAFE_INTEGER, after: Number.MIN_SAFE_INTEGER, total: 0, sharings: []};
        getSharings.mockResolvedValue(slice);
        const action = Object.assign(sharingsDialogPastSharingsLoad("feed", "copy", 120), {
            context: {} as ActionContext
        });

        await sagas[0].saga(action);

        expect(getSharings).toHaveBeenCalledWith(action, "receiver", "original", 120, 40);
        expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
            type: "SHARINGS_DIALOG_PAST_SHARINGS_LOADED",
            payload: {nodeName: "feed", postingId: "copy", before: 120, slice}
        }));
    });

    test("clears loading and reports an API error", async () => {
        const error = new Error("offline");
        getSharings.mockRejectedValue(error);
        const action = Object.assign(sharingsDialogPastSharingsLoad("feed", "copy", 120), {
            context: {} as ActionContext
        });

        await sagas[0].saga(action);

        expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
            type: "SHARINGS_DIALOG_PAST_SHARINGS_LOAD_FAILED",
            payload: {nodeName: "feed", postingId: "copy", before: 120}
        }));
        expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({type: "ERROR_THROWN", payload: {e: error}}));
    });

    test("opening triggers the initial load unless a page is pending or already loaded", () => {
        const action = Object.assign(openSharingsDialog("feed", "copy"), {context: {} as ActionContext});
        const storeApi = {getState: () => state, dispatch};
        const triggerMap = collectTriggers(triggers);

        invokeTriggers(triggerMap, action, storeApi);
        expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
            type: "SHARINGS_DIALOG_PAST_SHARINGS_LOAD",
            payload: {nodeName: "feed", postingId: "copy", before: Number.MAX_SAFE_INTEGER}
        }));

        dispatched.mockClear();
        state.sharingsDialog.loading = true;
        invokeTriggers(triggerMap, action, storeApi);
        expect(dispatched).not.toHaveBeenCalled();

        state.sharingsDialog.loading = false;
        state.postings.feed!.copy!.posting!.receiverOperations = {viewSharings: "none"};
        invokeTriggers(triggerMap, action, storeApi);
        expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({type: "SHARINGS_DIALOG_PAST_SHARINGS_LOAD"}));

        dispatched.mockClear();
        state.sharingsDialog.loaded = true;
        invokeTriggers(triggerMap, action, storeApi);
        expect(dispatched).not.toHaveBeenCalled();
    });

    test("checks subscriptions on the receiver instead of the copy's node", () => {
        const posting = state.postings.feed!.copy!.posting!;
        posting.receiverOperations = {viewSharings: "subscribed"};
        state.node.features = {subscribed: true} as ClientState["node"]["features"];
        expect(isPostingSharingsPermitted(state, posting)).toBe(false);

        state.node.features = {subscribed: false} as ClientState["node"]["features"];
        state.nodeCards.cards.receiver = {
            subscription: {subscriber: {nodeName: "receiver"}}, friendship: {remoteGroups: []}
        } as unknown as NodeCardState;
        expect(isPostingSharingsPermitted(state, posting)).toBe(true);
    });

    test("checks friend group membership on the receiver instead of the copy's node", () => {
        const posting = state.postings.feed!.copy!.posting!;
        posting.receiverOperations = {viewSharings: "f:friends"};
        state.node.features = {
            friendGroups: {available: [], memberOf: [{id: "friends", title: "Friends"}]}
        } as unknown as ClientState["node"]["features"];
        expect(isPostingSharingsPermitted(state, posting)).toBe(false);

        state.nodeCards.cards.receiver = {
            subscription: {subscriber: null}, friendship: {remoteGroups: [{id: "friends", title: "Friends"}]}
        } as unknown as NodeCardState;
        expect(isPostingSharingsPermitted(state, posting)).toBe(true);
    });
});
