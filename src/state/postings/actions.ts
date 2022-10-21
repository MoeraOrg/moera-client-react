import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import {
    FeedReference,
    PostingInfo,
    PostingOperations,
    PostingOperationsInfo,
    ReactionAttributes,
    ReactionTotalsInfo,
    SubscriptionType
} from "api/node/api-types";

export const POSTING_SET = "POSTING_SET";
export type PostingSetAction = ActionWithPayload<typeof POSTING_SET, {
    posting: PostingInfo;
    nodeName: string;
}>;
export const postingSet = (posting: PostingInfo, nodeName: string = ""): PostingSetAction => ({
    type: POSTING_SET,
    payload: {posting, nodeName}
});

export const POSTINGS_SET = "POSTINGS_SET";
export type PostingsSetAction = ActionWithPayload<typeof POSTINGS_SET, {
    postings: PostingInfo[];
    nodeName: string;
}>;
export const postingsSet = (postings: PostingInfo[], nodeName: string): PostingsSetAction => ({
    type: POSTINGS_SET,
    payload: {postings, nodeName}
});

export const POSTING_DELETE = "POSTING_DELETE";
export type PostingDeleteAction = ActionWithPayload<typeof POSTING_DELETE, {
    id: string;
    nodeName: string;
}>;
export const postingDelete = (id: string, nodeName: string = ""): PostingDeleteAction => ({
    type: POSTING_DELETE,
    payload: {id, nodeName}
});

export const POSTING_DELETED = "POSTING_DELETED";
export type PostingDeletedAction = ActionWithPayload<typeof POSTING_DELETED, {
    id: string;
    feedReferences: FeedReference[];
    nodeName: string;
}>;
export const postingDeleted = (id: string, feedReferences: FeedReference[],
                               nodeName: string = ""): PostingDeletedAction => ({
    type: POSTING_DELETED,
    payload: {id, feedReferences, nodeName}
});

export const POSTING_DELETE_FAILED = "POSTING_DELETE_FAILED";
export type PostingDeleteFailedAction = ActionWithPayload<typeof POSTING_DELETE_FAILED, {
    id: string;
    nodeName: string;
}>;
export const postingDeleteFailed = (id: string, nodeName: string = ""): PostingDeleteFailedAction => ({
    type: POSTING_DELETE_FAILED,
    payload: {id, nodeName}
});

export const POSTING_LOAD = "POSTING_LOAD";
export type PostingLoadAction = ActionWithPayload<typeof POSTING_LOAD, {
    id: string;
    nodeName: string;
}>;
export const postingLoad = (id: string, nodeName: string = ""): PostingLoadAction => ({
    type: POSTING_LOAD,
    payload: {id, nodeName}
});

export const POSTING_LOAD_FAILED = "POSTING_LOAD_FAILED";
export type PostingLoadFailedAction = ActionWithPayload<typeof POSTING_LOAD_FAILED, {
    id: string;
    nodeName: string;
}>;
export const postingLoadFailed = (id: string, nodeName: string = ""): PostingLoadFailedAction => ({
    type: POSTING_LOAD_FAILED,
    payload: {id, nodeName}
});

export const POSTING_VERIFY = "POSTING_VERIFY";
export type PostingVerifyAction = ActionWithPayload<typeof POSTING_VERIFY, {
    id: string;
    nodeName: string;
}>;
export const postingVerify = (id: string, nodeName: string = ""): PostingVerifyAction => ({
    type: POSTING_VERIFY,
    payload: {id, nodeName}
});

export const POSTING_VERIFY_FAILED = "POSTING_VERIFY_FAILED";
export type PostingVerifyFailedAction = ActionWithPayload<typeof POSTING_VERIFY_FAILED, {
    id: string;
    nodeName: string;
}>;
export const postingVerifyFailed = (id: string, nodeName: string = ""): PostingVerifyFailedAction => ({
    type: POSTING_VERIFY_FAILED,
    payload: {id, nodeName}
});

export const POSTING_OPERATIONS_UPDATE = "POSTING_OPERATIONS_UPDATE";
export type PostingOperationsUpdateAction = ActionWithPayload<typeof POSTING_OPERATIONS_UPDATE, {
    id: string;
    nodeName: string;
    operations: PostingOperations;
}>;
export const postingOperationsUpdate = (id: string, nodeName: string,
                                        operations: PostingOperations): PostingOperationsUpdateAction => ({
    type: POSTING_OPERATIONS_UPDATE,
    payload: {id, nodeName, operations}
});

export const POSTING_OPERATIONS_UPDATED = "POSTING_OPERATIONS_UPDATED";
export type PostingOperationsUpdatedAction = ActionWithPayload<typeof POSTING_OPERATIONS_UPDATED, {
    id: string;
    nodeName: string;
    operations: PostingOperationsInfo;
}>;
export const postingOperationsUpdated = (id: string, nodeName: string,
                                         operations: PostingOperationsInfo): PostingOperationsUpdatedAction => ({
    type: POSTING_OPERATIONS_UPDATED,
    payload: {id, nodeName, operations}
});

export const POSTING_REACT = "POSTING_REACT";
export type PostingReactAction = ActionWithPayload<typeof POSTING_REACT, {
    id: string;
    negative: boolean;
    emoji: number;
    nodeName: string;
}>;
export const postingReact = (id: string, negative: boolean, emoji: number,
                             nodeName: string = ""): PostingReactAction => ({
    type: POSTING_REACT,
    payload: {id, negative, emoji, nodeName}
});

export const POSTING_REACTION_LOAD = "POSTING_REACTION_LOAD";
export type PostingReactionLoadAction = ActionWithPayload<typeof POSTING_REACTION_LOAD, {
    id: string;
    nodeName: string;
}>;
export const postingReactionLoad = (id: string, nodeName: string = ""): PostingReactionLoadAction => ({
    type: POSTING_REACTION_LOAD,
    payload: {id, nodeName}
});

export const POSTING_REACTIONS_RELOAD = "POSTING_REACTIONS_RELOAD";
export type PostingReactionsReloadAction = Action<typeof POSTING_REACTIONS_RELOAD>;
export const postingReactionsReload = (): PostingReactionsReloadAction => ({
    type: POSTING_REACTIONS_RELOAD
});

export const POSTING_REACTION_DELETE = "POSTING_REACTION_DELETE";
export type PostingReactionDeleteAction = ActionWithPayload<typeof POSTING_REACTION_DELETE, {
    id: string;
    nodeName: string;
}>;
export const postingReactionDelete = (id: string, nodeName: string = ""): PostingReactionDeleteAction => ({
    type: POSTING_REACTION_DELETE,
    payload: {id, nodeName}
});

export const POSTING_REACTION_SET = "POSTING_REACTION_SET";
export type PostingReactionSetAction = ActionWithPayload<typeof POSTING_REACTION_SET, {
    id: string;
    reaction: ReactionAttributes | null;
    totals: ReactionTotalsInfo;
    nodeName: string;
}>;
export const postingReactionSet = (id: string, reaction: ReactionAttributes | null,
                                   totals: ReactionTotalsInfo, nodeName: string = ""): PostingReactionSetAction => ({
    type: POSTING_REACTION_SET,
    payload: {id, reaction, totals, nodeName}
});

export type EntryReactionAttributes = ReactionAttributes & {
    entryId: string
};
export const POSTINGS_REACTION_SET = "POSTINGS_REACTION_SET";
export type PostingsReactionSetAction = ActionWithPayload<typeof POSTINGS_REACTION_SET, {
    reactions: EntryReactionAttributes[];
    totals: ReactionTotalsInfo[];
    nodeName: string;
}>;
export const postingsReactionSet = (reactions: EntryReactionAttributes[], totals: ReactionTotalsInfo[],
                                    nodeName: string): PostingsReactionSetAction => ({
    type: POSTINGS_REACTION_SET,
    payload: {reactions, totals, nodeName}
});

export const POSTING_COPY_LINK = "POSTING_COPY_LINK";
export type PostingCopyLinkAction = ActionWithPayload<typeof POSTING_COPY_LINK, {
    id: string;
    nodeName: string;
}>;
export const postingCopyLink = (id: string, nodeName: string = ""): PostingCopyLinkAction => ({
    type: POSTING_COPY_LINK,
    payload: {id, nodeName}
});

export const POSTING_COMMENTS_SET = "POSTING_COMMENTS_SET";
export type PostingCommentsSetAction = ActionWithPayload<typeof POSTING_COMMENTS_SET, {
    id: string;
    total: number;
    nodeName: string;
}>;
export const postingCommentsSet = (id: string, total: number, nodeName: string = ""): PostingCommentsSetAction => ({
    type: POSTING_COMMENTS_SET,
    payload: {id, total, nodeName}
});

export const POSTING_COMMENT_COUNT_UPDATE = "POSTING_COMMENT_COUNT_UPDATE";
export type PostingCommentCountUpdateAction = ActionWithPayload<typeof POSTING_COMMENT_COUNT_UPDATE, {
    id: string;
    nodeName: string;
    delta: number;
}>;
export const postingCommentCountUpdate = (id: string, nodeName: string,
                                          delta: number): PostingCommentCountUpdateAction => ({
    type: POSTING_COMMENT_COUNT_UPDATE,
    payload: {id, nodeName, delta}
});

export const POSTING_COMMENTS_SUBSCRIBE = "POSTING_COMMENTS_SUBSCRIBE";
export type PostingCommentsSubscribeAction = ActionWithPayload<typeof POSTING_COMMENTS_SUBSCRIBE, {
    id: string;
    nodeName: string;
}>;
export const postingCommentsSubscribe = (id: string, nodeName: string = ""): PostingCommentsSubscribeAction => ({
    type: POSTING_COMMENTS_SUBSCRIBE,
    payload: {id, nodeName}
});

export const POSTING_COMMENTS_SUBSCRIBED = "POSTING_COMMENTS_SUBSCRIBED";
export type PostingCommentsSubscribedAction = ActionWithPayload<typeof POSTING_COMMENTS_SUBSCRIBED, {
    id: string;
    subscriberId: string;
    nodeName: string;
}>;
export const postingCommentsSubscribed = (id: string, subscriberId: string,
                                          nodeName: string = ""): PostingCommentsSubscribedAction => ({
    type: POSTING_COMMENTS_SUBSCRIBED,
    payload: {id, subscriberId, nodeName}
});

export const POSTING_COMMENTS_SUBSCRIBE_FAILED = "POSTING_COMMENTS_SUBSCRIBE_FAILED";
export type PostingCommentsSubscribeFailedAction = ActionWithPayload<typeof POSTING_COMMENTS_SUBSCRIBE_FAILED, {
    id: string;
    nodeName: string;
}>;
export const postingCommentsSubscribeFailed = (id: string,
                                               nodeName: string = ""): PostingCommentsSubscribeFailedAction => ({
    type: POSTING_COMMENTS_SUBSCRIBE_FAILED,
    payload: {id, nodeName}
});

export const POSTING_COMMENTS_UNSUBSCRIBE = "POSTING_COMMENTS_UNSUBSCRIBE";
export type PostingCommentsUnsubscribeAction = ActionWithPayload<typeof POSTING_COMMENTS_UNSUBSCRIBE, {
    id: string;
    nodeName: string;
}>;
export const postingCommentsUnsubscribe = (id: string, nodeName: string = ""): PostingCommentsUnsubscribeAction => ({
    type: POSTING_COMMENTS_UNSUBSCRIBE,
    payload: {id, nodeName}
});

export const POSTING_COMMENTS_UNSUBSCRIBED = "POSTING_COMMENTS_UNSUBSCRIBED";
export type PostingCommentsUnsubscribedAction = ActionWithPayload<typeof POSTING_COMMENTS_UNSUBSCRIBED, {
    id: string;
    nodeName: string;
}>;
export const postingCommentsUnsubscribed = (id: string, nodeName: string = ""): PostingCommentsUnsubscribedAction => ({
    type: POSTING_COMMENTS_UNSUBSCRIBED,
    payload: {id, nodeName}
});

export const POSTING_COMMENTS_UNSUBSCRIBE_FAILED = "POSTING_COMMENTS_UNSUBSCRIBE_FAILED";
export type PostingCommentsUnsubscribeFailedAction = ActionWithPayload<typeof POSTING_COMMENTS_UNSUBSCRIBE_FAILED, {
    id: string;
    nodeName: string;
}>;
export const postingCommentsUnsubscribeFailed = (id: string,
                                                 nodeName: string = ""): PostingCommentsUnsubscribeFailedAction => ({
    type: POSTING_COMMENTS_UNSUBSCRIBE_FAILED,
    payload: {id, nodeName}
});

export const POSTING_SUBSCRIPTION_SET = "POSTING_SUBSCRIPTION_SET";
export type PostingSubscriptionSetAction = ActionWithPayload<typeof POSTING_SUBSCRIPTION_SET, {
    id: string;
    type: SubscriptionType;
    subscriberId: string | null;
    nodeName: string;
}>;
export const postingSubscriptionSet = (id: string, type: SubscriptionType,
                                       subscriberId: string | null,
                                       nodeName: string = ""): PostingSubscriptionSetAction => ({
    type: POSTING_SUBSCRIPTION_SET,
    payload: {id, type, subscriberId, nodeName}
});

export const REMOTE_POSTING_SUBSCRIPTION_SET = "REMOTE_POSTING_SUBSCRIPTION_SET";
export type RemotePostingSubscriptionSetAction = ActionWithPayload<typeof REMOTE_POSTING_SUBSCRIPTION_SET, {
    remoteNodeName: string;
    remotePostingId: string;
    type: SubscriptionType;
    subscriberId: string | null;
    nodeName: string;
}>;
export const remotePostingSubscriptionSet = (remoteNodeName: string, remotePostingId: string, type: SubscriptionType,
                                             subscriberId: string | null,
                                             nodeName: string = ""): RemotePostingSubscriptionSetAction => ({
    type: REMOTE_POSTING_SUBSCRIPTION_SET,
    payload: {remoteNodeName, remotePostingId, type, subscriberId, nodeName}
});

export type PostingsAnyAction =
    PostingSetAction
    | PostingsSetAction
    | PostingDeleteAction
    | PostingDeletedAction
    | PostingDeleteFailedAction
    | PostingLoadAction
    | PostingLoadFailedAction
    | PostingVerifyAction
    | PostingVerifyFailedAction
    | PostingOperationsUpdateAction
    | PostingOperationsUpdatedAction
    | PostingReactAction
    | PostingReactionLoadAction
    | PostingReactionsReloadAction
    | PostingReactionDeleteAction
    | PostingReactionSetAction
    | PostingsReactionSetAction
    | PostingCopyLinkAction
    | PostingCommentsSetAction
    | PostingCommentCountUpdateAction
    | PostingCommentsSubscribeAction
    | PostingCommentsSubscribedAction
    | PostingCommentsSubscribeFailedAction
    | PostingCommentsUnsubscribeAction
    | PostingCommentsUnsubscribedAction
    | PostingCommentsUnsubscribeFailedAction
    | PostingSubscriptionSetAction
    | RemotePostingSubscriptionSetAction;
