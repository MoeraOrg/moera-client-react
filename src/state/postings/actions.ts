import { ActionWithPayload } from "state/action-types";
import {
    FeedReference,
    PostingInfo,
    ReactionAttributes,
    ReactionTotalsInfo,
    SubscriptionType
} from "api/node/api-types";

export const POSTING_SET = "POSTING_SET";
export type PostingSetAction = ActionWithPayload<typeof POSTING_SET, {
    posting: PostingInfo;
}>;
export const postingSet = (posting: PostingInfo): PostingSetAction => ({
    type: POSTING_SET,
    payload: {posting}
});

export const POSTING_DELETE = "POSTING_DELETE";
export type PostingDeleteAction = ActionWithPayload<typeof POSTING_DELETE, {
    id: string;
}>;
export const postingDelete = (id: string): PostingDeleteAction => ({
    type: POSTING_DELETE,
    payload: {id}
});

export const POSTING_DELETED = "POSTING_DELETED";
export type PostingDeletedAction = ActionWithPayload<typeof POSTING_DELETED, {
    id: string;
    feedReferences: FeedReference[];
}>;
export const postingDeleted = (id: string, feedReferences: FeedReference[]): PostingDeletedAction => ({
    type: POSTING_DELETED,
    payload: {id, feedReferences}
});

export const POSTING_DELETE_FAILED = "POSTING_DELETE_FAILED";
export type PostingDeleteFailedAction = ActionWithPayload<typeof POSTING_DELETE_FAILED, {
    id: string;
}>;
export const postingDeleteFailed = (id: string): PostingDeleteFailedAction => ({
    type: POSTING_DELETE_FAILED,
    payload: {id}
});

export const POSTING_LOAD = "POSTING_LOAD";
export type PostingLoadAction = ActionWithPayload<typeof POSTING_LOAD, {
    id: string;
}>;
export const postingLoad = (id: string): PostingLoadAction => ({
    type: POSTING_LOAD,
    payload: {id}
});

export const POSTING_LOAD_FAILED = "POSTING_LOAD_FAILED";
export type PostingLoadFailedAction = ActionWithPayload<typeof POSTING_LOAD_FAILED, {
    id: string;
}>;
export const postingLoadFailed = (id: string): PostingLoadFailedAction => ({
    type: POSTING_LOAD_FAILED,
    payload: {id}
});

export const POSTING_VERIFY = "POSTING_VERIFY";
export type PostingVerifyAction = ActionWithPayload<typeof POSTING_VERIFY, {
    id: string;
}>;
export const postingVerify = (id: string): PostingVerifyAction => ({
    type: POSTING_VERIFY,
    payload: {id}
});

export const POSTING_VERIFY_FAILED = "POSTING_VERIFY_FAILED";
export type PostingVerifyFailedAction = ActionWithPayload<typeof POSTING_VERIFY_FAILED, {
    id: string;
}>;
export const postingVerifyFailed = (id: string): PostingVerifyFailedAction => ({
    type: POSTING_VERIFY_FAILED,
    payload: {id}
});

export const POSTING_REACT = "POSTING_REACT";
export type PostingReactAction = ActionWithPayload<typeof POSTING_REACT, {
    id: string;
    negative: boolean;
    emoji: number;
}>;
export const postingReact = (id: string, negative: boolean, emoji: number): PostingReactAction => ({
    type: POSTING_REACT,
    payload: {id, negative, emoji}
});

export const POSTING_REACTION_LOAD = "POSTING_REACTION_LOAD";
export type PostingReactionLoadAction = ActionWithPayload<typeof POSTING_REACTION_LOAD, {
    id: string;
}>;
export const postingReactionLoad = (id: string): PostingReactionLoadAction => ({
    type: POSTING_REACTION_LOAD,
    payload: {id}
});

export const POSTING_REACTION_DELETE = "POSTING_REACTION_DELETE";
export type PostingReactionDeleteAction = ActionWithPayload<typeof POSTING_REACTION_DELETE, {
    id: string;
}>;
export const postingReactionDelete = (id: string): PostingReactionDeleteAction => ({
    type: POSTING_REACTION_DELETE,
    payload: {id}
});

export const POSTING_REACTION_SET = "POSTING_REACTION_SET";
export type PostingReactionSetAction = ActionWithPayload<typeof POSTING_REACTION_SET, {
    id: string;
    reaction: ReactionAttributes;
    totals: ReactionTotalsInfo;
}>;
export const postingReactionSet = (id: string, reaction: ReactionAttributes,
                                   totals: ReactionTotalsInfo): PostingReactionSetAction => ({
    type: POSTING_REACTION_SET,
    payload: {id, reaction, totals}
});

export const POSTING_COPY_LINK = "POSTING_COPY_LINK";
export type PostingCopyLinkAction = ActionWithPayload<typeof POSTING_COPY_LINK, {
    id: string;
}>;
export const postingCopyLink = (id: string): PostingCopyLinkAction => ({
    type: POSTING_COPY_LINK,
    payload: {id}
});

export const POSTING_COMMENTS_SET = "POSTING_COMMENTS_SET";
export type PostingCommentsSetAction = ActionWithPayload<typeof POSTING_COMMENTS_SET, {
    id: string;
    total: number;
}>;
export const postingCommentsSet = (id: string, total: number): PostingCommentsSetAction => ({
    type: POSTING_COMMENTS_SET,
    payload: {id, total}
});

export const POSTING_COMMENTS_SUBSCRIBE = "POSTING_COMMENTS_SUBSCRIBE";
export type PostingCommentsSubscribeAction = ActionWithPayload<typeof POSTING_COMMENTS_SUBSCRIBE, {
    id: string;
}>;
export const postingCommentsSubscribe = (id: string): PostingCommentsSubscribeAction => ({
    type: POSTING_COMMENTS_SUBSCRIBE,
    payload: {id}
});

export const POSTING_COMMENTS_SUBSCRIBED = "POSTING_COMMENTS_SUBSCRIBED";
export type PostingCommentsSubscribedAction = ActionWithPayload<typeof POSTING_COMMENTS_SUBSCRIBED, {
    id: string;
    subscriberId: string;
}>;
export const postingCommentsSubscribed = (id: string, subscriberId: string): PostingCommentsSubscribedAction => ({
    type: POSTING_COMMENTS_SUBSCRIBED,
    payload: {id, subscriberId}
});

export const POSTING_COMMENTS_SUBSCRIBE_FAILED = "POSTING_COMMENTS_SUBSCRIBE_FAILED";
export type PostingCommentsSubscribeFailedAction = ActionWithPayload<typeof POSTING_COMMENTS_SUBSCRIBE_FAILED, {
    id: string;
}>;
export const postingCommentsSubscribeFailed = (id: string): PostingCommentsSubscribeFailedAction => ({
    type: POSTING_COMMENTS_SUBSCRIBE_FAILED,
    payload: {id}
});

export const POSTING_COMMENTS_UNSUBSCRIBE = "POSTING_COMMENTS_UNSUBSCRIBE";
export type PostingCommentsUnsubscribeAction = ActionWithPayload<typeof POSTING_COMMENTS_UNSUBSCRIBE, {
    id: string;
    subscriberId: string;
}>;
export const postingCommentsUnsubscribe = (id: string, subscriberId: string): PostingCommentsUnsubscribeAction => ({
    type: POSTING_COMMENTS_UNSUBSCRIBE,
    payload: {id, subscriberId}
});

export const POSTING_COMMENTS_UNSUBSCRIBED = "POSTING_COMMENTS_UNSUBSCRIBED";
export type PostingCommentsUnsubscribedAction = ActionWithPayload<typeof POSTING_COMMENTS_UNSUBSCRIBED, {
    id: string;
}>;
export const postingCommentsUnsubscribed = (id: string): PostingCommentsUnsubscribedAction => ({
    type: POSTING_COMMENTS_UNSUBSCRIBED,
    payload: {id}
});

export const POSTING_COMMENTS_UNSUBSCRIBE_FAILED = "POSTING_COMMENTS_UNSUBSCRIBE_FAILED";
export type PostingCommentsUnsubscribeFailedAction = ActionWithPayload<typeof POSTING_COMMENTS_UNSUBSCRIBE_FAILED, {
    id: string;
}>;
export const postingCommentsUnsubscribeFailed = (id: string): PostingCommentsUnsubscribeFailedAction => ({
    type: POSTING_COMMENTS_UNSUBSCRIBE_FAILED,
    payload: {id}
});

export const POSTING_SUBSCRIPTION_SET = "POSTING_SUBSCRIPTION_SET";
export type PostingSubscriptionSetAction = ActionWithPayload<typeof POSTING_SUBSCRIPTION_SET, {
    id: string;
    type: SubscriptionType;
    subscriberId: string | null;
}>;
export const postingSubscriptionSet = (id: string, type: SubscriptionType,
                                       subscriberId: string | null): PostingSubscriptionSetAction => ({
    type: POSTING_SUBSCRIPTION_SET,
    payload: {id, type, subscriberId}
});

export const REMOTE_POSTING_SUBSCRIPTION_SET = "REMOTE_POSTING_SUBSCRIPTION_SET";
export type RemotePostingSubscriptionSetAction = ActionWithPayload<typeof REMOTE_POSTING_SUBSCRIPTION_SET, {
    remoteNodeName: string;
    remotePostingId: string;
    type: SubscriptionType;
    subscriberId: string | null;
}>;
export const remotePostingSubscriptionSet = (remoteNodeName: string, remotePostingId: string, type: SubscriptionType,
                                             subscriberId: string | null): RemotePostingSubscriptionSetAction => ({
    type: REMOTE_POSTING_SUBSCRIPTION_SET,
    payload: {remoteNodeName, remotePostingId, type, subscriberId}
});

export type PostingsAnyAction =
    PostingSetAction
    | PostingDeleteAction
    | PostingDeletedAction
    | PostingDeleteFailedAction
    | PostingLoadAction
    | PostingLoadFailedAction
    | PostingVerifyAction
    | PostingVerifyFailedAction
    | PostingReactAction
    | PostingReactionLoadAction
    | PostingReactionDeleteAction
    | PostingReactionSetAction
    | PostingCopyLinkAction
    | PostingCommentsSetAction
    | PostingCommentsSubscribeAction
    | PostingCommentsSubscribedAction
    | PostingCommentsSubscribeFailedAction
    | PostingCommentsUnsubscribeAction
    | PostingCommentsUnsubscribedAction
    | PostingCommentsUnsubscribeFailedAction
    | PostingSubscriptionSetAction
    | RemotePostingSubscriptionSetAction;
