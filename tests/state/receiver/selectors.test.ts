import { ExtPostingInfo } from "state/postings/state";
import {
    getReactionsReceiverNodeName, getReactionsReceiverNodeUri, getReceiverNodeName, getReceiverNodeUri
} from "state/receiver/selectors";
import { ClientState } from "state/state";
import { REL_CURRENT, REL_HOME, RelNodeName } from "util/rel-node-name";

jest.mock("api", () => ({}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));

let state: ClientState;

beforeEach(() => {
    state = {
        navigation: {page: "news"},
        home: {owner: {name: "viewer"}, root: {location: "https://viewer.example", api: "https://viewer.example/moera/api"}},
        node: {owner: {name: "feed"}, root: {location: "https://feed.example", api: "https://feed.example/moera/api"}},
        detailedPosting: {comments: {receiverName: "other"}},
        reactionsDialog: {show: true, nodeName: REL_CURRENT, postingId: "copy", commentId: null},
        postings: {feed: {copy: {posting: {id: "copy", receiverName: "author", receiverPostingId: "original"}}}},
        naming: {names: {
            author: {loaded: true, nodeUri: "https://author.example/moera"},
            other: {loaded: true, nodeUri: "https://other.example/moera"}
        }},
        settings: {client: {meta: new Map(), values: new Map()}}
    } as unknown as ClientState;
});

test("subscribes to the original posting node while the dialog is open on a feed", () => {
    expect(getReactionsReceiverNodeName(state)).toBe("author");
    expect(getReactionsReceiverNodeUri(state)).toBe("https://author.example/moera");
    expect(getReceiverNodeName(state)).toBeNull();
});

test("uses the posting's node when a remote posting is not a copy", () => {
    state.reactionsDialog.nodeName = "author";
    state.reactionsDialog.postingId = "original";
    state.postings = {author: {original: {posting: {id: "original"} as ExtPostingInfo}}};

    expect(getReactionsReceiverNodeName(state)).toBe("author");
    expect(getReactionsReceiverNodeUri(state)).toBe("https://author.example/moera");
});

test("keeps the cached dialog subscribed after closing", () => {
    state.reactionsDialog.show = false;

    expect(getReactionsReceiverNodeName(state)).toBe("author");
    expect(getReactionsReceiverNodeUri(state)).toBe("https://author.example/moera");
});

test("disconnects the extra subscription when the dialog cache is cleared", () => {
    state.reactionsDialog.postingId = null;

    expect(getReactionsReceiverNodeName(state)).toBeNull();
    expect(getReactionsReceiverNodeUri(state)).toBeNull();
});

test("waits for the posting and its naming lookup", () => {
    state.postings = {};
    expect(getReactionsReceiverNodeUri(state)).toBeNull();

    state.postings = {feed: {copy: {posting: {
        id: "copy", receiverName: "unresolved", receiverPostingId: "original"
    } as ExtPostingInfo}}};
    expect(getReactionsReceiverNodeName(state)).toBe("unresolved");
    expect(getReactionsReceiverNodeUri(state)).toBeNull();

    state.naming.names.unresolved = {
        loaded: true, loading: false, nodeUri: "https://resolved.example/moera", accessed: 0, updated: 0
    };
    expect(getReactionsReceiverNodeUri(state)).toBe("https://resolved.example/moera");
});

test.each(["viewer", "feed", "other"])("reuses the existing subscription for %s", (nodeName: string) => {
    state.navigation.page = "detailedposting";
    state.postings.feed!.copy!.posting!.receiverName = nodeName;

    expect(getReactionsReceiverNodeName(state)).toBeNull();
    expect(getReactionsReceiverNodeUri(state)).toBeNull();
});

test.each([REL_CURRENT, REL_HOME])("resolves the %s node before avoiding a duplicate subscription", (nodeName: RelNodeName) => {
    state.reactionsDialog.nodeName = nodeName;
    state.postings = {
        feed: {copy: {posting: {id: "copy"} as ExtPostingInfo}},
        viewer: {copy: {posting: {id: "copy"} as ExtPostingInfo}}
    };

    expect(getReactionsReceiverNodeName(state)).toBeNull();
});

test("preserves a different detailed posting receiver while subscribing for the dialog", () => {
    state.navigation.page = "detailedposting";
    state.reactionsDialog.commentId = "comment-1";

    expect(getReactionsReceiverNodeName(state)).toBe("author");
    expect(getReactionsReceiverNodeUri(state)).toBe("https://author.example/moera");
    expect(getReceiverNodeName(state)).toBe("other");
    expect(getReceiverNodeUri(state)).toBe("https://other.example/moera");
});
