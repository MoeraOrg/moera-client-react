import * as immutable from 'object-path-immutable';
import {
    ClientSettingsChangedEvent,
    CommentAddedEvent,
    CommentDeletedEvent,
    CommentReactionsChangedEvent,
    CommentUpdatedEvent,
    DraftAddedEvent,
    DraftDeletedEvent,
    DraftUpdatedEvent,
    FeedStatusUpdatedEvent,
    NodeNameChangedEvent,
    NodeSettingsChangedEvent,
    PeopleChangedEvent,
    PingEvent,
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
    SubscribedEvent,
    SubscriberAddedEvent,
    SubscriberDeletedEvent,
    SubscriptionAddedEvent,
    SubscriptionDeletedEvent
} from "api/events/api-types";
import { Action } from "redux";

export const EVENT_HOME_SUBSCRIBED = "EVENT_HOME_SUBSCRIBED";
export const EVENT_NODE_PROFILE_UPDATED = "EVENT_NODE_PROFILE_UPDATED";
export const EVENT_HOME_NODE_SETTINGS_CHANGED = "EVENT_HOME_NODE_SETTINGS_CHANGED";
export const EVENT_HOME_CLIENT_SETTINGS_CHANGED = "EVENT_HOME_CLIENT_SETTINGS_CHANGED";
export const EVENT_NODE_POSTING_UPDATED = "EVENT_NODE_POSTING_UPDATED";
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
export const EVENT_HOME_FEED_STATUS_UPDATED = "EVENT_HOME_FEED_STATUS_UPDATED";
export const EVENT_HOME_STORIES_STATUS_UPDATED = "EVENT_HOME_STORIES_STATUS_UPDATED";
export const EVENT_NODE_SUBSCRIBER_ADDED = "EVENT_NODE_SUBSCRIBER_ADDED";
export const EVENT_NODE_SUBSCRIBER_DELETED = "EVENT_NODE_SUBSCRIBER_DELETED";
export const EVENT_NODE_SUBSCRIPTION_ADDED = "EVENT_NODE_SUBSCRIPTION_ADDED";
export const EVENT_HOME_SUBSCRIPTION_ADDED = "EVENT_HOME_SUBSCRIPTION_ADDED";
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
export const EVENT_NODE_PEOPLE_CHANGED = "EVENT_NODE_PEOPLE_CHANGED";
export const EVENT_HOME_PEOPLE_CHANGED = "EVENT_HOME_PEOPLE_CHANGED";
export const EVENT_NODE_REMOTE_NODE_AVATAR_CHANGED = "EVENT_NODE_REMOTE_NODE_AVATAR_CHANGED";
export const EVENT_HOME_REMOTE_NODE_AVATAR_CHANGED = "EVENT_HOME_REMOTE_NODE_AVATAR_CHANGED";

type EventSource = "HOME" | "NODE" | "RECEIVER";
type EventActionType<T extends string> = `EVENT_${EventSource}_${T}`;

interface EventAction<E extends {type: string}> extends Action<E["type"]> {
    type: EventActionType<E["type"]>;
    payload: Omit<E, "type">;
}

export const eventAction = <E extends {type: string}>(event: E, source: EventSource): EventAction<E> => ({
    type: `EVENT_${source}_${event.type}`,
    payload: immutable.del(event, "type")
});

export type ClientEventAction =
    EventAction<SubscribedEvent>
    | EventAction<PingEvent>
    | EventAction<ProfileUpdatedEvent>
    | EventAction<NodeSettingsChangedEvent>
    | EventAction<ClientSettingsChangedEvent>
    | EventAction<RegisteredNameOperationStatusEvent>
    | EventAction<NodeNameChangedEvent>
    | EventAction<FeedStatusUpdatedEvent>
    | EventAction<StoriesStatusUpdatedEvent>
    | EventAction<RemoteNodeFullNameChangedEvent>
    | EventAction<PeopleChangedEvent>
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
    | EventAction<SubscriberDeletedEvent>
    | EventAction<SubscriptionAddedEvent>
    | EventAction<SubscriptionDeletedEvent>
    | EventAction<CommentAddedEvent>
    | EventAction<CommentUpdatedEvent>
    | EventAction<CommentDeletedEvent>
    | EventAction<CommentReactionsChangedEvent>
    | EventAction<RemoteCommentAddedEvent>
    | EventAction<RemoteCommentUpdatedEvent>
    | EventAction<RemoteCommentDeletedEvent>
    | EventAction<RemoteCommentVerifiedEvent>
    | EventAction<RemoteCommentVerificationFailedEvent>;
