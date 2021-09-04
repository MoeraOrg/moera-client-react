import { AvatarImage, DraftType, FeedStatus, StoryType, SubscriptionType } from "api/node/api-types";

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

export interface SubscribedEvent extends BaseEvent<"SUBSCRIBED"> {
    clientIp: string;
}

export type PingEvent = BaseEvent<"PING">;

export type ProfileUpdatedEvent = BaseEvent<"PROFILE_UPDATED">;

export type NodeSettingsChangedEvent = BaseEvent<"NODE_SETTINGS_CHANGED">;

export type ClientSettingsChangedEvent = BaseEvent<"CLIENT_SETTINGS_CHANGED">;

interface PostingEvent<T> extends BaseEvent<T> {
    id: string;
}

export type RegisteredNameOperationStatusEvent = BaseEvent<"REGISTERED_NAME_OPERATION_STATUS">;

export interface NodeNameChangedEvent extends BaseEvent<"NODE_NAME_CHANGED"> {
    name: string;
    fullName?: string | null;
    gender?: string | null;
    title?: string | null;
    avatar?: AvatarImage | null;
}

export interface FeedStatusUpdatedEvent extends BaseEvent<"FEED_STATUS_UPDATED"> {
    feedName: string;
    status: FeedStatus;
}

export interface StoriesStatusUpdatedEvent extends BaseEvent<"STORIES_STATUS_UPDATED"> {
    feedName: string;
    viewed?: boolean | null;
    read?: boolean | null;
    before: number;
}

export interface RemoteNodeFullNameChangedEvent extends BaseEvent<"REMOTE_NODE_FULL_NAME_CHANGED"> {
    name: string;
    fullName?: string | null;
}

export interface PeopleChangedEvent extends BaseEvent<"PEOPLE_CHANGED"> {
    feedSubscribersTotal: number;
    feedSubscriptionsTotal: number;
}

export interface RemoteNodeAvatarChangedEvent extends BaseEvent<"REMOTE_NODE_AVATAR_CHANGED"> {
    name: string;
    avatar?: AvatarImage | null;
}

export type PostingAddedEvent = PostingEvent<"POSTING_ADDED">;

export type PostingUpdatedEvent = PostingEvent<"POSTING_UPDATED">;

export type PostingDeletedEvent = PostingEvent<"POSTING_DELETED">;

export type PostingRestoredEvent = PostingEvent<"POSTING_RESTORED">;

export type PostingReactionsChangedEvent = PostingEvent<"POSTING_REACTIONS_CHANGED">;

export interface PostingCommentsChangedEvent extends PostingEvent<"POSTING_COMMENTS_CHANGED"> {
    total: number;
}

interface DraftEvent<T> extends BaseEvent<T> {
    id: string;
    draftType: DraftType;
    receiverName: string;
    receiverPostingId: string;
    receiverCommentId: string;
}

export type DraftAddedEvent = DraftEvent<"DRAFT_ADDED">;

export type DraftUpdatedEvent = DraftEvent<"DRAFT_UPDATED">;

export type DraftDeletedEvent = DraftEvent<"DRAFT_DELETED">;

interface RemotePostingVerificationEvent<T> extends BaseEvent<T> {
    id: string;
    nodeName: string;
    receiverName: string;
    postingId: string;
    revisionId: string;
}

export interface RemotePostingVerifiedEvent extends RemotePostingVerificationEvent<"REMOTE_POSTING_VERIFIED"> {
    correct: boolean;
}

export interface RemotePostingVerificationFailedEvent
                    extends RemotePostingVerificationEvent<"REMOTE_POSTING_VERIFICATION_FAILED"> {
    errorCode: string;
    errorMessage: string;
}

interface RemoteReactionEvent<T> extends BaseEvent<T> {
    remoteNodeName: string;
    remotePostingId: string;
}

export interface RemoteReactionAddedEvent extends RemoteReactionEvent<"REMOTE_REACTION_ADDED"> {
    negative: boolean;
    emoji: number;
    createdAt: number;
}

export type RemoteReactionDeletedEvent = RemoteReactionEvent<"REMOTE_REACTION_DELETED">;

interface RemoteReactionVerificationEvent<T> extends BaseEvent<T> {
    id: string;
    nodeName: string;
    postingId: string;
    reactionOwnerName: string;
}

export interface RemoteReactionVerifiedEvent extends RemoteReactionVerificationEvent<"REMOTE_REACTION_VERIFIED"> {
    correct: boolean;
}

export interface RemoteReactionVerificationFailedEvent
                    extends RemoteReactionVerificationEvent<"REMOTE_REACTION_VERIFICATION_FAILED"> {
    errorCode: string;
    errorMessage: string;
}

export interface StoryEvent<T> extends BaseEvent<T> {
    id: string;
    storyType: StoryType;
    feedName: string;
    publishedAt: number;
    pinned: boolean;
    moment: number;
    postingId: string;
    viewed?: boolean | null;
    read?: boolean | null;
    summaryAvatar?: AvatarImage | null,
    summary: string;
    trackingId?: string | null;
    remoteNodeName?: string | null;
    remoteFullName?: string | null;
    remotePostingId?: string | null;
    remoteCommentId?: string | null;
    operations?: {
        edit?: string[] | null;
        delete?: string[] | null;
    } | null;
}

export type StoryAddedEvent = StoryEvent<"STORY_ADDED">;

export type StoryDeletedEvent = StoryEvent<"STORY_DELETED">;

export type StoryUpdatedEvent = StoryEvent<"STORY_UPDATED">;

interface SubscriberEvent<T> extends BaseEvent<T> {
    id: string;
    subscriptionType: SubscriptionType;
    feedName?: string | null;
    postingId?: string | null;
    nodeName: string;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    createdAt: number;
}

export type SubscriberAddedEvent = SubscriberEvent<"SUBSCRIBER_ADDED">;

export type SubscriberDeletedEvent = SubscriberEvent<"SUBSCRIBER_DELETED">;

interface SubscriptionEvent<T> extends BaseEvent<T> {
    id: string;
    subscriptionType: SubscriptionType;
    feedName?: string | null;
    remoteSubscriberId: string;
    remoteNodeName: string;
    remoteFullName?: string | null;
    remoteAvatar?: AvatarImage | null;
    remoteFeedName?: string | null;
    remotePostingId?: string | null;
    createdAt: number;
}

export type SubscriptionAddedEvent = SubscriptionEvent<"SUBSCRIPTION_ADDED">;

export type SubscriptionDeletedEvent = SubscriptionEvent<"SUBSCRIPTION_DELETED">;

interface CommentEvent<T> extends BaseEvent<T> {
    id: string;
    postingId: string;
    moment: number;
}

export type CommentAddedEvent = CommentEvent<"COMMENT_ADDED">;

export type CommentUpdatedEvent = CommentEvent<"COMMENT_UPDATED">;

export type CommentDeletedEvent = CommentEvent<"COMMENT_DELETED">;

export type CommentReactionsChangedEvent = CommentEvent<"COMMENT_REACTIONS_CHANGED">;

interface RemoteCommentEvent<T> extends BaseEvent<T> {
    remoteNodeName: string;
    remotePostingId: string;
    remoteCommentId: string;
}

export type RemoteCommentAddedEvent = RemoteCommentEvent<"REMOTE_COMMENT_ADDED">;

export type RemoteCommentUpdatedEvent = RemoteCommentEvent<"REMOTE_COMMENT_UPDATED">;

export type RemoteCommentDeletedEvent = RemoteCommentEvent<"REMOTE_COMMENT_DELETED">;

interface RemoteCommentVerificationEvent<T> extends BaseEvent<T> {
    id: string;
    nodeName: string;
    postingId: string;
    commentId: string;
}

export interface RemoteCommentVerifiedEvent extends RemoteCommentVerificationEvent<"REMOTE_COMMENT_VERIFIED"> {
    correct: boolean;
}

export interface RemoteCommentVerificationFailedEvent
                    extends RemoteCommentVerificationEvent<"REMOTE_COMMENT_VERIFICATION_FAILED"> {
    errorCode: string;
    errorMessage: string;
}
