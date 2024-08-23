// This file is generated

import {
    AvatarImage,
    AvatarInfo,
    BlockedByUserInfo,
    BlockedInstantInfo,
    BlockedUserInfo,
    DraftType,
    FeedStatus,
    FriendGroupInfo,
    FriendInfo,
    FriendOfInfo,
    GrantInfo,
    SheriffComplaintGroupInfo,
    SheriffComplaintInfo,
    SheriffMark,
    StoryOperations,
    StorySummaryData,
    StoryType,
    SubscriberInfo,
    SubscriptionInfo,
    TokenInfo,
} from "api/node/api-types";

export interface EventPacket {
    queueStartedAt: number;
    ordinal: number;
    sentAt?: number | null;
    cid?: string | null;
    event: {
        type: string;
    }
}

export interface BaseEvent<T> {
    type: T;
}

export type AskSubjectsChangedEvent = BaseEvent<"ASK_SUBJECTS_CHANGED">;

export interface AvatarAddedEvent extends BaseEvent<"AVATAR_ADDED"> {
    avatar: AvatarInfo;
}

export interface AvatarDeletedEvent extends BaseEvent<"AVATAR_DELETED"> {
    id: string;
    mediaId: string;
}

export interface AvatarOrderedEvent extends BaseEvent<"AVATAR_ORDERED"> {
    id: string;
    mediaId: string;
    ordinal: number;
}

export interface BlockedByUserAddedEvent extends BaseEvent<"BLOCKED_BY_USER_ADDED"> {
    blockedByUser: BlockedByUserInfo;
}

export interface BlockedByUserDeletedEvent extends BaseEvent<"BLOCKED_BY_USER_DELETED"> {
    blockedByUser: BlockedByUserInfo;
}

export interface BlockedInstantAddedEvent extends BaseEvent<"BLOCKED_INSTANT_ADDED"> {
    blockedInstant: BlockedInstantInfo;
}

export interface BlockedInstantDeletedEvent extends BaseEvent<"BLOCKED_INSTANT_DELETED"> {
    blockedInstant: BlockedInstantInfo;
}

export interface BlockedUserAddedEvent extends BaseEvent<"BLOCKED_USER_ADDED"> {
    blockedUser: BlockedUserInfo;
}

export interface BlockedUserDeletedEvent extends BaseEvent<"BLOCKED_USER_DELETED"> {
    blockedUser: BlockedUserInfo;
}

export type ClientSettingsChangedEvent = BaseEvent<"CLIENT_SETTINGS_CHANGED">;

export interface CommentAddedEvent extends BaseEvent<"COMMENT_ADDED"> {
    id: string;
    postingId: string;
    moment: number;
}

export interface CommentDeletedEvent extends BaseEvent<"COMMENT_DELETED"> {
    id: string;
    postingId: string;
    moment: number;
}

export interface CommentReactionsChangedEvent extends BaseEvent<"COMMENT_REACTIONS_CHANGED"> {
    id: string;
    postingId: string;
    moment: number;
}

export interface CommentUpdatedEvent extends BaseEvent<"COMMENT_UPDATED"> {
    id: string;
    postingId: string;
    moment: number;
}

export interface DeleteNodeStatusUpdatedEvent extends BaseEvent<"DELETE_NODE_STATUS_UPDATED"> {
    requested: boolean;
}

export interface DraftAddedEvent extends BaseEvent<"DRAFT_ADDED"> {
    id: string;
    draftType: DraftType;
    receiverName: string;
    receiverPostingId: string;
    receiverCommentId: string;
}

export interface DraftDeletedEvent extends BaseEvent<"DRAFT_DELETED"> {
    id: string;
    draftType: DraftType;
    receiverName: string;
    receiverPostingId: string;
    receiverCommentId: string;
}

export interface DraftUpdatedEvent extends BaseEvent<"DRAFT_UPDATED"> {
    id: string;
    draftType: DraftType;
    receiverName: string;
    receiverPostingId: string;
    receiverCommentId: string;
}

export interface FeedSheriffDataUpdatedEvent extends BaseEvent<"FEED_SHERIFF_DATA_UPDATED"> {
    feedName: string;
    sheriffs?: string[] | null;
    sheriffMarks?: SheriffMark[] | null;
}

export interface FeedStatusUpdatedEvent extends BaseEvent<"FEED_STATUS_UPDATED"> {
    feedName: string;
    status: FeedStatus;
}

export interface FriendGroupAddedEvent extends BaseEvent<"FRIEND_GROUP_ADDED"> {
    friendGroup: FriendGroupInfo;
}

export interface FriendGroupDeletedEvent extends BaseEvent<"FRIEND_GROUP_DELETED"> {
    friendGroupId: string;
}

export interface FriendGroupUpdatedEvent extends BaseEvent<"FRIEND_GROUP_UPDATED"> {
    friendGroup: FriendGroupInfo;
}

export interface FriendshipUpdatedEvent extends BaseEvent<"FRIENDSHIP_UPDATED"> {
    friend: FriendInfo;
}

export interface GrantUpdatedEvent extends BaseEvent<"GRANT_UPDATED"> {
    grant: GrantInfo;
}

export interface NodeNameChangedEvent extends BaseEvent<"NODE_NAME_CHANGED"> {
    name: string;
    fullName?: string | null;
    gender?: string | null;
    title?: string | null;
    avatar?: AvatarImage | null;
}

export type NodeSettingsChangedEvent = BaseEvent<"NODE_SETTINGS_CHANGED">;

export type NodeSettingsMetaChangedEvent = BaseEvent<"NODE_SETTINGS_META_CHANGED">;

export type PingEvent = BaseEvent<"PING">;

export type PluginsUpdatedEvent = BaseEvent<"PLUGINS_UPDATED">;

export interface PostingAddedEvent extends BaseEvent<"POSTING_ADDED"> {
    id: string;
}

export interface PostingCommentsChangedEvent extends BaseEvent<"POSTING_COMMENTS_CHANGED"> {
    id: string;
    total: number;
}

export interface PostingDeletedEvent extends BaseEvent<"POSTING_DELETED"> {
    id: string;
}

export interface PostingReactionsChangedEvent extends BaseEvent<"POSTING_REACTIONS_CHANGED"> {
    id: string;
}

export interface PostingRestoredEvent extends BaseEvent<"POSTING_RESTORED"> {
    id: string;
}

export interface PostingUpdatedEvent extends BaseEvent<"POSTING_UPDATED"> {
    id: string;
}

export type ProfileUpdatedEvent = BaseEvent<"PROFILE_UPDATED">;

export type RegisteredNameOperationStatusEvent = BaseEvent<"REGISTERED_NAME_OPERATION_STATUS">;

export interface RemoteCommentAddedEvent extends BaseEvent<"REMOTE_COMMENT_ADDED"> {
    remoteNodeName: string;
    remotePostingId: string;
    remoteCommentId: string;
}

export interface RemoteCommentDeletedEvent extends BaseEvent<"REMOTE_COMMENT_DELETED"> {
    remoteNodeName: string;
    remotePostingId: string;
    remoteCommentId: string;
}

export interface RemoteCommentUpdatedEvent extends BaseEvent<"REMOTE_COMMENT_UPDATED"> {
    remoteNodeName: string;
    remotePostingId: string;
    remoteCommentId: string;
}

export interface RemoteCommentVerificationFailedEvent extends BaseEvent<"REMOTE_COMMENT_VERIFICATION_FAILED"> {
    id: string;
    nodeName: string;
    postingId: string;
    commentId: string;
    errorCode: string;
    errorMessage: string;
}

export interface RemoteCommentVerifiedEvent extends BaseEvent<"REMOTE_COMMENT_VERIFIED"> {
    id: string;
    nodeName: string;
    postingId: string;
    commentId: string;
    correct: boolean;
}

export interface RemoteFriendshipUpdatedEvent extends BaseEvent<"REMOTE_FRIENDSHIP_UPDATED"> {
    friendOf: FriendOfInfo;
}

export interface RemoteNodeAvatarChangedEvent extends BaseEvent<"REMOTE_NODE_AVATAR_CHANGED"> {
    name: string;
    avatar?: AvatarImage | null;
}

export interface RemoteNodeFullNameChangedEvent extends BaseEvent<"REMOTE_NODE_FULL_NAME_CHANGED"> {
    name: string;
    fullName?: string | null;
}

export interface RemotePostingAddedEvent extends BaseEvent<"REMOTE_POSTING_ADDED"> {
    remoteNodeName: string;
    remotePostingId: string;
}

export interface RemotePostingDeletedEvent extends BaseEvent<"REMOTE_POSTING_DELETED"> {
    remoteNodeName: string;
    remotePostingId: string;
}

export interface RemotePostingUpdatedEvent extends BaseEvent<"REMOTE_POSTING_UPDATED"> {
    remoteNodeName: string;
    remotePostingId: string;
}

export interface RemotePostingVerificationFailedEvent extends BaseEvent<"REMOTE_POSTING_VERIFICATION_FAILED"> {
    id: string;
    nodeName: string;
    receiverName: string;
    postingId: string;
    revisionId: string;
    errorCode: string;
    errorMessage: string;
}

export interface RemotePostingVerifiedEvent extends BaseEvent<"REMOTE_POSTING_VERIFIED"> {
    id: string;
    nodeName: string;
    receiverName: string;
    postingId: string;
    revisionId: string;
    correct: boolean;
}

export interface RemoteReactionAddedEvent extends BaseEvent<"REMOTE_REACTION_ADDED"> {
    remoteNodeName: string;
    remotePostingId: string;
    negative: boolean;
    emoji: number;
    createdAt: number;
}

export interface RemoteReactionDeletedEvent extends BaseEvent<"REMOTE_REACTION_DELETED"> {
    remoteNodeName: string;
    remotePostingId: string;
}

export interface RemoteReactionVerificationFailedEvent extends BaseEvent<"REMOTE_REACTION_VERIFICATION_FAILED"> {
    id: string;
    nodeName: string;
    postingId: string;
    commentId: string;
    reactionOwnerName: string;
    errorCode: string;
    errorMessage: string;
}

export interface RemoteReactionVerifiedEvent extends BaseEvent<"REMOTE_REACTION_VERIFIED"> {
    id: string;
    nodeName: string;
    postingId: string;
    commentId: string;
    reactionOwnerName: string;
    correct: boolean;
}

export interface SheriffComplaintAddedEvent extends BaseEvent<"SHERIFF_COMPLAINT_ADDED"> {
    complaint: SheriffComplaintInfo;
    groupId: string;
}

export interface SheriffComplaintGroupAddedEvent extends BaseEvent<"SHERIFF_COMPLAINT_GROUP_ADDED"> {
    group: SheriffComplaintGroupInfo;
}

export interface SheriffComplaintGroupUpdatedEvent extends BaseEvent<"SHERIFF_COMPLAINT_GROUP_UPDATED"> {
    group: SheriffComplaintGroupInfo;
}

export interface StoriesStatusUpdatedEvent extends BaseEvent<"STORIES_STATUS_UPDATED"> {
    feedName: string;
    viewed?: boolean | null;
    read?: boolean | null;
    before: number;
}

export interface StoryAddedEvent extends BaseEvent<"STORY_ADDED"> {
    id: string;
    storyType: StoryType;
    feedName: string;
    publishedAt: number;
    pinned: boolean;
    moment: number;
    postingId?: string | null;
    viewed?: boolean | null;
    read?: boolean | null;
    satisfied?: boolean | null;
    summaryNodeName?: string | null;
    summaryFullName?: string | null;
    summaryAvatar?: AvatarImage | null;
    summary?: string | null;
    summaryData?: StorySummaryData | null;
    remoteNodeName?: string | null;
    remoteFullName?: string | null;
    remotePostingId?: string | null;
    remoteCommentId?: string | null;
    operations?: StoryOperations | null;
}

export interface StoryDeletedEvent extends BaseEvent<"STORY_DELETED"> {
    id: string;
    storyType: StoryType;
    feedName: string;
    moment: number;
    postingId?: string | null;
}

export interface StoryUpdatedEvent extends BaseEvent<"STORY_UPDATED"> {
    id: string;
    storyType: StoryType;
    feedName: string;
    publishedAt: number;
    pinned: boolean;
    moment: number;
    postingId?: string | null;
    viewed?: boolean | null;
    read?: boolean | null;
    satisfied?: boolean | null;
    summaryNodeName?: string | null;
    summaryFullName?: string | null;
    summaryAvatar?: AvatarImage | null;
    summary?: string | null;
    summaryData?: StorySummaryData | null;
    remoteNodeName?: string | null;
    remoteFullName?: string | null;
    remotePostingId?: string | null;
    remoteCommentId?: string | null;
    operations?: StoryOperations | null;
}

export interface SubscribedEvent extends BaseEvent<"SUBSCRIBED"> {
    sessionId: string;
}

export interface SubscriberAddedEvent extends BaseEvent<"SUBSCRIBER_ADDED"> {
    subscriber: SubscriberInfo;
}

export interface SubscriberDeletedEvent extends BaseEvent<"SUBSCRIBER_DELETED"> {
    subscriber: SubscriberInfo;
}

export interface SubscriberUpdatedEvent extends BaseEvent<"SUBSCRIBER_UPDATED"> {
    subscriber: SubscriberInfo;
}

export interface SubscribersTotalChangedEvent extends BaseEvent<"SUBSCRIBERS_TOTAL_CHANGED"> {
    feedSubscribersTotal: number;
}

export interface SubscriptionAddedEvent extends BaseEvent<"SUBSCRIPTION_ADDED"> {
    subscription: SubscriptionInfo;
}

export interface SubscriptionDeletedEvent extends BaseEvent<"SUBSCRIPTION_DELETED"> {
    subscription: SubscriptionInfo;
}

export interface SubscriptionUpdatedEvent extends BaseEvent<"SUBSCRIPTION_UPDATED"> {
    subscription: SubscriptionInfo;
}

export interface SubscriptionsTotalChangedEvent extends BaseEvent<"SUBSCRIPTIONS_TOTAL_CHANGED"> {
    feedSubscriptionsTotal: number;
}

export interface TokenAddedEvent extends BaseEvent<"TOKEN_ADDED"> {
    token: TokenInfo;
}

export interface TokenDeletedEvent extends BaseEvent<"TOKEN_DELETED"> {
    id: string;
}

export interface TokenUpdatedEvent extends BaseEvent<"TOKEN_UPDATED"> {
    token: TokenInfo;
}
