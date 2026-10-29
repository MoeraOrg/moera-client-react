import { describe, expect, jest, test } from '@jest/globals';

import { CommentInfo } from "api";
import { ActionContext } from "state/action-types";
import { commentsReceiverSwitched, commentSet } from "state/detailedposting/actions";
import reducer from "state/detailedposting/reducer";

jest.mock("util/media-images", () => ({}));

const context: ActionContext = {
    ownerName: "alice", ownerNameOrUrl: "alice", ownerFullName: null, ownerSourceUri: null,
    homeOwnerName: "alice", homeOwnerNameOrUrl: "alice", homeOwnerFullName: null,
    homeOwnerSourceUri: null, homeOwnerGender: null, homeOwnerAvatar: null, searchName: "search"
};

describe("single emoji comments", () => {
    test.each<[string, boolean]>([
        ["<p>🤷🏽‍♀️</p>", true],
        ["<p>👨‍👩‍👧‍👦</p>", true],
        ["<p>&#129335;&#8205;&#9792;&#65039;</p>", true],
        ["<p>  🤷‍♀  </p>", true],
        ["  <p> <mr-spoiler> 👩🏽‍💻 </mr-spoiler> </p>  ", true],
        ["<p>™</p>", false],
        ["<p>™️</p>", true],
        ["<p>🤷‍♀ 👍🏿</p>", false],
        ["<p>Hello 🤷‍♀</p>", false],
        ["<p>🙂‍↔️</p>", false]
    ])("classifies %s without a UTF-16 length limit", (text, singleEmoji) => {
        const initial = reducer(undefined, {...commentsReceiverSwitched("alice", null, null, "post-1"), context});
        const state = {...initial, comments: {...initial.comments, before: Number.MAX_SAFE_INTEGER}};
        const comment: CommentInfo = {
            id: "comment-1", ownerName: "alice", postingId: "post-1", postingRevisionId: "post-revision-1",
            revisionId: "comment-revision-1", totalRevisions: 1, bodySrcHash: "hash", body: {text}, heading: text,
            moment: 100, createdAt: 100, revisionCreatedAt: 100
        };

        const updated = reducer(state, {...commentSet("alice", comment), context});

        expect(updated.comments.comments).toHaveLength(1);
        expect(updated.comments.comments[0].singleEmoji).toBe(singleEmoji);
    });
});
