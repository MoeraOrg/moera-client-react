import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';
import { parse as parseEmojis } from 'twemoji-parser';

import { GO_TO_PAGE, INIT_FROM_LOCATION } from "state/navigation/actions";
import { PAGE_DETAILED_POSTING } from "state/navigation/pages";
import {
    CLOSE_COMMENT_DIALOG,
    COMMENT_COMPOSE_CANCELLED,
    COMMENT_DELETE,
    COMMENT_DELETE_FAILED,
    COMMENT_DELETED,
    COMMENT_DIALOG_COMMENT_LOAD,
    COMMENT_DIALOG_COMMENT_LOAD_FAILED,
    COMMENT_DIALOG_COMMENT_LOADED,
    COMMENT_DIALOG_CONFLICT,
    COMMENT_DIALOG_CONFLICT_CLOSE,
    COMMENT_DRAFT_LOAD,
    COMMENT_DRAFT_LOAD_FAILED,
    COMMENT_DRAFT_LOADED,
    COMMENT_DRAFT_SAVE,
    COMMENT_DRAFT_SAVE_FAILED,
    COMMENT_DRAFT_SAVED,
    COMMENT_POST,
    COMMENT_POST_FAILED,
    COMMENT_POSTED,
    COMMENT_REACT,
    COMMENT_REACTION_DELETE,
    COMMENT_REACTION_SET,
    COMMENT_REPLIED_TO_SET,
    COMMENT_REPLIED_TO_UNSET,
    COMMENT_SET,
    COMMENT_VERIFY,
    COMMENT_VERIFY_FAILED,
    COMMENTS_FUTURE_SLICE_LOAD,
    COMMENTS_FUTURE_SLICE_LOAD_FAILED,
    COMMENTS_FUTURE_SLICE_SET,
    COMMENTS_PAST_SLICE_LOAD,
    COMMENTS_PAST_SLICE_LOAD_FAILED,
    COMMENTS_PAST_SLICE_SET,
    COMMENTS_RECEIVER_SWITCHED,
    COMMENTS_SCROLL_TO_ANCHOR,
    COMMENTS_SCROLL_TO_COMPOSER,
    COMMENTS_SCROLLED_TO_ANCHOR,
    COMMENTS_SCROLLED_TO_COMMENTS,
    COMMENTS_SCROLLED_TO_COMPOSER,
    COMMENTS_SLICE_UPDATE,
    COMMENTS_UNSET,
    DETAILED_POSTING_LOAD,
    DETAILED_POSTING_LOAD_FAILED,
    DETAILED_POSTING_LOADED,
    FOCUS_COMMENT,
    FOCUSED_COMMENT_LOAD,
    FOCUSED_COMMENT_LOAD_FAILED,
    FOCUSED_COMMENT_LOADED,
    GLANCE_COMMENT,
    GLANCE_COMMENT_LOAD,
    GLANCE_COMMENT_LOAD_FAILED,
    GLANCE_COMMENT_LOADED,
    OPEN_COMMENT_DIALOG
} from "state/detailedposting/actions";
import { htmlEntities, replaceEmojis, safeHtml, safePreviewHtml } from "util/html";
import { CommentsState, DetailedPostingState, ExtCommentInfo } from "state/detailedposting/state";
import { ClientAction } from "state/action";
import { CommentInfo } from "api/node/api-types";
import {
    EVENT_HOME_REMOTE_COMMENT_VERIFICATION_FAILED,
    EVENT_HOME_REMOTE_COMMENT_VERIFIED,
    EVENT_RECEIVER_COMMENT_DELETED
} from "api/events/actions";

const emptyComments = {
    receiverName: null,
    receiverFullName: null,
    receiverPostingId: null,
    loadingFuture: false,
    loadingPast: false,
    before: Number.MIN_SAFE_INTEGER,
    after: Number.MIN_SAFE_INTEGER,
    comments: [],
    totalInFuture: 0,
    totalInPast: 0,
    anchor: null,
    focused: false,
    loadingFocusedComment: false,
    loadedFocusedComment: false,
    focusedCommentId: null,
    focusedMoment: Number.MIN_SAFE_INTEGER,
    loadingGlanceComment: false,
    loadedGlanceComment: false,
    glanceCommentId: null,
    glanceComment: null
};

const emptyCompose = {
    beingPosted: false,
    focused: false,
    loading: false,
    loaded: false,
    repliedToId: null,
    repliedToName: null,
    repliedToFullName: null,
    repliedToHeading: null,
    draft: null,
    savingDraft: false,
    savedDraft: false
};

const emptyComposeDialog = {
    show: false,
    loading: false,
    loaded: false,
    commentId: null,
    comment: null,
    beingPosted: false,
    conflict: false,
    draft: null,
    savingDraft: false,
    savedDraft: false
};

const initialState = {
    id: null,
    loading: false,
    comments: cloneDeep(emptyComments),
    positioned: false,
    compose: {
        formId: 0,
        ...emptyCompose
    },
    commentDialog: cloneDeep(emptyComposeDialog)
};

const SINGLE_EMOJI_COMMENT_ALLOWED_TAGS = ["mr-spoiler", "a", "del", "strike"];
const SINGLE_EMOJI_COMMENT_ALLOWED_TAGS_REGEX = `(?:${SINGLE_EMOJI_COMMENT_ALLOWED_TAGS.join("|")})`
const SINGLE_EMOJI_COMMENT_REGEX = new RegExp(
    `^\\s*(?:<\\s*p\\s*>\\s*)?`+ // Optional opening <p>
    `(?:<\\s*${SINGLE_EMOJI_COMMENT_ALLOWED_TAGS_REGEX}(?:\\s+[^>]+\\s+)?\\s*>\\s*)?` + // Optional opening tag
    `([^<]{1,6})\\s*` + // Up to six chars (emojis may be long)
    `(?:<\\s*\\/${SINGLE_EMOJI_COMMENT_ALLOWED_TAGS_REGEX}\\s*>\\s*)?` + // Optional closing tag
    `(?:<\\/\\s*p\\s*>\\s*)?$`, // Optional closing <p>
    'gi'
);

function isSingleEmojiComment(comment: CommentInfo) {
    if (!comment.body.text) {
        return false;
    }

    const match = comment.body.text.matchAll(SINGLE_EMOJI_COMMENT_REGEX).next().value;
    if (!match) {
        return false;
    }

    const innerText = match[1];
    const emojis = parseEmojis(innerText);
    if (emojis.length !== 1) {
        return false;
    }
    const indices = emojis[0].indices;
    return indices[0] === 0 && indices[1] === innerText.length;
}

function isExtracted(comment: CommentInfo | ExtCommentInfo): comment is ExtCommentInfo {
    return (comment as ExtCommentInfo).verificationStatus != null;
}

function extractComment(comment: CommentInfo | ExtCommentInfo): ExtCommentInfo {
    if (isExtracted(comment)) { // Already extracted
        return comment;
    }
    const icomment = immutable.wrap(comment as ExtCommentInfo);
    if (comment.bodyPreview == null || !comment.bodyPreview.text) {
        icomment.set("body.previewText", safePreviewHtml(comment.body.text ?? ""));
    }
    if (comment.repliedTo && comment.repliedTo.heading) {
        icomment.set("repliedTo.headingHtml", replaceEmojis(htmlEntities(comment.repliedTo.heading)));
    }
    return icomment
        .update("bodyPreview.text", text => safePreviewHtml(text))
        .update("body.text", text => safeHtml(text))
        .set("deleting", false)
        .set("verificationStatus", "none")
        .set("singleEmoji", isSingleEmojiComment(comment))
        .value();
}

export default (state: DetailedPostingState = initialState, action: ClientAction): DetailedPostingState => {
    switch (action.type) {
        case INIT_FROM_LOCATION:
            return cloneDeep(initialState);

        case GO_TO_PAGE: {
            if (action.payload.page === PAGE_DETAILED_POSTING) {
                const {details: {id, commentId}} = action.payload;

                const istate = immutable.wrap(state);
                if (state.id !== id) {
                    istate.set("id", id)
                        .set("loading", false)
                        .assign("comments", cloneDeep(emptyComments))
                        .assign("compose", cloneDeep(emptyCompose))
                        .assign("commentDialog", cloneDeep(emptyComposeDialog))
                } else {
                    istate.set("compose.focused", false)
                        .assign("comments", {
                            focused: false,
                            loadingFocusedComment: false,
                            loadedFocusedComment: false,
                            focusedCommentId: null,
                            focusedMoment: Number.MIN_SAFE_INTEGER
                        });
                }
                istate.set("positioned", commentId != null);
                if (commentId != null) {
                    switch (commentId) {
                        case "comments":
                            istate.set("comments.focused", true);
                            break;
                        case "comment-add":
                            istate.set("compose.focused", true);
                            break;
                        default:
                            istate.set("comments.focusedCommentId", commentId);
                            break;
                    }
                }
                return istate.value();
            }
            return state;
        }

        case DETAILED_POSTING_LOAD:
            return {
                ...state,
                loading: true
            };

        case DETAILED_POSTING_LOADED:
        case DETAILED_POSTING_LOAD_FAILED:
            return {
                ...state,
                loading: false
            };

        case COMMENTS_RECEIVER_SWITCHED:
            return immutable.wrap(state)
                .assign("comments", {
                    ...cloneDeep(emptyComments),
                    receiverName: action.payload.nodeName,
                    receiverFullName: action.payload.fullName,
                    receiverPostingId: action.payload.postingId,
                    focused: state.comments.focused,
                    focusedCommentId: state.comments.focusedCommentId
                })
                .assign("compose", cloneDeep(emptyCompose)) // assign, not set!
                .set("commentDialog", cloneDeep(emptyComposeDialog))
                .value()

        case COMMENTS_PAST_SLICE_LOAD:
            return immutable.set(state, "comments.loadingPast", true);

        case COMMENTS_PAST_SLICE_LOAD_FAILED:
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            return immutable.set(state, "comments.loadingPast", false);

        case COMMENTS_FUTURE_SLICE_LOAD:
            return immutable.set(state, "comments.loadingFuture", true);

        case COMMENTS_FUTURE_SLICE_LOAD_FAILED:
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            return immutable.set(state, "comments.loadingFuture", false);

        case COMMENTS_PAST_SLICE_SET: {
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            const istate = immutable.wrap(state);
            if (action.payload.before >= state.comments.after && action.payload.after < state.comments.after) {
                const comments = state.comments.comments.slice();
                action.payload.comments
                    .filter(c => c.moment <= state.comments.after)
                    .forEach(c => comments.push(extractComment(c)));
                comments.sort((a, b) => a.moment - b.moment);
                return istate.assign("comments", {
                    loadingPast: false,
                    after: action.payload.after,
                    comments,
                    totalInPast: action.payload.totalInPast
                }).value();
            } else {
                return istate.set("comments.loadingPast", false).value();
            }
        }

        case COMMENTS_FUTURE_SLICE_SET: {
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            const istate = immutable.wrap(state);
            if (action.payload.before > state.comments.before && action.payload.after <= state.comments.before) {
                const comments = state.comments.comments.slice();
                action.payload.comments
                    .filter(c => c.moment > state.comments.before)
                    .forEach(c => comments.push(extractComment(c)));
                comments.sort((a, b) => a.moment - b.moment);
                return istate.assign("comments", {
                    loadingFuture: false,
                    before: action.payload.before,
                    comments,
                    totalInFuture: action.payload.totalInFuture
                }).value();
            } else {
                return istate.set("comments.loadingFuture", false).value();
            }
        }

        case COMMENTS_SLICE_UPDATE: {
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            const istate = immutable.wrap(state);
            const comments = state.comments.comments.slice()
                    .filter(c => c.moment > action.payload.before || c.moment <= action.payload.after);
            action.payload.comments
                .filter(c => c.moment <= state.comments.before && c.moment > state.comments.after)
                .forEach(c => comments.push(extractComment(c)));
            comments.sort((a, b) => a.moment - b.moment);
            istate.assign("comments", {comments});
            if (action.payload.before === state.comments.before) {
                istate.set("comments.totalInFuture", action.payload.totalInFuture);
            }
            if (action.payload.after === state.comments.after) {
                istate.set("comments.totalInPast", action.payload.totalInPast);
            }
            return istate.value();
        }

        case COMMENTS_SCROLL_TO_ANCHOR: {
            const {anchor} = action.payload;
            const istate = immutable.wrap(state);
            if (anchor != null) {
                if (anchor <= state.comments.before && anchor > state.comments.after) {
                    istate.set("comments.anchor", anchor);
                } else {
                    istate.assign("comments", {
                        before: anchor,
                        after: anchor,
                        comments: [],
                        totalInFuture: 0,
                        totalInPast: 0,
                        anchor
                    });
                }
            }
            return istate.value();
        }

        case COMMENTS_UNSET: {
            const commentsFocused = state.comments.focused;
            const commentsFocusedCommentId = state.comments.focusedCommentId;
            const composeFocused = state.compose.focused;
            return immutable.wrap(state)
                .assign("comments", {
                    ...cloneDeep(emptyComments),
                    focused: commentsFocused,
                    focusedCommentId: commentsFocusedCommentId
                } as CommentsState)
                .assign("compose", {
                    ...emptyCompose,
                    focused: composeFocused
                })
                .set("commentDialog", cloneDeep(emptyComposeDialog))
                .value()
        }

        case COMMENTS_SCROLL_TO_COMPOSER:
            return immutable.set(state, "compose.focused", true);

        case COMMENTS_SCROLLED_TO_ANCHOR:
            return immutable.set(state, "comments.anchor", null);

        case COMMENTS_SCROLLED_TO_COMMENTS:
            return immutable.set(state, "comments.focused", false);

        case COMMENTS_SCROLLED_TO_COMPOSER:
            return immutable.set(state, "compose.focused", false);

        case COMMENT_COMPOSE_CANCELLED:
            return immutable.assign(state, "compose", {
                formId: state.compose.formId + 1,
                ...emptyCompose
            });

        case COMMENT_POST:
            if (action.payload.commentId != null) {
                return immutable.set(state, "commentDialog.beingPosted", true);
            } else {
                return immutable.set(state, "compose.beingPosted", true);
            }

        case COMMENT_POSTED: {
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }

            const istate = immutable.wrap(state);
            istate.assign("comments", {
                focused: false,
                loadingFocusedComment: false,
                loadedFocusedComment: false,
                focusedCommentId: null,
                focusedMoment: Number.MIN_SAFE_INTEGER
            });

            if (action.payload.commentId === state.commentDialog.commentId) {
                istate.set("commentDialog", cloneDeep(emptyComposeDialog));
            } else {
                istate.assign("compose", {
                    formId: state.compose.formId + 1,
                    ...emptyCompose
                });
            }
            return istate.value();
        }

        case COMMENT_POST_FAILED:
                return immutable.wrap(state)
                    .set("commentDialog.beingPosted", false)
                    .set("compose.beingPosted", false)
                    .value()

        case COMMENT_DRAFT_LOAD: {
            const property = action.payload.isDialog != null ? "commentDialog" : "compose";
            return immutable.assign(state, property, {
                loading: true
            });
        }

        case COMMENT_DRAFT_LOADED: {
            if (action.payload.draft.receiverName !== state.comments.receiverName
                || action.payload.draft.receiverPostingId !== state.comments.receiverPostingId) {
                return state;
            }
            if (action.payload.draft.receiverCommentId != null
                && action.payload.draft.receiverCommentId !== state.commentDialog.commentId) {
                return state;
            }

            const property = action.payload.draft.receiverCommentId != null ? "commentDialog" : "compose";
            return immutable.assign(state, property, {
                draft: action.payload.draft,
                loading: false,
                loaded: true
            });
        }

        case COMMENT_DRAFT_LOAD_FAILED: {
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            if (action.payload.commentId != null && action.payload.commentId !== state.commentDialog.commentId) {
                return state;
            }

            const property = action.payload.commentId != null ? "commentDialog" : "compose";
            return immutable.assign(state, property, {
                loading: false
            });
        }

        case COMMENT_DRAFT_SAVE: {
            if (action.payload.draftText.receiverName !== state.comments.receiverName
                || action.payload.draftText.receiverPostingId !== state.comments.receiverPostingId) {
                return state;
            }

            const property = action.payload.draftText.receiverCommentId != null ? "commentDialog" : "compose";
            return immutable.assign(state, property, {
                savingDraft: true,
                savedDraft: false
            });
        }

        case COMMENT_DRAFT_SAVED: {
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }

            const property = action.payload.commentId != null ? "commentDialog" : "compose";
            return immutable.assign(state, property, {
                draft: action.payload.draft,
                savingDraft: false,
                savedDraft: true
            });
        }

        case COMMENT_DRAFT_SAVE_FAILED: {
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }

            const property = action.payload.commentId != null ? "commentDialog" : "compose";
            return immutable.assign(state, property, {
                savingDraft: false,
                savedDraft: false
            });
        }

        case COMMENT_SET: {
            const {nodeName, comment} = action.payload;
            if (nodeName === state.comments.receiverName
                && comment.postingId === state.comments.receiverPostingId
                && comment.moment <= state.comments.before
                && comment.moment > state.comments.after) {

                const comments = state.comments.comments.filter(c => c.id !== comment.id);
                comments.push(extractComment(comment));
                comments.sort((a, b) => a.moment - b.moment);
                return immutable.set(state, "comments.comments", comments);
            }
            return state;
        }

        case COMMENT_DELETE: {
            const index = state.comments.comments.findIndex(c => c.id === action.payload.commentId);
            if (index < 0) {
                return state;
            }
            return immutable.set(state, ["comments", "comments", index, "deleting"], true);
        }

        case COMMENT_DELETED: {
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            const index = state.comments.comments.findIndex(c => c.id === action.payload.commentId);
            if (index < 0) {
                return state;
            }
            return immutable.del(state, ["comments", "comments", index]);
        }

        case COMMENT_DELETE_FAILED: {
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            const index = state.comments.comments.findIndex(c => c.id === action.payload.commentId);
            if (index < 0) {
                return state;
            }
            return immutable.set(state, ["comments", "comments", index, "deleting"], false);
        }

        case EVENT_RECEIVER_COMMENT_DELETED: {
            const {id, postingId, moment} = action.payload;

            if (state.comments.receiverPostingId !== postingId
                || moment > state.comments.before
                || moment <= state.comments.after) {
                return state;
            }
            const index = state.comments.comments.findIndex(c => c.id === id);
            if (index < 0) {
                return state;
            }
            return immutable.del(state, ["comments", "comments", index]);
        }

        case FOCUS_COMMENT: {
            const comment = state.comments.comments.find(c => c.id === state.comments.focusedCommentId);
            if (comment == null) {
                return state;
            }
            return immutable.assign(state, "comments", {
                anchor: comment.moment,
                loadingFocusedComment: false,
                loadedFocusedComment: true,
                focusedMoment: comment.moment
            });
        }

        case FOCUSED_COMMENT_LOAD:
            return immutable.set(state, "comments.loadingFocusedComment", true);

        case FOCUSED_COMMENT_LOAD_FAILED:
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            return immutable.assign(state, "comments", {
                loadingFocusedComment: false,
                focusedCommentId: null
            });

        case FOCUSED_COMMENT_LOADED: {
            const {nodeName, comment} = action.payload;
            if (nodeName !== state.comments.receiverName || comment.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            return immutable.assign(state, "comments", {
                before: comment.moment,
                after: comment.moment - 1,
                comments: [extractComment(comment)],
                totalInFuture: 0,
                totalInPast: 0,
                anchor: comment.moment,
                loadingFocusedComment: false,
                loadedFocusedComment: true,
                focusedMoment: comment.moment
            });
        }

        case OPEN_COMMENT_DIALOG:
            return immutable.assign(state, "commentDialog", {
                ...emptyComposeDialog,
                show: true,
                commentId: action.payload.commentId
            });

        case CLOSE_COMMENT_DIALOG:
            return immutable.set(state, "commentDialog.show", false);

        case COMMENT_DIALOG_COMMENT_LOAD:
            return immutable.set(state, "commentDialog.loading", true);

        case COMMENT_DIALOG_COMMENT_LOADED:
            return immutable.assign(state, "commentDialog", {
                loading: false,
                comment: action.payload.comment
            });

        case COMMENT_DIALOG_COMMENT_LOAD_FAILED:
            return immutable.set(state, "commentDialog.loading", false);

        case COMMENT_DIALOG_CONFLICT:
            return immutable.set(state, "commentDialog.conflict", true);

        case COMMENT_DIALOG_CONFLICT_CLOSE:
            return immutable.set(state, "commentDialog.conflict", false);

        case COMMENT_VERIFY: {
            const index = state.comments.comments.findIndex(c => c.id === action.payload.commentId);
            if (index < 0) {
                return state;
            }
            return immutable.set(state, ["comments", "comments", index, "verificationStatus"], "running");
        }

        case COMMENT_VERIFY_FAILED:
        case EVENT_HOME_REMOTE_COMMENT_VERIFICATION_FAILED: {
            const {nodeName, postingId, commentId} = action.payload;

            if (nodeName !== state.comments.receiverName || postingId !== state.comments.receiverPostingId) {
                return state;
            }
            const index = state.comments.comments.findIndex(c => c.id === commentId);
            if (index < 0) {
                return state;
            }
            return immutable.set(state, ["comments", "comments", index, "verificationStatus"], "none");
        }

        case EVENT_HOME_REMOTE_COMMENT_VERIFIED: {
            const {nodeName, postingId, commentId, correct} = action.payload;

            if (nodeName !== state.comments.receiverName || postingId !== state.comments.receiverPostingId) {
                return state;
            }
            const index = state.comments.comments.findIndex(c => c.id === commentId);
            if (index < 0) {
                return state;
            }
            const status = correct ? "correct" : "incorrect";
            return immutable.set(state, ["comments", "comments", index, "verificationStatus"], status);
        }

        case COMMENT_REACT: {
            const {id, negative, emoji} = action.payload;

            const index = state.comments.comments.findIndex(c => c.id === id);
            if (index >= 0) {
                return immutable.set(state, ["comments", "comments", index, "clientReaction"],
                    {negative, emoji});
            }
            return state;
        }

        case COMMENT_REACTION_DELETE: {
            const index = state.comments.comments.findIndex(c => c.id === action.payload.id);
            if (index >= 0) {
                return immutable.del(state, ["comments", "comments", index, "clientReaction"]);
            }
            return state;
        }

        case COMMENT_REACTION_SET: {
            const {nodeName, id, postingId, reaction, totals} = action.payload;

            if (nodeName !== state.comments.receiverName || postingId !== state.comments.receiverPostingId) {
                return state;
            }
            const index = state.comments.comments.findIndex(c => c.id === id);
            if (index < 0) {
                return state;
            }
            return immutable.assign(state, ["comments", "comments", index], {
                reactions: totals,
                clientReaction: reaction
            });
        }

        case COMMENT_REPLIED_TO_SET:
            return immutable.assign(state, "compose", {
                repliedToId: action.payload.commentId,
                repliedToName: action.payload.ownerName,
                repliedToFullName: action.payload.ownerFullName,
                repliedToHeading: action.payload.heading
            });

        case COMMENT_REPLIED_TO_UNSET:
            return immutable.assign(state, "compose", {
                repliedToId: null,
                repliedToName: null,
                repliedToFullName: null,
                repliedToHeading: null
            });

        case GLANCE_COMMENT:
            return immutable.set(state, "comments.glanceCommentId", action.payload.commentId);

        case GLANCE_COMMENT_LOAD:
            return immutable.assign(state, "comments", {
                loadingGlanceComment: true,
                loadedGlanceComment: false,
                glanceComment: null
            });

        case GLANCE_COMMENT_LOADED: {
            const {nodeName, comment} = action.payload;
            if (nodeName !== state.comments.receiverName || comment.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            return immutable.assign(state, "comments", {
                loadingGlanceComment: false,
                loadedGlanceComment: true,
                glanceComment: extractComment(comment)
            });
        }

        case GLANCE_COMMENT_LOAD_FAILED: {
            const {nodeName, postingId} = action.payload;
            if (nodeName !== state.comments.receiverName || postingId !== state.comments.receiverPostingId) {
                return state;
            }
            return immutable.set(state, "comments.loadingGlanceComment", false);
        }

        default:
            return state;
    }
}
