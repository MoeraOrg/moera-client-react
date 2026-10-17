import { Node, ReactionInfo, ReactionsSliceInfo } from "api";
import { eventAction, EventSource } from "api/events";
import { ClientAction } from "state/action";
import { ActionContext } from "state/action-types";
import { ExtPostingInfo } from "state/postings/state";
import {
    closeReactionsDialog, openReactionsDialog, reactionsDialogPastReactionsLoad, reactionsDialogSelectTab,
    reactionsDialogUnset
} from "state/reactionsdialog/actions";
import reducer from "state/reactionsdialog/reducer";
import sagas from "state/reactionsdialog/sagas";
import { getReactionsDialogItems, isReactionsDialogLoading } from "state/reactionsdialog/selectors";
import triggers from "state/reactionsdialog/triggers";
import { collectSagas, invokeSaga, SagaMap } from "state/saga";
import { ClientState } from "state/state";
import { dispatch, select } from "state/store-sagas";
import { collectTriggers, invokeTriggers } from "state/trigger";

jest.mock("api", () => ({Node: {
    getPostingReactionsSlice: jest.fn(), getCommentReactionsSlice: jest.fn(),
    getPostingReactionTotals: jest.fn(), getCommentReactionTotals: jest.fn(),
    getPostingReaction: jest.fn(), getCommentReaction: jest.fn()
}}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("state/store-sagas", () => ({dispatch: jest.fn(), select: jest.fn()}));

const alice: ReactionInfo = {ownerName: "alice", negative: false, emoji: 128077, moment: 100};
const bob: ReactionInfo = {ownerName: "bob", negative: false, emoji: 128077, moment: 110};
const own: ReactionInfo = {ownerName: "viewer", negative: false, emoji: 128077, moment: 120};
const totals = {entryId: "post-1", positive: [{emoji: 128077, total: 2}], negative: []};
const context = {
    ownerNameOrUrl: "author", homeOwnerName: "viewer", homeOwnerNameOrUrl: "viewer", searchName: "search"
} as ActionContext;
const triggerMap = collectTriggers(triggers);
let state: ClientState;
let sagaMap: SagaMap;
let pending: Promise<void>[];

function send(action: ClientAction): void {
    const signal = {...action, context};
    state = {...state, reactionsDialog: reducer(state.reactionsDialog, signal)};
    invokeTriggers(triggerMap, signal, {getState: () => state, dispatch: send});
    pending.push(invokeSaga(sagaMap, signal));
}

async function settle(): Promise<void> {
    while (pending.length > 0) {
        await Promise.all(pending.splice(0));
    }
}

function added(reaction = bob, source: EventSource = "NODE", sourceNode = "author", id = "post-1") {
    return eventAction({type: "POSTING_REACTION_ADDED", sourceNode, id, reaction}, source);
}

function deleted(reaction: ReactionInfo | null = alice) {
    return eventAction({type: "POSTING_REACTION_DELETED", sourceNode: "author", id: "post-1", reaction}, "NODE");
}

function changed(source: EventSource = "NODE", sourceNode = "author", id = "post-1") {
    return eventAction({type: "POSTING_REACTIONS_CHANGED", sourceNode, id}, source);
}

function slice(reactions: ReactionInfo[], before = 90, after = 50): ReactionsSliceInfo {
    return {before, after, total: reactions.length, reactions};
}

function deferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (error: Error) => void;
    const promise = new Promise<T>((res: (value: T) => void, rej: (error: Error) => void) => {
        resolve = res;
        reject = rej;
    });
    return {promise, resolve, reject};
}

beforeEach(() => {
    sagaMap = collectSagas(sagas);
    pending = [];
    state = {
        reactionsDialog: {
            ...reducer(undefined, openReactionsDialog("author", "post-1", null, false)),
            reactions: {0: {loading: false, total: 1, after: 90, items: [alice]}},
            totals: {loading: false, loaded: true, generation: 0, total: 1, emojis: [{emoji: 128077, total: 1}]}
        },
        postings: {author: {"post-1": {posting: {id: "post-1", ownerName: "author"}}}},
        detailedPosting: {comments: {before: Number.MAX_SAFE_INTEGER, after: Number.MIN_SAFE_INTEGER}},
        home: {owner: {name: "viewer"}, root: {location: null, api: null}},
        node: {owner: {name: "author"}, root: {location: null, api: null}},
        settings: {client: {meta: new Map(), values: new Map()}}, tokens: {}
    } as unknown as ClientState;
    (select as jest.Mock).mockImplementation(selector => selector ? selector(state) : state);
    (dispatch as jest.Mock).mockImplementation(send);
    (Node.getPostingReactionTotals as jest.Mock).mockResolvedValue(totals);
    (Node.getCommentReactionTotals as jest.Mock).mockResolvedValue(totals);
    (Node.getPostingReaction as jest.Mock).mockResolvedValue(own);
});

test.each<EventSource>(["NODE", "HOME", "RECEIVER"])("inserts a %s event without reloading pages", async (source: EventSource) => {
    send(added(bob, source));
    await settle();

    expect(getReactionsDialogItems(state)).toEqual([bob, alice]);
    expect(getReactionsDialogItems(state)[1]).toBe(alice);
    expect(state.reactionsDialog.reactions[0]?.after).toBe(90);
    expect(state.reactionsDialog.reactions[0]?.total).toBe(1);
    expect(Node.getPostingReactionsSlice).not.toHaveBeenCalled();
    expect(Node.getPostingReactionTotals).not.toHaveBeenCalled();
});

test.each<EventSource>(["NODE", "HOME", "RECEIVER"])("refreshes only totals on %s REACTIONS_CHANGED", async (source: EventSource) => {
    send(changed(source));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice]);
    expect(state.reactionsDialog.reactions[0]?.after).toBe(90);
    expect(state.reactionsDialog.reactions[0]?.total).toBe(2);
    expect(Node.getPostingReactionTotals).toHaveBeenCalledTimes(1);
    expect(Node.getPostingReactionsSlice).not.toHaveBeenCalled();
});

test("removes only the deleted reaction and preserves the pagination boundary", async () => {
    send(deleted());
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([]);
    expect(state.reactionsDialog.reactions[0]?.after).toBe(90);
    expect(Node.getPostingReactionsSlice).not.toHaveBeenCalled();
});

test.each([80, 89])("does not insert a reaction at moment %s outside the loaded range", async (moment: number) => {
    send(added({...bob, moment}));
    send(changed());
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice]);
    expect(state.reactionsDialog.reactions[0]?.total).toBe(2);
});

test("updates all cached emoji tabs using each tab's loaded range", async () => {
    state.reactionsDialog.activeTab = 128077;
    state.reactionsDialog.reactions[128077] = {...state.reactionsDialog.reactions[0]!};
    state.reactionsDialog.reactions[128150] = {loading: false, total: 0, after: 95, items: []};
    const changed = {...alice, emoji: 128150, moment: 105};
    send(added(changed));
    await settle();

    expect(state.reactionsDialog.activeTab).toBe(128077);
    expect(state.reactionsDialog.reactions[0]?.items).toEqual([changed]);
    expect(state.reactionsDialog.reactions[128077]?.items).toEqual([]);
    expect(state.reactionsDialog.reactions[128150]?.items).toEqual([changed]);
    expect(state.reactionsDialog.reactions[128150]?.after).toBe(95);
    expect(Node.getPostingReactionsSlice).not.toHaveBeenCalled();
});

test("moves a reaction out of positive tabs when its sign changes", async () => {
    send(added({...alice, negative: true}));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([]);
});

test("does not duplicate an addition received from multiple connections", async () => {
    send(added());
    send(added(bob, "RECEIVER"));
    send(changed());
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([bob, alice]);
    expect(state.reactionsDialog.reactions[0]?.total).toBe(2);
});

test("an old deletion does not remove a newer reaction from the same owner", async () => {
    const newer = {...alice, moment: 130};
    send(added(newer));
    send(deleted(alice));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([newer]);
});

test("updates a closed cached dialog and reopens it without reloading pages", async () => {
    send(closeReactionsDialog());
    send(added());
    await settle();
    send(openReactionsDialog("author", "post-1", null, false));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([bob, alice]);
    expect(Node.getPostingReactionsSlice).not.toHaveBeenCalled();
});

test("matches a copied post against its original node and ID", async () => {
    state.postings = {feed: {copy: {posting: {
        id: "copy", ownerName: "author", receiverName: "author", receiverPostingId: "post-1"
    } as ExtPostingInfo}}};
    state.reactionsDialog = {...state.reactionsDialog, nodeName: "feed", postingId: "copy"};
    send(added({...own, moment: 1000}, "NODE", "feed", "copy"));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice]);
    send(added(bob, "RECEIVER"));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([bob, alice]);
});

test.each([added(bob, "NODE", "other"), added(bob, "NODE", "author", "other"),
    changed("NODE", "other"), changed("NODE", "author", "other")])(
    "ignores unrelated events", async (action: ClientAction) => {
        send(action);
        await settle();
        expect(getReactionsDialogItems(state)).toEqual([alice]);
        expect(Node.getPostingReactionTotals).not.toHaveBeenCalled();
    }
);

test("updates only the selected comment", async () => {
    state.reactionsDialog.commentId = "comment-1";
    send(eventAction({type: "COMMENT_REACTION_ADDED", sourceNode: "author", postingId: "post-1",
        id: "comment-2", moment: 10, reaction: own}, "RECEIVER"));
    send(eventAction({type: "COMMENT_REACTION_ADDED", sourceNode: "author", postingId: "post-1",
        id: "comment-1", moment: 20, reaction: bob}, "RECEIVER"));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([bob, alice]);
    expect(Node.getCommentReactionsSlice).not.toHaveBeenCalled();
});

test("refreshes only the selected comment's totals on REACTIONS_CHANGED", async () => {
    state.reactionsDialog.commentId = "comment-1";
    send(eventAction({type: "COMMENT_REACTIONS_CHANGED", sourceNode: "author", postingId: "post-1",
        id: "comment-2", moment: 10}, "RECEIVER"));
    expect(Node.getCommentReactionTotals).not.toHaveBeenCalled();
    send(eventAction({type: "COMMENT_REACTIONS_CHANGED", sourceNode: "author", postingId: "post-1",
        id: "comment-1", moment: 20}, "RECEIVER"));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice]);
    expect(state.reactionsDialog.reactions[0]?.total).toBe(2);
    expect(Node.getCommentReactionTotals).toHaveBeenCalledTimes(1);
    expect(Node.getCommentReactionsSlice).not.toHaveBeenCalled();
});

test("does not resurrect a deletion when a pending page contains it", async () => {
    const oldPage = deferred<ReactionsSliceInfo>();
    (Node.getPostingReactionsSlice as jest.Mock).mockReturnValueOnce(oldPage.promise);
    const older = {...bob, moment: 80};
    send(reactionsDialogPastReactionsLoad());
    send(deleted(older));
    oldPage.resolve(slice([older]));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice]);
    expect(state.reactionsDialog.reactions[0]?.after).toBe(50);
});

test("inserts an event in the range being loaded and does not duplicate it in the response", async () => {
    const oldPage = deferred<ReactionsSliceInfo>();
    (Node.getPostingReactionsSlice as jest.Mock).mockReturnValueOnce(oldPage.promise);
    const older = {...bob, moment: 80};
    send(reactionsDialogPastReactionsLoad());
    send(added(older));
    oldPage.resolve(slice([older]));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice, older]);
    expect(Node.getPostingReactionsSlice).toHaveBeenCalledTimes(1);
});

test("applies additions received while the initial page is pending", async () => {
    state.reactionsDialog.reactions = {};
    const oldPage = deferred<ReactionsSliceInfo>();
    (Node.getPostingReactionsSlice as jest.Mock).mockReturnValueOnce(oldPage.promise);
    send(reactionsDialogPastReactionsLoad());
    send(added());
    oldPage.resolve(slice([alice], Number.MAX_SAFE_INTEGER, 90));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([bob, alice]);
});

test("bulk deletion clears every cached tab and ignores a stale page", async () => {
    state.reactionsDialog.reactions[128077] = {...state.reactionsDialog.reactions[0]!};
    const oldPage = deferred<ReactionsSliceInfo>();
    (Node.getPostingReactionsSlice as jest.Mock).mockReturnValueOnce(oldPage.promise);
    send(reactionsDialogPastReactionsLoad());
    send(deleted(null));
    send(added(bob));
    oldPage.resolve(slice([alice]));
    await settle();
    expect(state.reactionsDialog.reactions[0]?.items).toEqual([bob]);
    expect(state.reactionsDialog.reactions[128077]?.items).toEqual([bob]);
    expect(state.reactionsDialog.reactions[0]?.loading).toBe(false);
});

test("background totals refresh does not hide the loaded list or overwrite newer totals", async () => {
    const oldTotals = deferred<typeof totals>();
    (Node.getPostingReactionTotals as jest.Mock).mockReturnValueOnce(oldTotals.promise);
    send(changed());
    expect(isReactionsDialogLoading(state)).toBe(false);
    send(changed());
    oldTotals.resolve({...totals, positive: [{emoji: 128077, total: 1}]});
    await settle();
    expect(state.reactionsDialog.totals.total).toBe(2);
});

test("a failed comment page clears its own loading flag after switching tabs", async () => {
    state.reactionsDialog.commentId = "comment-1";
    const oldPage = deferred<ReactionsSliceInfo>();
    (Node.getCommentReactionsSlice as jest.Mock).mockReturnValueOnce(oldPage.promise)
        .mockResolvedValueOnce(slice([bob], Number.MAX_SAFE_INTEGER, 90));
    send(reactionsDialogPastReactionsLoad());
    send(reactionsDialogSelectTab(128077));
    oldPage.reject(new Error("offline"));
    await settle();
    expect(state.reactionsDialog.reactions[0]?.loading).toBe(false);
    expect(getReactionsDialogItems(state)).toEqual([bob]);
});

test("updates the viewer's reaction from original-node events without loading it", async () => {
    send(added(own, "RECEIVER"));
    expect(getReactionsDialogItems(state)).toEqual([own, alice]);
    send(deleted(own));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice]);
    expect(Node.getPostingReaction).not.toHaveBeenCalled();
    expect(Node.getPostingReactionsSlice).not.toHaveBeenCalled();
});

test("home confirmations do not change the reaction list or load individual reactions", async () => {
    send(added(own));
    send(eventAction({type: "REMOTE_REACTION_DELETED", sourceNode: "viewer", remoteNodeName: "author",
        remotePostingId: "post-1"}, "HOME"));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([own, alice]);
    send(deleted(own));
    send(eventAction({type: "REMOTE_REACTION_ADDED", sourceNode: "viewer", remoteNodeName: "author",
        remotePostingId: "post-1", negative: false, emoji: 128077, createdAt: 110}, "HOME"));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice]);
    expect(Node.getPostingReaction).not.toHaveBeenCalled();
    expect(Node.getPostingReactionsSlice).not.toHaveBeenCalled();
});

test("a delayed home confirmation cannot override a freshly opened dialog", async () => {
    state.reactionsDialog = reducer(undefined, openReactionsDialog("author", "other", null, false));
    send(added(own));
    send(deleted(own));
    (Node.getPostingReactionsSlice as jest.Mock).mockResolvedValueOnce(
        slice([alice], Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)
    );
    send(openReactionsDialog("author", "post-1", null, false));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice]);

    send(eventAction({type: "REMOTE_REACTION_ADDED", sourceNode: "viewer", remoteNodeName: "author",
        remotePostingId: "post-1", negative: false, emoji: 128077, createdAt: 110}, "HOME"));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice]);
    expect(Node.getPostingReaction).not.toHaveBeenCalled();
    expect(Node.getPostingReactionsSlice).toHaveBeenCalledTimes(1);
});

test("preserves a reaction already loaded at the pagination boundary", async () => {
    const boundary = {...bob, moment: 90};
    state.reactionsDialog.reactions[0]!.items.push(boundary);
    send(added(boundary));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice, boundary]);
});

test("does not duplicate the boundary reaction when the next page includes it", async () => {
    const boundary = {...bob, moment: 90};
    state.reactionsDialog.reactions[0]!.items.push(boundary);
    (Node.getPostingReactionsSlice as jest.Mock).mockResolvedValueOnce(slice([boundary]));
    send(reactionsDialogPastReactionsLoad());
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice, boundary]);
});

test("accepts restoration of an older reaction from a newer event", async () => {
    const newer = {...alice, moment: 130};
    send(added(newer));
    send(deleted(newer));
    send(added(alice));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice]);
});

test("restores a replaced reaction at the included pagination boundary", async () => {
    state.reactionsDialog.reactions[0]!.after = alice.moment!;
    const replacement = {...alice, moment: 130};
    send(deleted(alice));
    send(added(replacement));
    send(deleted(replacement));
    send(added(alice));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([alice]);
});

test("ignores an old page after clearing and reopening the same dialog", async () => {
    const oldPage = deferred<ReactionsSliceInfo>();
    (Node.getPostingReactionsSlice as jest.Mock).mockReturnValueOnce(oldPage.promise)
        .mockResolvedValueOnce(slice([bob], Number.MAX_SAFE_INTEGER, 90));
    send(reactionsDialogPastReactionsLoad());
    send(reactionsDialogUnset());
    send(openReactionsDialog("author", "post-1", null, false));
    oldPage.resolve(slice([own], 90, 50));
    await settle();
    expect(getReactionsDialogItems(state)).toEqual([bob]);
    expect(state.reactionsDialog.reactions[0]?.after).toBe(90);
});
