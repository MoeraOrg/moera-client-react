// This file is generated

import * as immutable from 'object-path-immutable';
import { actionWithPayload, ActionWithPayload } from "state/action-types";
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
    RemotePostingAddedEvent,
    RemotePostingDeletedEvent,
    RemotePostingUpdatedEvent,
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
    SubscribedEvent,
    SubscriberAddedEvent,
    SubscriberDeletedEvent,
    SubscriberUpdatedEvent,
    SubscribersTotalChangedEvent,
    SubscriptionAddedEvent,
    SubscriptionDeletedEvent,
    SubscriptionUpdatedEvent,
    SubscriptionsTotalChangedEvent,
    TokenAddedEvent,
    TokenDeletedEvent,
    TokenUpdatedEvent,
} from "api/events";

export type EventSource = "HOME" | "NODE" | "RECEIVER";
export type EventActionType<T extends string> = `EVENT_${EventSource}_${T}`;

export type EventAction<E extends BaseEvent<string>> =
    ActionWithPayload<EventActionType<E["type"]>, Omit<E, "type"> & {sourceNode: string | null}>;

export const eventAction = <E extends BaseEvent<string>>(
    event: E & {sourceNode: string | null}, source: EventSource
): EventAction<E> =>
    actionWithPayload(`EVENT_${source}_${event.type}` as const, immutable.del(event, "type"));

export type ClientEventAction =
    EventAction<AskSubjectsChangedEvent>
    | EventAction<AvatarAddedEvent>
    | EventAction<AvatarDeletedEvent>
    | EventAction<AvatarOrderedEvent>
    | EventAction<BlockedByUserAddedEvent>
    | EventAction<BlockedByUserDeletedEvent>
    | EventAction<BlockedInstantAddedEvent>
    | EventAction<BlockedInstantDeletedEvent>
    | EventAction<BlockedUserAddedEvent>
    | EventAction<BlockedUserDeletedEvent>
    | EventAction<ClientSettingsChangedEvent>
    | EventAction<CommentAddedEvent>
    | EventAction<CommentDeletedEvent>
    | EventAction<CommentReactionsChangedEvent>
    | EventAction<CommentUpdatedEvent>
    | EventAction<DraftAddedEvent>
    | EventAction<DraftDeletedEvent>
    | EventAction<DraftUpdatedEvent>
    | EventAction<FeedSheriffDataUpdatedEvent>
    | EventAction<FeedStatusUpdatedEvent>
    | EventAction<FriendGroupAddedEvent>
    | EventAction<FriendGroupDeletedEvent>
    | EventAction<FriendGroupUpdatedEvent>
    | EventAction<FriendshipUpdatedEvent>
    | EventAction<NodeNameChangedEvent>
    | EventAction<NodeSettingsChangedEvent>
    | EventAction<NodeSettingsMetaChangedEvent>
    | EventAction<PingEvent>
    | EventAction<PluginsUpdatedEvent>
    | EventAction<PostingAddedEvent>
    | EventAction<PostingCommentsChangedEvent>
    | EventAction<PostingDeletedEvent>
    | EventAction<PostingReactionsChangedEvent>
    | EventAction<PostingRestoredEvent>
    | EventAction<PostingUpdatedEvent>
    | EventAction<ProfileUpdatedEvent>
    | EventAction<RegisteredNameOperationStatusEvent>
    | EventAction<RemoteCommentAddedEvent>
    | EventAction<RemoteCommentDeletedEvent>
    | EventAction<RemoteCommentUpdatedEvent>
    | EventAction<RemoteCommentVerificationFailedEvent>
    | EventAction<RemoteCommentVerifiedEvent>
    | EventAction<RemoteFriendshipUpdatedEvent>
    | EventAction<RemoteNodeAvatarChangedEvent>
    | EventAction<RemoteNodeFullNameChangedEvent>
    | EventAction<RemotePostingAddedEvent>
    | EventAction<RemotePostingDeletedEvent>
    | EventAction<RemotePostingUpdatedEvent>
    | EventAction<RemotePostingVerificationFailedEvent>
    | EventAction<RemotePostingVerifiedEvent>
    | EventAction<RemoteReactionAddedEvent>
    | EventAction<RemoteReactionDeletedEvent>
    | EventAction<RemoteReactionVerificationFailedEvent>
    | EventAction<RemoteReactionVerifiedEvent>
    | EventAction<SheriffComplainAddedEvent>
    | EventAction<SheriffComplainGroupAddedEvent>
    | EventAction<SheriffComplainGroupUpdatedEvent>
    | EventAction<StoriesStatusUpdatedEvent>
    | EventAction<StoryAddedEvent>
    | EventAction<StoryDeletedEvent>
    | EventAction<StoryUpdatedEvent>
    | EventAction<SubscribedEvent>
    | EventAction<SubscriberAddedEvent>
    | EventAction<SubscriberDeletedEvent>
    | EventAction<SubscriberUpdatedEvent>
    | EventAction<SubscribersTotalChangedEvent>
    | EventAction<SubscriptionAddedEvent>
    | EventAction<SubscriptionDeletedEvent>
    | EventAction<SubscriptionUpdatedEvent>
    | EventAction<SubscriptionsTotalChangedEvent>
    | EventAction<TokenAddedEvent>
    | EventAction<TokenDeletedEvent>
    | EventAction<TokenUpdatedEvent>;
