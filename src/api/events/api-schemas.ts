import { JSONSchemaType, ValidateFunction } from 'ajv';

import schema from "api/schema";
import * as NodeApiSchema from "api/node/api-schemas";
import {
    AskSubjectsChangedEvent,
    AvatarAddedEvent,
    AvatarDeletedEvent,
    AvatarOrderedEvent,
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
    EventPacket as APIEventPacket,
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

const NodeSettingsMetaChangedEventType: JSONSchemaType<NodeSettingsMetaChangedEvent> = {
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
            ...NodeApiSchema.AvatarImageType,
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
            type: "string",
            nullable: true
        },
        "viewed": {
            type: "boolean",
            nullable: true
        },
        "read": {
            type: "boolean",
            nullable: true
        },
        "satisfied": {
            type: "boolean",
            nullable: true
        },
        "summaryNodeName": {
            type: "string",
            nullable: true
        },
        "summaryFullName": {
            type: "string",
            nullable: true
        },
        "summaryAvatar": {
            ...NodeApiSchema.AvatarImageType,
            nullable: true
        },
        "summary": {
            type: "string",
            nullable: true
        },
        "summaryData": {
            ...NodeApiSchema.StorySummaryDataType,
            nullable: true
        },
        "trackingId": {
            type: "string",
            nullable: true
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
                    type: "string",
                    nullable: true
                },
                "delete": {
                    type: "string",
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    additionalProperties: false,
    required: ["type", "id", "storyType", "feedName", "publishedAt", "pinned", "moment"]
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
        "moment": {
            type: "integer"
        },
        "postingId": {
            type: "string",
            nullable: true
        }
    },
    additionalProperties: false,
    required: ["type", "id", "storyType", "feedName", "moment"]
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
            type: "string",
            nullable: true
        },
        "viewed": {
            type: "boolean",
            nullable: true
        },
        "read": {
            type: "boolean",
            nullable: true
        },
        "satisfied": {
            type: "boolean",
            nullable: true
        },
        "summaryNodeName": {
            type: "string",
            nullable: true
        },
        "summaryFullName": {
            type: "string",
            nullable: true
        },
        "summaryAvatar": {
            ...NodeApiSchema.AvatarImageType,
            nullable: true
        },
        "summary": {
            type: "string",
            nullable: true
        },
        "summaryData": {
            ...NodeApiSchema.StorySummaryDataType,
            nullable: true
        },
        "trackingId": {
            type: "string",
            nullable: true
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
                    type: "string",
                    nullable: true
                },
                "delete": {
                    type: "string",
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    additionalProperties: false,
    required: ["type", "id", "storyType", "feedName", "publishedAt", "pinned", "moment"]
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
        "status": NodeApiSchema.FeedStatusType
    },
    additionalProperties: false,
    required: ["type", "feedName", "status"]
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
            type: "boolean",
            nullable: true
        },
        "read": {
            type: "boolean",
            nullable: true
        },
        "before": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "feedName", "before"]
};

const SubscriberAddedEventType: JSONSchemaType<SubscriberAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "subscriber": NodeApiSchema.SubscriberInfoType
    },
    additionalProperties: false,
    required: ["subscriber"]
};

const SubscriberUpdatedEventType: JSONSchemaType<SubscriberUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "subscriber": NodeApiSchema.SubscriberInfoType
    },
    additionalProperties: false,
    required: ["subscriber"]
};

const SubscriberDeletedEventType: JSONSchemaType<SubscriberDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "subscriber": NodeApiSchema.SubscriberInfoType
    },
    additionalProperties: false,
    required: ["subscriber"]
};

const SubscriptionAddedEventType: JSONSchemaType<SubscriptionAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "subscription": NodeApiSchema.SubscriptionInfoType
    },
    additionalProperties: false,
    required: ["subscription"]
};

const SubscriptionUpdatedEventType: JSONSchemaType<SubscriptionUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "subscription": NodeApiSchema.SubscriptionInfoType
    },
    additionalProperties: false,
    required: ["subscription"]
};

const SubscriptionDeletedEventType: JSONSchemaType<SubscriptionDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "subscription": NodeApiSchema.SubscriptionInfoType
    },
    additionalProperties: false,
    required: ["subscription"]
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

const SubscribersTotalChangedEventType: JSONSchemaType<SubscribersTotalChangedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "feedSubscribersTotal": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "feedSubscribersTotal"]
};

const SubscriptionsTotalChangedEventType: JSONSchemaType<SubscriptionsTotalChangedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "feedSubscriptionsTotal": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "feedSubscriptionsTotal"]
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
            ...NodeApiSchema.AvatarImageType,
            nullable: true
        }
    },
    additionalProperties: false,
    required: ["type", "name"]
};

const AvatarAddedEventType: JSONSchemaType<AvatarAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "avatar": NodeApiSchema.AvatarInfoType
    },
    additionalProperties: false,
    required: ["type", "avatar"]
}

const AvatarDeletedEventType: JSONSchemaType<AvatarDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "mediaId": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "mediaId"]
}

const AvatarOrderedEventType: JSONSchemaType<AvatarOrderedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "id": {
            type: "string"
        },
        "mediaId": {
            type: "string"
        },
        "ordinal": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["type", "id", "mediaId", "ordinal"]
}

const RemotePostingAddedEventType: JSONSchemaType<RemotePostingAddedEvent> = {
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

const RemotePostingUpdatedEventType: JSONSchemaType<RemotePostingUpdatedEvent> = {
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

const RemotePostingDeletedEventType: JSONSchemaType<RemotePostingDeletedEvent> = {
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

const TokenAddedEventType: JSONSchemaType<TokenAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "token": NodeApiSchema.TokenInfoType
    },
    additionalProperties: false,
    required: ["type", "token"]
}

const TokenUpdatedEventType: JSONSchemaType<TokenUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "token": NodeApiSchema.TokenInfoType
    },
    additionalProperties: false,
    required: ["type", "token"]
}

const TokenDeletedEventType: JSONSchemaType<TokenDeletedEvent> = {
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
}

const PluginsUpdatedEventType: JSONSchemaType<PluginsUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type"]
}

const FriendGroupAddedEventType: JSONSchemaType<FriendGroupAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "friendGroup": NodeApiSchema.FriendGroupInfoType
    },
    additionalProperties: false,
    required: ["type", "friendGroup"]
}

const FriendGroupUpdatedEventType: JSONSchemaType<FriendGroupUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "friendGroup": NodeApiSchema.FriendGroupInfoType
    },
    additionalProperties: false,
    required: ["type", "friendGroup"]
}

const FriendGroupDeletedEventType: JSONSchemaType<FriendGroupDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "friendGroupId": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "friendGroupId"]
}

const FriendshipUpdatedEventType: JSONSchemaType<FriendshipUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "friend": NodeApiSchema.FriendInfoType
    },
    additionalProperties: false,
    required: ["type", "friend"]
}

const AskSubjectsChangedEventType: JSONSchemaType<AskSubjectsChangedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type"]
};

const RemoteFriendshipUpdatedEventType: JSONSchemaType<RemoteFriendshipUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "friendOf": NodeApiSchema.FriendOfInfoType
    },
    additionalProperties: false,
    required: ["type", "friendOf"]
}

const BlockedInstantAddedEventType: JSONSchemaType<BlockedInstantAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "blockedInstant": NodeApiSchema.BlockedInstantInfoType
    },
    additionalProperties: false,
    required: ["type", "blockedInstant"]
}

const BlockedInstantDeletedEventType: JSONSchemaType<BlockedInstantDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "blockedInstant": NodeApiSchema.BlockedInstantInfoType
    },
    additionalProperties: false,
    required: ["type", "blockedInstant"]
}

const BlockedUserAddedEventType: JSONSchemaType<BlockedUserAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "blockedUser": NodeApiSchema.BlockedUserInfoType
    },
    additionalProperties: false,
    required: ["type", "blockedUser"]
}

const BlockedUserDeletedEventType: JSONSchemaType<BlockedUserDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "blockedUser": NodeApiSchema.BlockedUserInfoType
    },
    additionalProperties: false,
    required: ["type", "blockedUser"]
}

const BlockedByUserAddedEventType: JSONSchemaType<BlockedByUserAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "blockedByUser": NodeApiSchema.BlockedByUserInfoType
    },
    additionalProperties: false,
    required: ["type", "blockedByUser"]
}

const BlockedByUserDeletedEventType: JSONSchemaType<BlockedByUserDeletedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "blockedByUser": NodeApiSchema.BlockedByUserInfoType
    },
    additionalProperties: false,
    required: ["type", "blockedByUser"]
}

const FeedSheriffDataUpdatedEventType: JSONSchemaType<FeedSheriffDataUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "feedName": {
            type: "string"
        },
        "sheriffs": {
            type: "array",
            items: {
                type: "string"
            },
            nullable: true
        },
        "sheriffMarks": {
            type: "array",
            items: NodeApiSchema.SheriffMarkType,
            nullable: true
        }
    },
    additionalProperties: false,
    required: ["type", "feedName"]
}

const SheriffComplainGroupAddedEventType: JSONSchemaType<SheriffComplainGroupAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "group": NodeApiSchema.SheriffComplainGroupInfoType
    },
    additionalProperties: false,
    required: ["type", "group"]
}

const SheriffComplainGroupUpdatedEventType: JSONSchemaType<SheriffComplainGroupUpdatedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "group": NodeApiSchema.SheriffComplainGroupInfoType
    },
    additionalProperties: false,
    required: ["type", "group"]
}

const SheriffComplainAddedEventType: JSONSchemaType<SheriffComplainAddedEvent> = {
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        "complain": NodeApiSchema.SheriffComplainInfoType,
        "groupId": {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["type", "complain", "groupId"]
}

export const EVENT_SCHEMAS: Partial<Record<string, ValidateFunction<any>>> = {
    "PING": schema(PingEventType),
    "PROFILE_UPDATED": schema(ProfileUpdatedEventType),
    "NODE_SETTINGS_META_CHANGED": schema(NodeSettingsMetaChangedEventType),
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
    "SUBSCRIBER_UPDATED": schema(SubscriberUpdatedEventType),
    "SUBSCRIBER_DELETED": schema(SubscriberDeletedEventType),
    "SUBSCRIPTION_ADDED": schema(SubscriptionAddedEventType),
    "SUBSCRIPTION_UPDATED": schema(SubscriptionUpdatedEventType),
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
    "SUBSCRIBERS_TOTAL_CHANGED": schema(SubscribersTotalChangedEventType),
    "SUBSCRIPTIONS_TOTAL_CHANGED": schema(SubscriptionsTotalChangedEventType),
    "REMOTE_NODE_AVATAR_CHANGED": schema(RemoteNodeAvatarChangedEventType),
    "AVATAR_ADDED": schema(AvatarAddedEventType),
    "AVATAR_DELETED": schema(AvatarDeletedEventType),
    "AVATAR_ORDERED": schema(AvatarOrderedEventType),
    "REMOTE_POSTING_ADDED": schema(RemotePostingAddedEventType),
    "REMOTE_POSTING_UPDATED": schema(RemotePostingUpdatedEventType),
    "REMOTE_POSTING_DELETED": schema(RemotePostingDeletedEventType),
    "TOKEN_ADDED": schema(TokenAddedEventType),
    "TOKEN_UPDATED": schema(TokenUpdatedEventType),
    "TOKEN_DELETED": schema(TokenDeletedEventType),
    "PLUGINS_UPDATED": schema(PluginsUpdatedEventType),
    "FRIEND_GROUP_ADDED": schema(FriendGroupAddedEventType),
    "FRIEND_GROUP_UPDATED": schema(FriendGroupUpdatedEventType),
    "FRIEND_GROUP_DELETED": schema(FriendGroupDeletedEventType),
    "FRIENDSHIP_UPDATED": schema(FriendshipUpdatedEventType),
    "ASK_SUBJECTS_CHANGED": schema(AskSubjectsChangedEventType),
    "REMOTE_FRIENDSHIP_UPDATED": schema(RemoteFriendshipUpdatedEventType),
    "BLOCKED_INSTANT_ADDED": schema(BlockedInstantAddedEventType),
    "BLOCKED_INSTANT_DELETED": schema(BlockedInstantDeletedEventType),
    "BLOCKED_USER_ADDED": schema(BlockedUserAddedEventType),
    "BLOCKED_USER_DELETED": schema(BlockedUserDeletedEventType),
    "BLOCKED_BY_USER_ADDED": schema(BlockedByUserAddedEventType),
    "BLOCKED_BY_USER_DELETED": schema(BlockedByUserDeletedEventType),
    "FEED_SHERIFF_DATA_UPDATED": schema(FeedSheriffDataUpdatedEventType),
    "SHERIFF_COMPLAIN_GROUP_ADDED": schema(SheriffComplainGroupAddedEventType),
    "SHERIFF_COMPLAIN_GROUP_UPDATED": schema(SheriffComplainGroupUpdatedEventType),
    "SHERIFF_COMPLAIN_ADDED": schema(SheriffComplainAddedEventType)
};

export const ALLOWED_SELF_EVENTS = new Set([
    "STORY_ADDED",
    "STORY_DELETED",
    "STORY_UPDATED",
    "FEED_STATUS_UPDATED",
    "NODE_NAME_CHANGED",
    "SUBSCRIBERS_TOTAL_CHANGED",
    "SUBSCRIPTIONS_TOTAL_CHANGED",
    "SUBSCRIPTION_ADDED",
    "SUBSCRIPTION_UPDATED",
    "SUBSCRIPTION_DELETED",
    "FRIEND_GROUP_ADDED",
    "FRIEND_GROUP_UPDATED",
    "FRIEND_GROUP_DELETED",
    "REMOTE_FRIENDSHIP_UPDATED",
    "FEED_SHERIFF_DATA_UPDATED",
    "SHERIFF_COMPLAIN_GROUP_ADDED",
    "SHERIFF_COMPLAIN_ADDED"
]);
