import schema from "api/schema";
import { AvatarImageType } from "api/node/api";
import {
    ClientSettingsChangedEvent,
    CommentAddedEvent,
    CommentDeletedEvent,
    CommentReactionsChangedEvent,
    CommentUpdatedEvent,
    DraftAddedEvent,
    DraftDeletedEvent,
    DraftUpdatedEvent,
    EventPacket as APIEventPacket,
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
import { JSONSchemaType, ValidateFunction } from "ajv";

const EventPacketType: JSONSchemaType<APIEventPacket> = {
    type: "object",
    properties: {
        "queueStartedAt": {
            type: "integer"
        },
        "ordinal": {
            type: "integer"
        },
        "sentAt": {
            type: "integer",
            nullable: true
        },
        "cid": {
            type: "string",
            nullable: true
        },
        "event": {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                }
            },
            required: ["type"]
        }
    },
    additionalProperties: false,
    required: ["queueStartedAt", "ordinal", "event"]
};

export const EventPacket = schema(EventPacketType);

const SubscribedEventType: JSONSchemaType<SubscribedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "clientIp": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "clientIp"]
};

const PingEventType: JSONSchemaType<PingEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type"]
};

const ProfileUpdatedEventType: JSONSchemaType<ProfileUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type"]
};

const NodeSettingsChangedEventType: JSONSchemaType<NodeSettingsChangedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type"]
};

const ClientSettingsChangedEventType: JSONSchemaType<ClientSettingsChangedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type"]
};

const PostingAddedEventType: JSONSchemaType<PostingAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "id"]
};

const PostingUpdatedEventType: JSONSchemaType<PostingUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "id"]
};

const PostingDeletedEventType: JSONSchemaType<PostingDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "id"]
};

const PostingRestoredEventType: JSONSchemaType<PostingRestoredEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "id"]
};

const PostingReactionsChangedEventType: JSONSchemaType<PostingReactionsChangedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "id"]
};

const PostingCommentsChangedEventType: JSONSchemaType<PostingCommentsChangedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "total": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "total"]
};

const RegisteredNameOperationStatusEventType: JSONSchemaType<RegisteredNameOperationStatusEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type"]
};

const NodeNameChangedEventType: JSONSchemaType<NodeNameChangedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "name": {
            type: "string"
        },
        "fullName": {
            type: "string",
            nullable: true
        },
        "gender": {
            type: "string",
            nullable: true
        },
        "title": {
            type: "string",
            nullable: true
        },
        "avatar": {
            ...AvatarImageType,
            nullable: true
        }
    },
    additionalProperties: false,
    required: ["type", "name"]
};

const RemotePostingVerifiedEventType: JSONSchemaType<RemotePostingVerifiedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "nodeName": {
            type: "string"
        },
        "receiverName": {
            type: "string"
        },
        "postingId": {
            type: "string"
        },
        "revisionId": {
            type: "string"
        },
        "correct": {
            type: "boolean"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "nodeName", "receiverName", "postingId", "revisionId", "correct"]
};

const RemotePostingVerificationFailedEventType: JSONSchemaType<RemotePostingVerificationFailedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "nodeName": {
            type: "string"
        },
        "receiverName": {
            type: "string"
        },
        "postingId": {
            type: "string"
        },
        "revisionId": {
            type: "string"
        },
        "errorCode": {
            type: "string"
        },
        "errorMessage": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "nodeName", "receiverName", "postingId", "revisionId", "errorCode", "errorMessage"]
};

const RemoteReactionAddedEventType: JSONSchemaType<RemoteReactionAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "remoteNodeName": {
            type: "string"
        },
        "remotePostingId": {
            type: "string"
        },
        "negative": {
            type: "boolean"
        },
        "emoji": {
            type: "integer"
        },
        "createdAt": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "remoteNodeName", "remotePostingId", "negative", "emoji", "createdAt"]
};

const RemoteReactionDeletedEventType: JSONSchemaType<RemoteReactionDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "remoteNodeName": {
            type: "string"
        },
        "remotePostingId": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "remoteNodeName", "remotePostingId"]
};

const RemoteReactionVerifiedEventType: JSONSchemaType<RemoteReactionVerifiedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "nodeName": {
            type: "string"
        },
        "postingId": {
            type: "string"
        },
        "reactionOwnerName": {
            type: "string"
        },
        "correct": {
            type: "boolean"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "nodeName", "postingId", "reactionOwnerName", "correct"]
};

const RemoteReactionVerificationFailedEventType: JSONSchemaType<RemoteReactionVerificationFailedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "nodeName": {
            type: "string"
        },
        "postingId": {
            type: "string"
        },
        "reactionOwnerName": {
            type: "string"
        },
        "errorCode": {
            type: "string"
        },
        "errorMessage": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "nodeName", "postingId", "reactionOwnerName", "errorCode", "errorMessage"]
};

const DraftAddedEventType: JSONSchemaType<DraftAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "draftType": {
            type: "string"
        },
        "receiverName": {
            type: "string"
        },
        "receiverPostingId": {
            type: "string"
        },
        "receiverCommentId": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "draftType", "receiverName", "receiverPostingId", "receiverCommentId"]
};

const DraftUpdatedEventType: JSONSchemaType<DraftUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "draftType": {
            type: "string"
        },
        "receiverName": {
            type: "string"
        },
        "receiverPostingId": {
            type: "string"
        },
        "receiverCommentId": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "draftType", "receiverName", "receiverPostingId", "receiverCommentId"]
};

const DraftDeletedEventType: JSONSchemaType<DraftDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "draftType": {
            type: "string"
        },
        "receiverName": {
            type: "string"
        },
        "receiverPostingId": {
            type: "string"
        },
        "receiverCommentId": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "draftType", "receiverName", "receiverPostingId", "receiverCommentId"]
};

const StoryAddedEventType: JSONSchemaType<StoryAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "storyType": {
            type: "string"
        },
        "feedName": {
            type: "string"
        },
        "publishedAt": {
            type: "integer"
        },
        "pinned": {
            type: "boolean"
        },
        "moment": {
            type: "integer"
        },
        "postingId": {
            type: "string"
        },
        "viewed": {
            type: "boolean"
        },
        "read": {
            type: "boolean"
        },
        "summaryAvatar": {
            ...AvatarImageType,
            nullable: true
        },
        "summary": {
            type: "string"
        },
        "trackingId": {
            type: "string"
        },
        "remoteNodeName": {
            type: "string",
            nullable: true
        },
        "remoteFullName": {
            type: "string",
            nullable: true
        },
        "remotePostingId": {
            type: "string",
            nullable: true
        },
        "remoteCommentId": {
            type: "string",
            nullable: true
        },
        "operations": {
            type: "object",
            properties: {
                "edit": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                },
                "delete": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    additionalProperties: false,
    required: [
        "type", "id", "storyType", "feedName", "publishedAt", "pinned", "moment", "postingId", "viewed", "read",
        "summary", "trackingId"
    ]
};

const StoryDeletedEventType: JSONSchemaType<StoryDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "storyType": {
            type: "string"
        },
        "feedName": {
            type: "string"
        },
        "publishedAt": {
            type: "integer"
        },
        "pinned": {
            type: "boolean"
        },
        "moment": {
            type: "integer"
        },
        "postingId": {
            type: "string"
        },
        "viewed": {
            type: "boolean"
        },
        "read": {
            type: "boolean"
        },
        "summaryAvatar": {
            ...AvatarImageType,
            nullable: true
        },
        "summary": {
            type: "string"
        },
        "trackingId": {
            type: "string"
        },
        "remoteNodeName": {
            type: "string",
            nullable: true
        },
        "remoteFullName": {
            type: "string",
            nullable: true
        },
        "remotePostingId": {
            type: "string",
            nullable: true
        },
        "remoteCommentId": {
            type: "string",
            nullable: true
        },
        "operations": {
            type: "object",
            properties: {
                "edit": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                },
                "delete": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    additionalProperties: false,
    required: [
        "type", "id", "storyType", "feedName", "publishedAt", "pinned", "moment", "postingId", "viewed", "read",
        "summary", "trackingId"
    ]
};

const StoryUpdatedEventType: JSONSchemaType<StoryUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "storyType": {
            type: "string"
        },
        "feedName": {
            type: "string"
        },
        "publishedAt": {
            type: "integer"
        },
        "pinned": {
            type: "boolean"
        },
        "moment": {
            type: "integer"
        },
        "postingId": {
            type: "string"
        },
        "viewed": {
            type: "boolean"
        },
        "read": {
            type: "boolean"
        },
        "summaryAvatar": {
            ...AvatarImageType,
            nullable: true
        },
        "summary": {
            type: "string"
        },
        "trackingId": {
            type: "string"
        },
        "remoteNodeName": {
            type: "string",
            nullable: true
        },
        "remoteFullName": {
            type: "string",
            nullable: true
        },
        "remotePostingId": {
            type: "string",
            nullable: true
        },
        "remoteCommentId": {
            type: "string",
            nullable: true
        },
        "operations": {
            type: "object",
            properties: {
                "edit": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                },
                "delete": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    additionalProperties: false,
    required: [
        "type", "id", "storyType", "feedName", "publishedAt", "pinned", "moment", "postingId", "viewed", "read",
        "summary", "trackingId"
    ]
};

const FeedStatusUpdatedEventType: JSONSchemaType<FeedStatusUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "feedName": {
            type: "string"
        },
        "notViewed": {
            type: "integer"
        },
        "notRead": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "feedName", "notViewed", "notRead"]
};

const StoriesStatusUpdatedEventType: JSONSchemaType<StoriesStatusUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "feedName": {
            type: "string"
        },
        "viewed": {
            type: "boolean"
        },
        "read": {
            type: "boolean"
        },
        "before": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "feedName", "viewed", "read", "before"]
};

const SubscriberAddedEventType: JSONSchemaType<SubscriberAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "subscriptionType": {
            type: "string"
        },
        "feedName": {
            type: "string",
            nullable: true
        },
        "postingId": {
            type: "string",
            nullable: true
        },
        "nodeName": {
            type: "string"
        },
        "fullName": {
            type: "string",
            nullable: true
        },
        "avatar": {
            ...AvatarImageType,
            nullable: true
        },
        "createdAt": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "subscriptionType", "nodeName", "createdAt"]
};

const SubscriberDeletedEventType: JSONSchemaType<SubscriberDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "subscriptionType": {
            type: "string"
        },
        "feedName": {
            type: "string",
            nullable: true
        },
        "postingId": {
            type: "string",
            nullable: true
        },
        "nodeName": {
            type: "string"
        },
        "fullName": {
            type: "string",
            nullable: true
        },
        "avatar": {
            ...AvatarImageType,
            nullable: true
        },
        "createdAt": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "subscriptionType", "nodeName", "createdAt"]
};

const SubscriptionAddedEventType: JSONSchemaType<SubscriptionAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "subscriptionType": {
            type: "string"
        },
        "feedName": {
            type: "string",
            nullable: true
        },
        "remoteSubscriberId": {
            type: "string"
        },
        "remoteNodeName": {
            type: "string"
        },
        "remoteFullName": {
            type: "string",
            nullable: true
        },
        "remoteAvatar": {
            ...AvatarImageType,
            nullable: true
        },
        "remoteFeedName": {
            type: "string",
            nullable: true
        },
        "remotePostingId": {
            type: "string",
            nullable: true
        },
        "createdAt": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "subscriptionType", "feedName", "remoteSubscriberId", "remoteNodeName", "createdAt"]
};

const SubscriptionDeletedEventType: JSONSchemaType<SubscriptionDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "subscriptionType": {
            type: "string"
        },
        "feedName": {
            type: "string",
            nullable: true
        },
        "remoteSubscriberId": {
            type: "string"
        },
        "remoteNodeName": {
            type: "string"
        },
        "remoteFullName": {
            type: "string",
            nullable: true
        },
        "remoteAvatar": {
            ...AvatarImageType,
            nullable: true
        },
        "remoteFeedName": {
            type: "string",
            nullable: true
        },
        "remotePostingId": {
            type: "string",
            nullable: true
        },
        "createdAt": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "subscriptionType", "feedName", "remoteSubscriberId", "remoteNodeName", "createdAt"]
};

const CommentAddedEventType: JSONSchemaType<CommentAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "postingId": {
            type: "string"
        },
        "moment": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "postingId", "moment"]
};

const CommentUpdatedEventType: JSONSchemaType<CommentUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "postingId": {
            type: "string"
        },
        "moment": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "postingId", "moment"]
};

const CommentDeletedEventType: JSONSchemaType<CommentDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "postingId": {
            type: "string"
        },
        "moment": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "postingId", "moment"]
};

const CommentReactionsChangedEventType: JSONSchemaType<CommentReactionsChangedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "postingId": {
            type: "string"
        },
        "moment": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "postingId", "moment"]
};

const RemoteCommentAddedEventType: JSONSchemaType<RemoteCommentAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "remoteNodeName": {
            type: "string"
        },
        "remotePostingId": {
            type: "string"
        },
        "remoteCommentId": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "remoteNodeName", "remotePostingId", "remoteCommentId"]
};

const RemoteCommentUpdatedEventType: JSONSchemaType<RemoteCommentUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "remoteNodeName": {
            type: "string"
        },
        "remotePostingId": {
            type: "string"
        },
        "remoteCommentId": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "remoteNodeName", "remotePostingId", "remoteCommentId"]
};

const RemoteCommentDeletedEventType: JSONSchemaType<RemoteCommentDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "remoteNodeName": {
            type: "string"
        },
        "remotePostingId": {
            type: "string"
        },
        "remoteCommentId": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "remoteNodeName", "remotePostingId", "remoteCommentId"]
};

const RemoteCommentVerifiedEventType: JSONSchemaType<RemoteCommentVerifiedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "nodeName": {
            type: "string"
        },
        "postingId": {
            type: "string"
        },
        "commentId": {
            type: "string"
        },
        "correct": {
            type: "boolean"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "nodeName", "postingId", "commentId", "correct"]
};

const RemoteCommentVerificationFailedEventType: JSONSchemaType<RemoteCommentVerificationFailedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "nodeName": {
            type: "string"
        },
        "postingId": {
            type: "string"
        },
        "commentId": {
            type: "string"
        },
        "errorCode": {
            type: "string"
        },
        "errorMessage": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "nodeName", "postingId", "commentId", "errorCode", "errorMessage"]
};

const RemoteNodeFullNameChangedEventType: JSONSchemaType<RemoteNodeFullNameChangedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "name": {
            type: "string"
        },
        "fullName": {
            type: "string",
            nullable: true
        }
    },
    additionalProperties: false,
    required: ["type", "name"]
};

const PeopleChangedEventType: JSONSchemaType<PeopleChangedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "feedSubscribersTotal": {
            type: "integer"
        },
        "feedSubscriptionsTotal": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "feedSubscribersTotal", "feedSubscriptionsTotal"]
};

const RemoteNodeAvatarChangedEventType: JSONSchemaType<RemoteNodeAvatarChangedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "name": {
            type: "string"
        },
        "avatar": {
            ...AvatarImageType,
            nullable: true
        }
    },
    additionalProperties: false,
    required: ["type", "name"]
};

export const EVENT_SCHEMES: Record<string, ValidateFunction<any>> = {
    "SUBSCRIBED": schema(SubscribedEventType),
    "PING": schema(PingEventType),
    "PROFILE_UPDATED": schema(ProfileUpdatedEventType),
    "NODE_SETTINGS_CHANGED": schema(NodeSettingsChangedEventType),
    "CLIENT_SETTINGS_CHANGED": schema(ClientSettingsChangedEventType),
    "POSTING_ADDED": schema(PostingAddedEventType),
    "POSTING_UPDATED": schema(PostingUpdatedEventType),
    "POSTING_DELETED": schema(PostingDeletedEventType),
    "POSTING_RESTORED": schema(PostingRestoredEventType),
    "POSTING_REACTIONS_CHANGED": schema(PostingReactionsChangedEventType),
    "POSTING_COMMENTS_CHANGED": schema(PostingCommentsChangedEventType),
    "REGISTERED_NAME_OPERATION_STATUS": schema(RegisteredNameOperationStatusEventType),
    "NODE_NAME_CHANGED": schema(NodeNameChangedEventType),
    "REMOTE_POSTING_VERIFIED": schema(RemotePostingVerifiedEventType),
    "REMOTE_POSTING_VERIFICATION_FAILED": schema(RemotePostingVerificationFailedEventType),
    "REMOTE_REACTION_ADDED": schema(RemoteReactionAddedEventType),
    "REMOTE_REACTION_DELETED": schema(RemoteReactionDeletedEventType),
    "REMOTE_REACTION_VERIFIED": schema(RemoteReactionVerifiedEventType),
    "REMOTE_REACTION_VERIFICATION_FAILED": schema(RemoteReactionVerificationFailedEventType),
    "DRAFT_ADDED": schema(DraftAddedEventType),
    "DRAFT_UPDATED": schema(DraftUpdatedEventType),
    "DRAFT_DELETED": schema(DraftDeletedEventType),
    "STORY_ADDED": schema(StoryAddedEventType),
    "STORY_DELETED": schema(StoryDeletedEventType),
    "STORY_UPDATED": schema(StoryUpdatedEventType),
    "FEED_STATUS_UPDATED": schema(FeedStatusUpdatedEventType),
    "STORIES_STATUS_UPDATED": schema(StoriesStatusUpdatedEventType),
    "SUBSCRIBER_ADDED": schema(SubscriberAddedEventType),
    "SUBSCRIBER_DELETED": schema(SubscriberDeletedEventType),
    "SUBSCRIPTION_ADDED": schema(SubscriptionAddedEventType),
    "SUBSCRIPTION_DELETED": schema(SubscriptionDeletedEventType),
    "COMMENT_ADDED": schema(CommentAddedEventType),
    "COMMENT_UPDATED": schema(CommentUpdatedEventType),
    "COMMENT_DELETED": schema(CommentDeletedEventType),
    "COMMENT_REACTIONS_CHANGED": schema(CommentReactionsChangedEventType),
    "REMOTE_COMMENT_ADDED": schema(RemoteCommentAddedEventType),
    "REMOTE_COMMENT_UPDATED": schema(RemoteCommentUpdatedEventType),
    "REMOTE_COMMENT_DELETED": schema(RemoteCommentDeletedEventType),
    "REMOTE_COMMENT_VERIFIED": schema(RemoteCommentVerifiedEventType),
    "REMOTE_COMMENT_VERIFICATION_FAILED": schema(RemoteCommentVerificationFailedEventType),
    "REMOTE_NODE_FULL_NAME_CHANGED": schema(RemoteNodeFullNameChangedEventType),
    "PEOPLE_CHANGED": schema(PeopleChangedEventType),
    "REMOTE_NODE_AVATAR_CHANGED": schema(RemoteNodeAvatarChangedEventType)
};

export const ALLOWED_SELF_EVENTS = new Set([
    "STORY_ADDED",
    "STORY_DELETED",
    "STORY_UPDATED",
    "FEED_STATUS_UPDATED",
    "NODE_NAME_CHANGED",
    "PEOPLE_CHANGED"
]);
