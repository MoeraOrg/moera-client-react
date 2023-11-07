import * as immutable from 'object-path-immutable';
import {
    AskSubjectsChangedEvent,
    AvatarAddedEvent,
    AvatarDeletedEvent,
    AvatarOrderedEvent,
    BaseEvent,
    BlockedByUserAddedEvent,
    BlockedByUserDeletedEvent,
    BlockedInstantAddedEvent,
    BlockedInstantDeletedEvent,
    BlockedUserAddedEvent,
    BlockedUserDeletedEvent,
    ClientSettingsChangedEvent,
    CommentAddedEvent,
    CommentDeletedEvent,
    CommentReactionsChangedEvent,
    CommentUpdatedEvent,
    DraftAddedEvent,
    DraftDeletedEvent,
    DraftUpdatedEvent,
    FeedSheriffDataUpdatedEvent,
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
    SheriffComplainAddedEvent,
    SheriffComplainGroupAddedEvent,
    SheriffComplainGroupUpdatedEvent,
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
} from "api/events";
import { actionWithPayload, ActionWithPayload } from "state/action-types";

export type EventSource = "HOME" | "NODE" | "RECEIVER";
export type EventActionType<T extends string> = `EVENT_${EventSource}_${T}`;

export type EventAction<E extends BaseEvent<string>> =
    ActionWithPayload<EventActionType<E["type"]>, Omit<E, "type"> & {sourceNode: string | null}>;

export const eventAction = <E extends BaseEvent<string>>(
    event: E & {sourceNode: string | null}, source: EventSource
): EventAction<E> =>
    actionWithPayload(`EVENT_${source}_${event.type}` as const, immutable.del(event, "type"));

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
    | EventAction<RemoteFriendshipUpdatedEvent>
    | EventAction<BlockedInstantAddedEvent>
    | EventAction<BlockedInstantDeletedEvent>
    | EventAction<BlockedUserAddedEvent>
    | EventAction<BlockedUserDeletedEvent>
    | EventAction<BlockedByUserAddedEvent>
    | EventAction<BlockedByUserDeletedEvent>
    | EventAction<FeedSheriffDataUpdatedEvent>
    | EventAction<SheriffComplainGroupAddedEvent>
    | EventAction<SheriffComplainGroupUpdatedEvent>
    | EventAction<SheriffComplainAddedEvent>;
