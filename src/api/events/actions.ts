import * as immutable from 'object-path-immutable';
import {
    AskSubjectsChangedEvent,
    AvatarAddedEvent,
    AvatarDeletedEvent,
    AvatarOrderedEvent,
    BaseEvent,
    ClientSettingsChangedEvent,
    CommentAddedEvent,
    CommentDeletedEvent,
    CommentReactionsChangedEvent,
    CommentUpdatedEvent,
    DraftAddedEvent,
    DraftDeletedEvent,
    DraftUpdatedEvent,
    FeedStatusUpdatedEvent,
    FriendGroupAddedEvent,
    FriendGroupDeletedEvent,
    FriendGroupUpdatedEvent,
    FriendshipUpdatedEvent,
    NodeNameChangedEvent,
    NodeSettingsChangedEvent,
    NodeSettingsMetaChangedEvent,
    PingEvent,
    PluginsUpdatedEvent,
    PostingAddedEvent,
    PostingCommentsChangedEvent,
    PostingDeletedEvent,
    PostingReactionsChangedEvent,
    PostingRestoredEvent,
    PostingUpdatedEvent,
    ProfileUpdatedEvent,
    RegisteredNameOperationStatusEvent,
    RemoteCommentAddedEvent,
    RemoteCommentDeletedEvent,
    RemoteCommentUpdatedEvent,
    RemoteCommentVerificationFailedEvent,
    RemoteCommentVerifiedEvent,
    RemoteFriendshipUpdatedEvent,
    RemoteNodeAvatarChangedEvent,
    RemoteNodeFullNameChangedEvent,
    RemotePostingVerificationFailedEvent,
    RemotePostingVerifiedEvent,
    RemoteReactionAddedEvent,
    RemoteReactionDeletedEvent,
    RemoteReactionVerificationFailedEvent,
    RemoteReactionVerifiedEvent,
    StoriesStatusUpdatedEvent,
    StoryAddedEvent,
    StoryDeletedEvent,
    StoryUpdatedEvent,
    SubscriberAddedEvent,
    SubscriberDeletedEvent,
    SubscribersTotalChangedEvent,
    SubscriberUpdatedEvent,
    SubscriptionAddedEvent,
    SubscriptionDeletedEvent,
    SubscriptionsTotalChangedEvent,
    SubscriptionUpdatedEvent,
    TokenAddedEvent,
    TokenDeletedEvent,
    TokenUpdatedEvent
} from "api/events/api-types";
import { ActionWithPayload } from "state/action-types";

export const EVENT_NODE_PROFILE_UPDATED = "EVENT_NODE_PROFILE_UPDATED";
export const EVENT_HOME_PROFILE_UPDATED = "EVENT_HOME_PROFILE_UPDATED";
export const EVENT_HOME_NODE_SETTINGS_META_CHANGED = "EVENT_HOME_NODE_SETTINGS_META_CHANGED";
export const EVENT_NODE_NODE_SETTINGS_CHANGED = "EVENT_NODE_NODE_SETTINGS_CHANGED";
export const EVENT_HOME_NODE_SETTINGS_CHANGED = "EVENT_HOME_NODE_SETTINGS_CHANGED";
export const EVENT_HOME_CLIENT_SETTINGS_CHANGED = "EVENT_HOME_CLIENT_SETTINGS_CHANGED";
export const EVENT_NODE_POSTING_UPDATED = "EVENT_NODE_POSTING_UPDATED";
export const EVENT_NODE_POSTING_RESTORED = "EVENT_NODE_POSTING_RESTORED";
export const EVENT_NODE_NODE_NAME_CHANGED = "EVENT_NODE_NODE_NAME_CHANGED";
export const EVENT_HOME_NODE_NAME_CHANGED = "EVENT_HOME_NODE_NAME_CHANGED";
export const EVENT_NODE_REGISTERED_NAME_OPERATION_STATUS = "EVENT_NODE_REGISTERED_NAME_OPERATION_STATUS";
export const EVENT_HOME_REMOTE_POSTING_VERIFIED = "EVENT_HOME_REMOTE_POSTING_VERIFIED";
export const EVENT_HOME_REMOTE_POSTING_VERIFICATION_FAILED = "EVENT_HOME_REMOTE_POSTING_VERIFICATION_FAILED";
export const EVENT_NODE_POSTING_REACTIONS_CHANGED = "EVENT_NODE_POSTING_REACTIONS_CHANGED";
export const EVENT_NODE_POSTING_COMMENTS_CHANGED = "EVENT_NODE_POSTING_COMMENTS_CHANGED";
export const EVENT_HOME_REMOTE_REACTION_ADDED = "EVENT_HOME_REMOTE_REACTION_ADDED";
export const EVENT_HOME_REMOTE_REACTION_DELETED = "EVENT_HOME_REMOTE_REACTION_DELETED";
export const EVENT_HOME_REMOTE_REACTION_VERIFIED = "EVENT_HOME_REMOTE_REACTION_VERIFIED";
export const EVENT_HOME_REMOTE_REACTION_VERIFICATION_FAILED = "EVENT_HOME_REMOTE_REACTION_VERIFICATION_FAILED";
export const EVENT_HOME_DRAFT_ADDED = "EVENT_HOME_DRAFT_ADDED";
export const EVENT_HOME_DRAFT_UPDATED = "EVENT_HOME_DRAFT_UPDATED";
export const EVENT_HOME_DRAFT_DELETED = "EVENT_HOME_DRAFT_DELETED";
export const EVENT_NODE_STORY_ADDED = "EVENT_NODE_STORY_ADDED";
export const EVENT_HOME_STORY_ADDED = "EVENT_HOME_STORY_ADDED";
export const EVENT_NODE_STORY_DELETED = "EVENT_NODE_STORY_DELETED";
export const EVENT_HOME_STORY_DELETED = "EVENT_HOME_STORY_DELETED";
export const EVENT_NODE_STORY_UPDATED = "EVENT_NODE_STORY_UPDATED";
export const EVENT_HOME_STORY_UPDATED = "EVENT_HOME_STORY_UPDATED";
export const EVENT_NODE_FEED_STATUS_UPDATED = "EVENT_NODE_FEED_STATUS_UPDATED";
export const EVENT_HOME_FEED_STATUS_UPDATED = "EVENT_HOME_FEED_STATUS_UPDATED";
export const EVENT_NODE_STORIES_STATUS_UPDATED = "EVENT_NODE_STORIES_STATUS_UPDATED";
export const EVENT_HOME_STORIES_STATUS_UPDATED = "EVENT_HOME_STORIES_STATUS_UPDATED";
export const EVENT_NODE_SUBSCRIBER_ADDED = "EVENT_NODE_SUBSCRIBER_ADDED";
export const EVENT_HOME_SUBSCRIBER_ADDED = "EVENT_HOME_SUBSCRIBER_ADDED";
export const EVENT_NODE_SUBSCRIBER_UPDATED = "EVENT_NODE_SUBSCRIBER_UPDATED";
export const EVENT_HOME_SUBSCRIBER_UPDATED = "EVENT_HOME_SUBSCRIBER_UPDATED";
export const EVENT_NODE_SUBSCRIBER_DELETED = "EVENT_NODE_SUBSCRIBER_DELETED";
export const EVENT_HOME_SUBSCRIBER_DELETED = "EVENT_HOME_SUBSCRIBER_DELETED";
export const EVENT_NODE_SUBSCRIPTION_ADDED = "EVENT_NODE_SUBSCRIPTION_ADDED";
export const EVENT_HOME_SUBSCRIPTION_ADDED = "EVENT_HOME_SUBSCRIPTION_ADDED";
export const EVENT_NODE_SUBSCRIPTION_UPDATED = "EVENT_NODE_SUBSCRIPTION_UPDATED";
export const EVENT_HOME_SUBSCRIPTION_UPDATED = "EVENT_HOME_SUBSCRIPTION_UPDATED";
export const EVENT_NODE_SUBSCRIPTION_DELETED = "EVENT_NODE_SUBSCRIPTION_DELETED";
export const EVENT_HOME_SUBSCRIPTION_DELETED = "EVENT_HOME_SUBSCRIPTION_DELETED";
export const EVENT_RECEIVER_COMMENT_ADDED = "EVENT_RECEIVER_COMMENT_ADDED";
export const EVENT_RECEIVER_COMMENT_UPDATED = "EVENT_RECEIVER_COMMENT_UPDATED";
export const EVENT_RECEIVER_COMMENT_DELETED = "EVENT_RECEIVER_COMMENT_DELETED";
export const EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED = "EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED";
export const EVENT_HOME_REMOTE_COMMENT_VERIFIED = "EVENT_HOME_REMOTE_COMMENT_VERIFIED";
export const EVENT_HOME_REMOTE_COMMENT_VERIFICATION_FAILED = "EVENT_HOME_REMOTE_COMMENT_VERIFICATION_FAILED";
export const EVENT_NODE_REMOTE_NODE_FULL_NAME_CHANGED = "EVENT_NODE_REMOTE_NODE_FULL_NAME_CHANGED";
export const EVENT_HOME_REMOTE_NODE_FULL_NAME_CHANGED = "EVENT_HOME_REMOTE_NODE_FULL_NAME_CHANGED";
export const EVENT_NODE_SUBSCRIBERS_TOTAL_CHANGED = "EVENT_NODE_SUBSCRIBERS_TOTAL_CHANGED";
export const EVENT_HOME_SUBSCRIBERS_TOTAL_CHANGED = "EVENT_HOME_SUBSCRIBERS_TOTAL_CHANGED";
export const EVENT_NODE_SUBSCRIPTIONS_TOTAL_CHANGED = "EVENT_NODE_SUBSCRIPTIONS_TOTAL_CHANGED";
export const EVENT_HOME_SUBSCRIPTIONS_TOTAL_CHANGED = "EVENT_HOME_SUBSCRIPTIONS_TOTAL_CHANGED";
export const EVENT_NODE_REMOTE_NODE_AVATAR_CHANGED = "EVENT_NODE_REMOTE_NODE_AVATAR_CHANGED";
export const EVENT_HOME_REMOTE_NODE_AVATAR_CHANGED = "EVENT_HOME_REMOTE_NODE_AVATAR_CHANGED";
export const EVENT_NODE_AVATAR_ADDED = "EVENT_NODE_AVATAR_ADDED";
export const EVENT_HOME_AVATAR_ADDED = "EVENT_HOME_AVATAR_ADDED";
export const EVENT_NODE_AVATAR_DELETED = "EVENT_NODE_AVATAR_DELETED";
export const EVENT_HOME_AVATAR_DELETED = "EVENT_HOME_AVATAR_DELETED";
export const EVENT_NODE_AVATAR_ORDERED = "EVENT_NODE_AVATAR_ORDERED";
export const EVENT_HOME_AVATAR_ORDERED = "EVENT_HOME_AVATAR_ORDERED";
export const EVENT_HOME_TOKEN_ADDED = "EVENT_HOME_TOKEN_ADDED";
export const EVENT_HOME_TOKEN_UPDATED = "EVENT_HOME_TOKEN_UPDATED";
export const EVENT_HOME_TOKEN_DELETED = "EVENT_HOME_TOKEN_DELETED";
export const EVENT_NODE_PLUGINS_UPDATED = "EVENT_NODE_PLUGINS_UPDATED";
export const EVENT_HOME_PLUGINS_UPDATED = "EVENT_HOME_PLUGINS_UPDATED";
export const EVENT_NODE_FRIEND_GROUP_ADDED = "EVENT_NODE_FRIEND_GROUP_ADDED";
export const EVENT_HOME_FRIEND_GROUP_ADDED = "EVENT_HOME_FRIEND_GROUP_ADDED";
export const EVENT_NODE_FRIEND_GROUP_UPDATED = "EVENT_NODE_FRIEND_GROUP_UPDATED";
export const EVENT_HOME_FRIEND_GROUP_UPDATED = "EVENT_HOME_FRIEND_GROUP_UPDATED";
export const EVENT_NODE_FRIEND_GROUP_DELETED = "EVENT_NODE_FRIEND_GROUP_DELETED";
export const EVENT_HOME_FRIEND_GROUP_DELETED = "EVENT_HOME_FRIEND_GROUP_DELETED";
export const EVENT_NODE_FRIENDSHIP_UPDATED = "EVENT_NODE_FRIENDSHIP_UPDATED";
export const EVENT_HOME_FRIENDSHIP_UPDATED = "EVENT_HOME_FRIENDSHIP_UPDATED";
export const EVENT_NODE_ASK_SUBJECTS_CHANGED = "EVENT_NODE_ASK_SUBJECTS_CHANGED";
export const EVENT_NODE_REMOTE_FRIENDSHIP_UPDATED = "EVENT_NODE_REMOTE_FRIENDSHIP_UPDATED";

export type EventSource = "HOME" | "NODE" | "RECEIVER";
export type EventActionType<T extends string> = `EVENT_${EventSource}_${T}`;

export type EventAction<E extends BaseEvent<string>> =
    ActionWithPayload<EventActionType<E["type"]>, Omit<E, "type"> & {sourceNode: string | null}>;

export const eventAction = <E extends BaseEvent<string>>(event: E & {sourceNode: string | null},
                                                         source: EventSource): EventAction<E> => ({
    type: `EVENT_${source}_${event.type}`,
    payload: immutable.del(event, "type")
});

export type ClientEventAction =
    EventAction<PingEvent>
    | EventAction<ProfileUpdatedEvent>
    | EventAction<NodeSettingsMetaChangedEvent>
    | EventAction<NodeSettingsChangedEvent>
    | EventAction<ClientSettingsChangedEvent>
    | EventAction<RegisteredNameOperationStatusEvent>
    | EventAction<NodeNameChangedEvent>
    | EventAction<FeedStatusUpdatedEvent>
    | EventAction<StoriesStatusUpdatedEvent>
    | EventAction<RemoteNodeFullNameChangedEvent>
    | EventAction<SubscribersTotalChangedEvent>
    | EventAction<SubscriptionsTotalChangedEvent>
    | EventAction<RemoteNodeAvatarChangedEvent>
    | EventAction<PostingAddedEvent>
    | EventAction<PostingUpdatedEvent>
    | EventAction<PostingDeletedEvent>
    | EventAction<PostingRestoredEvent>
    | EventAction<PostingReactionsChangedEvent>
    | EventAction<PostingCommentsChangedEvent>
    | EventAction<DraftAddedEvent>
    | EventAction<DraftUpdatedEvent>
    | EventAction<DraftDeletedEvent>
    | EventAction<RemotePostingVerifiedEvent>
    | EventAction<RemotePostingVerificationFailedEvent>
    | EventAction<RemoteReactionAddedEvent>
    | EventAction<RemoteReactionDeletedEvent>
    | EventAction<RemoteReactionVerifiedEvent>
    | EventAction<RemoteReactionVerificationFailedEvent>
    | EventAction<StoryAddedEvent>
    | EventAction<StoryDeletedEvent>
    | EventAction<StoryUpdatedEvent>
    | EventAction<SubscriberAddedEvent>
    | EventAction<SubscriberUpdatedEvent>
    | EventAction<SubscriberDeletedEvent>
    | EventAction<SubscriptionAddedEvent>
    | EventAction<SubscriptionUpdatedEvent>
    | EventAction<SubscriptionDeletedEvent>
    | EventAction<CommentAddedEvent>
    | EventAction<CommentUpdatedEvent>
    | EventAction<CommentDeletedEvent>
    | EventAction<CommentReactionsChangedEvent>
    | EventAction<RemoteCommentAddedEvent>
    | EventAction<RemoteCommentUpdatedEvent>
    | EventAction<RemoteCommentDeletedEvent>
    | EventAction<RemoteCommentVerifiedEvent>
    | EventAction<RemoteCommentVerificationFailedEvent>
    | EventAction<AvatarAddedEvent>
    | EventAction<AvatarDeletedEvent>
    | EventAction<AvatarOrderedEvent>
    | EventAction<TokenAddedEvent>
    | EventAction<TokenUpdatedEvent>
    | EventAction<TokenDeletedEvent>
    | EventAction<PluginsUpdatedEvent>
    | EventAction<FriendGroupAddedEvent>
    | EventAction<FriendGroupUpdatedEvent>
    | EventAction<FriendGroupDeletedEvent>
    | EventAction<FriendshipUpdatedEvent>
    | EventAction<AskSubjectsChangedEvent>
    | EventAction<RemoteFriendshipUpdatedEvent>;
