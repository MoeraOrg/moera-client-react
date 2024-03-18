import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import {
    FeedReference,
    PostingInfo,
    PostingOperations,
    ReactionAttributes,
    ReactionTotalsInfo,
    SubscriptionType
} from "api";
import { RelNodeName } from "util/rel-node-name";

export type PostingSetAction = ActionWithPayload<"POSTING_SET", {
    posting: PostingInfo;
    nodeName: RelNodeName | string;
}>;
export const postingSet = (posting: PostingInfo, nodeName: RelNodeName | string): PostingSetAction =>
    actionWithPayload("POSTING_SET", {posting, nodeName});

export type PostingsSetAction = ActionWithPayload<"POSTINGS_SET", {
    postings: PostingInfo[];
    nodeName: RelNodeName | string;
}>;
export const postingsSet = (postings: PostingInfo[], nodeName: RelNodeName | string): PostingsSetAction =>
    actionWithPayload("POSTINGS_SET", {postings, nodeName});

export type PostingDeleteAction = ActionWithPayload<"POSTING_DELETE", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingDelete = (id: string, nodeName: RelNodeName | string): PostingDeleteAction =>
    actionWithPayload("POSTING_DELETE", {id, nodeName});

export type PostingDeletedAction = ActionWithPayload<"POSTING_DELETED", {
    id: string;
    feedReferences: FeedReference[];
    nodeName: RelNodeName | string;
}>;
export const postingDeleted = (
    id: string, feedReferences: FeedReference[], nodeName: RelNodeName | string
): PostingDeletedAction =>
    actionWithPayload("POSTING_DELETED", {id, feedReferences, nodeName});

export type PostingDeleteFailedAction = ActionWithPayload<"POSTING_DELETE_FAILED", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingDeleteFailed = (id: string, nodeName: RelNodeName | string): PostingDeleteFailedAction =>
    actionWithPayload("POSTING_DELETE_FAILED", {id, nodeName});

export type PostingLoadAction = ActionWithPayload<"POSTING_LOAD", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingLoad = (id: string, nodeName: RelNodeName | string): PostingLoadAction =>
    actionWithPayload("POSTING_LOAD", {id, nodeName});

export type PostingLoadFailedAction = ActionWithPayload<"POSTING_LOAD_FAILED", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingLoadFailed = (id: string, nodeName: RelNodeName | string): PostingLoadFailedAction =>
    actionWithPayload("POSTING_LOAD_FAILED", {id, nodeName});

export type PostingVerifyAction = ActionWithPayload<"POSTING_VERIFY", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingVerify = (id: string, nodeName: RelNodeName | string): PostingVerifyAction =>
    actionWithPayload("POSTING_VERIFY", {id, nodeName});

export type PostingVerifyFailedAction = ActionWithPayload<"POSTING_VERIFY_FAILED", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingVerifyFailed = (id: string, nodeName: RelNodeName | string): PostingVerifyFailedAction =>
    actionWithPayload("POSTING_VERIFY_FAILED", {id, nodeName});

export type PostingOperationsUpdateAction = ActionWithPayload<"POSTING_OPERATIONS_UPDATE", {
    id: string;
    nodeName: RelNodeName | string;
    operations: PostingOperations;
}>;
export const postingOperationsUpdate = (
    id: string, nodeName: RelNodeName | string, operations: PostingOperations
): PostingOperationsUpdateAction =>
    actionWithPayload("POSTING_OPERATIONS_UPDATE", {id, nodeName, operations});

export type PostingOperationsUpdatedAction = ActionWithPayload<"POSTING_OPERATIONS_UPDATED", {
    id: string;
    nodeName: RelNodeName | string;
    operations: PostingOperations;
}>;
export const postingOperationsUpdated = (
    id: string, nodeName: RelNodeName | string, operations: PostingOperations
): PostingOperationsUpdatedAction =>
    actionWithPayload("POSTING_OPERATIONS_UPDATED", {id, nodeName, operations});

export type PostingReactAction = ActionWithPayload<"POSTING_REACT", {
    id: string;
    negative: boolean;
    emoji: number;
    nodeName: RelNodeName | string;
}>;
export const postingReact = (
    id: string, negative: boolean, emoji: number, nodeName: RelNodeName | string
): PostingReactAction =>
    actionWithPayload("POSTING_REACT", {id, negative, emoji, nodeName});

export type PostingReactionLoadAction = ActionWithPayload<"POSTING_REACTION_LOAD", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingReactionLoad = (id: string, nodeName: RelNodeName | string): PostingReactionLoadAction =>
    actionWithPayload("POSTING_REACTION_LOAD", {id, nodeName});

export type PostingReactionsReloadAction = ActionWithoutPayload<"POSTING_REACTIONS_RELOAD">;
export const postingReactionsReload = (): PostingReactionsReloadAction =>
    actionWithoutPayload("POSTING_REACTIONS_RELOAD");

export type PostingReactionDeleteAction = ActionWithPayload<"POSTING_REACTION_DELETE", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingReactionDelete = (id: string, nodeName: RelNodeName | string): PostingReactionDeleteAction =>
    actionWithPayload("POSTING_REACTION_DELETE", {id, nodeName});

export type PostingReactionSetAction = ActionWithPayload<"POSTING_REACTION_SET", {
    id: string;
    reaction: ReactionAttributes | null;
    totals: ReactionTotalsInfo;
    nodeName: RelNodeName | string;
}>;
export const postingReactionSet = (
    id: string, reaction: ReactionAttributes | null, totals: ReactionTotalsInfo, nodeName: RelNodeName | string
): PostingReactionSetAction =>
    actionWithPayload("POSTING_REACTION_SET", {id, reaction, totals, nodeName});

export type EntryReactionAttributes = ReactionAttributes & {
    entryId: string
};
export type PostingsReactionSetAction = ActionWithPayload<"POSTINGS_REACTION_SET", {
    reactions: EntryReactionAttributes[];
    totals: ReactionTotalsInfo[];
    nodeName: string;
}>;
export const postingsReactionSet = (
    reactions: EntryReactionAttributes[], totals: ReactionTotalsInfo[], nodeName: string
): PostingsReactionSetAction =>
    actionWithPayload("POSTINGS_REACTION_SET", {reactions, totals, nodeName});

export type PostingCopyLinkAction = ActionWithPayload<"POSTING_COPY_LINK", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingCopyLink = (id: string, nodeName: RelNodeName | string): PostingCopyLinkAction =>
    actionWithPayload("POSTING_COPY_LINK", {id, nodeName});

export type PostingCommentsSetAction = ActionWithPayload<"POSTING_COMMENTS_SET", {
    id: string;
    total: number;
    nodeName: RelNodeName | string;
}>;
export const postingCommentsSet = (
    id: string, total: number, nodeName: RelNodeName | string
): PostingCommentsSetAction =>
    actionWithPayload("POSTING_COMMENTS_SET", {id, total, nodeName});

export type PostingCommentCountUpdateAction = ActionWithPayload<"POSTING_COMMENT_COUNT_UPDATE", {
    id: string;
    nodeName: string;
    delta: number;
}>;
export const postingCommentCountUpdate = (
    id: string, nodeName: string, delta: number
): PostingCommentCountUpdateAction =>
    actionWithPayload("POSTING_COMMENT_COUNT_UPDATE", {id, nodeName, delta});

export type PostingCommentsSubscribeAction = ActionWithPayload<"POSTING_COMMENTS_SUBSCRIBE", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingCommentsSubscribe = (id: string, nodeName: RelNodeName | string): PostingCommentsSubscribeAction =>
    actionWithPayload("POSTING_COMMENTS_SUBSCRIBE", {id, nodeName});

export type PostingCommentsSubscribedAction = ActionWithPayload<"POSTING_COMMENTS_SUBSCRIBED", {
    id: string;
    subscriptionId: string;
    nodeName: RelNodeName | string;
}>;
export const postingCommentsSubscribed = (
    id: string, subscriptionId: string, nodeName: RelNodeName | string
): PostingCommentsSubscribedAction =>
    actionWithPayload("POSTING_COMMENTS_SUBSCRIBED", {id, subscriptionId, nodeName});

export type PostingCommentsSubscribeFailedAction = ActionWithPayload<"POSTING_COMMENTS_SUBSCRIBE_FAILED", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingCommentsSubscribeFailed = (
    id: string, nodeName: RelNodeName | string
): PostingCommentsSubscribeFailedAction =>
    actionWithPayload("POSTING_COMMENTS_SUBSCRIBE_FAILED", {id, nodeName});

export type PostingCommentsUnsubscribeAction = ActionWithPayload<"POSTING_COMMENTS_UNSUBSCRIBE", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingCommentsUnsubscribe = (
    id: string, nodeName: RelNodeName | string
): PostingCommentsUnsubscribeAction =>
    actionWithPayload("POSTING_COMMENTS_UNSUBSCRIBE", {id, nodeName});

export type PostingCommentsUnsubscribedAction = ActionWithPayload<"POSTING_COMMENTS_UNSUBSCRIBED", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingCommentsUnsubscribed = (
    id: string, nodeName: RelNodeName | string
): PostingCommentsUnsubscribedAction =>
    actionWithPayload("POSTING_COMMENTS_UNSUBSCRIBED", {id, nodeName});

export type PostingCommentsUnsubscribeFailedAction = ActionWithPayload<"POSTING_COMMENTS_UNSUBSCRIBE_FAILED", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingCommentsUnsubscribeFailed = (
    id: string, nodeName: RelNodeName | string
): PostingCommentsUnsubscribeFailedAction =>
    actionWithPayload("POSTING_COMMENTS_UNSUBSCRIBE_FAILED", {id, nodeName});

export type PostingSubscriptionSetAction = ActionWithPayload<"POSTING_SUBSCRIPTION_SET", {
    id: string;
    type: SubscriptionType;
    subscriptionId: string | null;
    nodeName: RelNodeName | string;
}>;
export const postingSubscriptionSet = (
    id: string, type: SubscriptionType, subscriptionId: string | null, nodeName: RelNodeName | string
): PostingSubscriptionSetAction =>
    actionWithPayload("POSTING_SUBSCRIPTION_SET", {id, type, subscriptionId, nodeName});

export type RemotePostingSubscriptionSetAction = ActionWithPayload<"REMOTE_POSTING_SUBSCRIPTION_SET", {
    remoteNodeName: string;
    remotePostingId: string;
    type: SubscriptionType;
    subscriptionId: string | null;
    nodeName: RelNodeName | string;
}>;
export const remotePostingSubscriptionSet = (
    remoteNodeName: string, remotePostingId: string, type: SubscriptionType, subscriptionId: string | null,
    nodeName: RelNodeName | string
): RemotePostingSubscriptionSetAction =>
    actionWithPayload(
        "REMOTE_POSTING_SUBSCRIPTION_SET",
        {remoteNodeName, remotePostingId, type, subscriptionId, nodeName}
    );

export type PostingCommentAddedBlockAction = ActionWithPayload<"POSTING_COMMENT_ADDED_BLOCK", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingCommentAddedBlock = (id: string, nodeName: RelNodeName | string): PostingCommentAddedBlockAction =>
    actionWithPayload("POSTING_COMMENT_ADDED_BLOCK", {id, nodeName});

export type PostingCommentAddedBlockedAction = ActionWithPayload<"POSTING_COMMENT_ADDED_BLOCKED", {
    id: string;
    blockedInstantId: string;
    nodeName: RelNodeName | string;
}>;
export const postingCommentAddedBlocked = (
    id: string, blockedInstantId: string, nodeName: RelNodeName | string
): PostingCommentAddedBlockedAction =>
    actionWithPayload("POSTING_COMMENT_ADDED_BLOCKED", {id, blockedInstantId, nodeName});

export type PostingCommentAddedBlockFailedAction = ActionWithPayload<"POSTING_COMMENT_ADDED_BLOCK_FAILED", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingCommentAddedBlockFailed = (
    id: string, nodeName: RelNodeName | string
): PostingCommentAddedBlockFailedAction =>
    actionWithPayload("POSTING_COMMENT_ADDED_BLOCK_FAILED", {id, nodeName});

export type PostingCommentAddedUnblockAction = ActionWithPayload<"POSTING_COMMENT_ADDED_UNBLOCK", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingCommentAddedUnblock = (
    id: string, nodeName: RelNodeName | string
): PostingCommentAddedUnblockAction =>
    actionWithPayload("POSTING_COMMENT_ADDED_UNBLOCK", {id, nodeName});

export type PostingCommentAddedUnblockedAction = ActionWithPayload<"POSTING_COMMENT_ADDED_UNBLOCKED", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingCommentAddedUnblocked = (
    id: string, nodeName: RelNodeName | string
): PostingCommentAddedUnblockedAction =>
    actionWithPayload("POSTING_COMMENT_ADDED_UNBLOCKED", {id, nodeName});

export type PostingCommentAddedUnblockFailedAction = ActionWithPayload<"POSTING_COMMENT_ADDED_UNBLOCK_FAILED", {
    id: string;
    nodeName: RelNodeName | string;
}>;
export const postingCommentAddedUnblockFailed = (
    id: string, nodeName: RelNodeName | string
): PostingCommentAddedUnblockFailedAction =>
    actionWithPayload("POSTING_COMMENT_ADDED_UNBLOCK_FAILED", {id, nodeName});

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
    | RemotePostingSubscriptionSetAction
    | PostingCommentAddedBlockAction
    | PostingCommentAddedBlockedAction
    | PostingCommentAddedBlockFailedAction
    | PostingCommentAddedUnblockAction
    | PostingCommentAddedUnblockedAction
    | PostingCommentAddedUnblockFailedAction;
