// This file is for schema compiler only, do not use directly

export const EVENT_SCHEMAS = {
    $id: "event",
    definitions: {
        EventPacket: {
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
        },

        PingEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                }
            },
            additionalProperties: false,
            required: ["type"]
        },

        ProfileUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                }
            },
            additionalProperties: false,
            required: ["type"]
        },

        NodeSettingsMetaChangedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                }
            },
            additionalProperties: false,
            required: ["type"]
        },

        NodeSettingsChangedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                }
            },
            additionalProperties: false,
            required: ["type"]
        },

        ClientSettingsChangedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                }
            },
            additionalProperties: false,
            required: ["type"]
        },

        PostingAddedEvent: {
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
        },

        PostingUpdatedEvent: {
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
        },

        PostingDeletedEvent: {
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
        },

        PostingRestoredEvent: {
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
        },

        PostingReactionsChangedEvent: {
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
        },

        PostingCommentsChangedEvent: {
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
        },

        RegisteredNameOperationStatusEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                }
            },
            additionalProperties: false,
            required: ["type"]
        },

        NodeNameChangedEvent: {
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
                    $ref: "node#/definitions/AvatarImage",
                    type: "object",
                    nullable: true
                }
            },
            additionalProperties: false,
            required: ["type", "name"]
        },

        RemotePostingVerifiedEvent: {
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
        },

        RemotePostingVerificationFailedEvent: {
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
        },

        RemoteReactionAddedEvent: {
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
        },

        RemoteReactionDeletedEvent: {
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
        },

        RemoteReactionVerifiedEvent: {
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
        },

        RemoteReactionVerificationFailedEvent: {
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
        },

        DraftAddedEvent: {
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
        },

        DraftUpdatedEvent: {
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
        },

        DraftDeletedEvent: {
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
        },

        StoryAddedEvent: {
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
                    $ref: "node#/definitions/AvatarImage",
                    type: "object",
                    nullable: true
                },
                "summary": {
                    type: "string",
                    nullable: true
                },
                "summaryData": {
                    $ref: "node#/definitions/StorySummaryData",
                    type: "object",
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
        },

        StoryDeletedEvent: {
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
        },

        StoryUpdatedEvent: {
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
                    $ref: "node#/definitions/AvatarImage",
                    type: "object",
                    nullable: true
                },
                "summary": {
                    type: "string",
                    nullable: true
                },
                "summaryData": {
                    $ref: "node#/definitions/StorySummaryData",
                    type: "object",
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
        },

        FeedStatusUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "feedName": {
                    type: "string"
                },
                "status": {
                    $ref: "node#/definitions/FeedStatus"
                }
            },
            additionalProperties: false,
            required: ["type", "feedName", "status"]
        },

        StoriesStatusUpdatedEvent: {
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
        },

        SubscriberAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "subscriber": {
                    $ref: "node#/definitions/SubscriberInfo"
                }
            },
            additionalProperties: false,
            required: ["subscriber"]
        },

        SubscriberUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "subscriber": {
                    $ref: "node#/definitions/SubscriberInfo"
                }
            },
            additionalProperties: false,
            required: ["subscriber"]
        },

        SubscriberDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "subscriber": {
                    $ref: "node#/definitions/SubscriberInfo"
                }
            },
            additionalProperties: false,
            required: ["subscriber"]
        },

        SubscriptionAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "subscription": {
                    $ref: "node#/definitions/SubscriptionInfo"
                }
            },
            additionalProperties: false,
            required: ["subscription"]
        },

        SubscriptionUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "subscription": {
                    $ref: "node#/definitions/SubscriptionInfo"
                }
            },
            additionalProperties: false,
            required: ["subscription"]
        },

        SubscriptionDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "subscription": {
                    $ref: "node#/definitions/SubscriptionInfo"
                }
            },
            additionalProperties: false,
            required: ["subscription"]
        },

        CommentAddedEvent: {
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
        },

        CommentUpdatedEvent: {
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
        },

        CommentDeletedEvent: {
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
        },

        CommentReactionsChangedEvent: {
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
        },

        RemoteCommentAddedEvent: {
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
        },

        RemoteCommentUpdatedEvent: {
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
        },

        RemoteCommentDeletedEvent: {
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
        },

        RemoteCommentVerifiedEvent: {
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
        },

        RemoteCommentVerificationFailedEvent: {
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
        },

        RemoteNodeFullNameChangedEvent: {
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
        },

        SubscribersTotalChangedEvent: {
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
        },

        SubscriptionsTotalChangedEvent: {
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
        },

        RemoteNodeAvatarChangedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "name": {
                    type: "string"
                },
                "avatar": {
                    $ref: "node#/definitions/AvatarImage",
                    type: "object",
                    nullable: true
                }
            },
            additionalProperties: false,
            required: ["type", "name"]
        },

        AvatarAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "avatar": {
                    $ref: "node#/definitions/AvatarInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "avatar"]
        },

        AvatarDeletedEvent: {
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
        },

        AvatarOrderedEvent: {
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
        },

        RemotePostingAddedEvent: {
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
        },

        RemotePostingUpdatedEvent: {
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
        },

        RemotePostingDeletedEvent: {
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
        },

        TokenAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "token": {
                    $ref: "node#/definitions/TokenInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "token"]
        },

        TokenUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "token": {
                    $ref: "node#/definitions/TokenInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "token"]
        },

        TokenDeletedEvent: {
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
        },

        PluginsUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                }
            },
            additionalProperties: false,
            required: ["type"]
        },

        FriendGroupAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "friendGroup": {
                    $ref: "node#/definitions/FriendGroupInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "friendGroup"]
        },

        FriendGroupUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "friendGroup": {
                    $ref: "node#/definitions/FriendGroupInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "friendGroup"]
        },

        FriendGroupDeletedEvent: {
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
        },

        FriendshipUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "friend": {
                    $ref: "node#/definitions/FriendInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "friend"]
        },

        AskSubjectsChangedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                }
            },
            additionalProperties: false,
            required: ["type"]
        },

        RemoteFriendshipUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "friendOf": {
                    $ref: "node#/definitions/FriendOfInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "friendOf"]
        },

        BlockedInstantAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "blockedInstant": {
                    $ref: "node#/definitions/BlockedInstantInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "blockedInstant"]
        },

        BlockedInstantDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "blockedInstant": {
                    $ref: "node#/definitions/BlockedInstantInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "blockedInstant"]
        },

        BlockedUserAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "blockedUser": {
                    $ref: "node#/definitions/BlockedUserInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "blockedUser"]
        },

        BlockedUserDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "blockedUser": {
                    $ref: "node#/definitions/BlockedUserInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "blockedUser"]
        },

        BlockedByUserAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "blockedByUser": {
                    $ref: "node#/definitions/BlockedByUserInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "blockedByUser"]
        },

        BlockedByUserDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "blockedByUser": {
                    $ref: "node#/definitions/BlockedByUserInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "blockedByUser"]
        },

        FeedSheriffDataUpdatedEvent: {
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
                    items: {
                        $ref: "node#/definitions/SheriffMark"
                    },
                    nullable: true
                }
            },
            additionalProperties: false,
            required: ["type", "feedName"]
        },

        SheriffComplainGroupAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "group": {
                    $ref: "node#/definitions/SheriffComplainGroupInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "group"]
        },

        SheriffComplainGroupUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "group": {
                    $ref: "node#/definitions/SheriffComplainGroupInfo"
                }
            },
            additionalProperties: false,
            required: ["type", "group"]
        },

        SheriffComplainAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "complain": {
                    $ref: "node#/definitions/SheriffComplainInfo"
                },
                "groupId": {
                    type: "string"
                }
            },
            additionalProperties: false,
            required: ["type", "complain", "groupId"]
        }
    }
};
