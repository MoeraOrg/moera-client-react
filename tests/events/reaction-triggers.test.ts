import { eventAction } from "api/events";
import { ClientAction } from "state/action";
import { ActionContext } from "state/action-types";
import composeTriggers from "state/compose/triggers";
import detailedPostingReducer from "state/detailedposting/reducer";
import { ExtCommentInfo } from "state/detailedposting/state";
import detailedPostingTriggers from "state/detailedposting/triggers";
import postingTriggers from "state/postings/triggers";
import { ClientState } from "state/state";
import { collectTriggers, invokeTriggers } from "state/trigger";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";

jest.mock("api", () => ({}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("util/html", () => ({}));

const triggers = collectTriggers(postingTriggers, detailedPostingTriggers, composeTriggers);
const context = {ownerNameOrUrl: "author", homeOwnerNameOrUrl: "viewer", searchName: "search"} as ActionContext;
const reaction = {ownerName: "viewer", negative: false, emoji: 128077, moment: 100};
let state: ClientState;

beforeEach(() => {
    state = {
        navigation: {page: "detailedposting"},
        home: {owner: {name: "viewer"}, root: {location: "https://viewer.example"}},
        node: {owner: {name: "author"}, root: {api: "https://author.example/moera/api"}},
        postings: {
            author: {"post-1": {posting: {id: "post-1"}}},
            viewer: {"post-1": {posting: {id: "post-1"}}}
        },
        detailedPosting: {
            comments: {receiverName: "author", receiverPostingId: "post-1", before: 100, after: 0},
            commentDialog: {show: true, commentId: "comment-1"}
        },
        settings: {client: {meta: new Map(), values: new Map()}},
        tokens: {"https://viewer.example": {token: "token"}}
    } as unknown as ClientState;
});

function triggered(action: ClientAction): ClientAction[] {
    const actions: ClientAction[] = [];
    invokeTriggers(triggers, {...action, context}, {
        getState: () => state,
        dispatch: <T extends ClientAction>(action: T): T => {
            actions.push(action);
            return action;
        }
    });
    return actions;
}

test.each(["POSTING_REACTION_ADDED", "POSTING_REACTION_DELETED"] as const)(
    "%s leaves posting counters to REACTIONS_CHANGED",
    (type: "POSTING_REACTION_ADDED" | "POSTING_REACTION_DELETED") => {
        expect(triggered(eventAction({type, sourceNode: "author", id: "post-1", reaction}, "NODE")))
            .toEqual([]);
        expect(triggered(eventAction({type, sourceNode: "viewer", id: "post-1", reaction}, "HOME")))
            .toEqual([]);
    }
);

test("POSTING_REACTIONS_CHANGED refreshes reaction attributes and totals without a revision conflict", () => {
    state.navigation.page = "compose";
    state.compose = {...state.compose, postingId: "post-1"};
    expect(triggered(eventAction({type: "POSTING_REACTIONS_CHANGED", sourceNode: "author", id: "post-1"}, "NODE")))
        .toEqual([expect.objectContaining({type: "POSTING_REACTION_LOAD", payload: {id: "post-1", nodeName: REL_CURRENT}})]);
    expect(triggered(eventAction({type: "POSTING_REACTIONS_CHANGED", sourceNode: "viewer", id: "post-1"}, "HOME")))
        .toEqual([expect.objectContaining({type: "POSTING_REACTION_LOAD", payload: {id: "post-1", nodeName: REL_HOME}})]);
});

test.each<[string, string[]]>([
    ["other", ["comment-1"]],
    ["author", []]
])("applies comment deletions only from the detailed posting's receiver (%s)", (sourceNode: string, expectedIds: string[]) => {
    state.detailedPosting.comments.comments = [{id: "comment-1"} as ExtCommentInfo];
    const updated = detailedPostingReducer(state.detailedPosting, {...eventAction({
        type: "COMMENT_DELETED", sourceNode, id: "comment-1", postingId: "post-1", moment: 50
    }, "RECEIVER"), context});

    expect(updated.comments.comments.map((comment: ExtCommentInfo) => comment.id)).toEqual(expectedIds);
});

test.each(["COMMENT_REACTION_ADDED", "COMMENT_REACTION_DELETED"] as const)(
    "%s leaves comment counters to REACTIONS_CHANGED",
    (type: "COMMENT_REACTION_ADDED" | "COMMENT_REACTION_DELETED") => {
        expect(triggered(eventAction({
            type, sourceNode: "author", id: "comment-1", postingId: "post-1", moment: 50, reaction
        }, "RECEIVER"))).toEqual([]);
    }
);

test("COMMENT_REACTIONS_CHANGED refreshes reactions without reloading the comment or reporting a revision conflict", () => {
    expect(triggered(eventAction({
        type: "COMMENT_REACTIONS_CHANGED", sourceNode: "author", id: "comment-1", postingId: "post-1", moment: 50
    }, "RECEIVER"))).toEqual([expect.objectContaining({
        type: "COMMENT_REACTION_LOAD", payload: {id: "comment-1", postingId: "post-1"}
    })]);
});

test("ignores reaction events for uncached postings and comments outside the loaded range", () => {
    expect(triggered(eventAction({type: "POSTING_REACTIONS_CHANGED", sourceNode: "author", id: "unloaded"}, "NODE")))
        .toEqual([]);
    expect(triggered(eventAction({
        type: "COMMENT_REACTIONS_CHANGED", sourceNode: "author", id: "comment-1", postingId: "post-1", moment: 101
    }, "RECEIVER"))).toEqual([]);
});

test.each(["COMMENT_ADDED", "COMMENT_UPDATED", "COMMENT_REACTIONS_CHANGED"] as const)(
    "ignores %s from a dialog's other node with the same posting and comment IDs",
    (type: "COMMENT_ADDED" | "COMMENT_UPDATED" | "COMMENT_REACTIONS_CHANGED") => {
        expect(triggered(eventAction({
            type, sourceNode: "other", id: "comment-1", postingId: "post-1", moment: 50, reaction
        }, "RECEIVER"))).toEqual([]);
    }
);
