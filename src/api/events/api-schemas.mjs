// This file is generated for schema compiler only, do not use directly

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

        AskSubjectsChangedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
            },
            required: [
                "type",
            ],
            additionalProperties: false
        },

        AvatarAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "avatar": {
                    $ref: "node#/definitions/AvatarInfo"
                },
            },
            required: [
                "type",
                "avatar",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "mediaId",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "mediaId",
                "ordinal",
            ],
            additionalProperties: false
        },

        BlockedByUserAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "blockedByUser": {
                    $ref: "node#/definitions/BlockedByUserInfo"
                },
            },
            required: [
                "type",
                "blockedByUser",
            ],
            additionalProperties: false
        },

        BlockedByUserDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "blockedByUser": {
                    $ref: "node#/definitions/BlockedByUserInfo"
                },
            },
            required: [
                "type",
                "blockedByUser",
            ],
            additionalProperties: false
        },

        BlockedInstantAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "blockedInstant": {
                    $ref: "node#/definitions/BlockedInstantInfo"
                },
            },
            required: [
                "type",
                "blockedInstant",
            ],
            additionalProperties: false
        },

        BlockedInstantDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "blockedInstant": {
                    $ref: "node#/definitions/BlockedInstantInfo"
                },
            },
            required: [
                "type",
                "blockedInstant",
            ],
            additionalProperties: false
        },

        BlockedUserAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "blockedUser": {
                    $ref: "node#/definitions/BlockedUserInfo"
                },
            },
            required: [
                "type",
                "blockedUser",
            ],
            additionalProperties: false
        },

        BlockedUserDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "blockedUser": {
                    $ref: "node#/definitions/BlockedUserInfo"
                },
            },
            required: [
                "type",
                "blockedUser",
            ],
            additionalProperties: false
        },

        ClientSettingsChangedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
            },
            required: [
                "type",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "postingId",
                "moment",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "postingId",
                "moment",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "postingId",
                "moment",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "postingId",
                "moment",
            ],
            additionalProperties: false
        },

        DeleteNodeStatusUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "requested": {
                    type: "boolean"
                },
            },
            required: [
                "type",
                "requested",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "draftType",
                "receiverName",
                "receiverPostingId",
                "receiverCommentId",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "draftType",
                "receiverName",
                "receiverPostingId",
                "receiverCommentId",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "draftType",
                "receiverName",
                "receiverPostingId",
                "receiverCommentId",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "feedName",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "feedName",
                "status",
            ],
            additionalProperties: false
        },

        FriendGroupAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "friendGroup": {
                    $ref: "node#/definitions/FriendGroupInfo"
                },
            },
            required: [
                "type",
                "friendGroup",
            ],
            additionalProperties: false
        },

        FriendGroupDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "friendGroupId": {
                    type: "string"
                },
            },
            required: [
                "type",
                "friendGroupId",
            ],
            additionalProperties: false
        },

        FriendGroupUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "friendGroup": {
                    $ref: "node#/definitions/FriendGroupInfo"
                },
            },
            required: [
                "type",
                "friendGroup",
            ],
            additionalProperties: false
        },

        FriendshipUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "friend": {
                    $ref: "node#/definitions/FriendInfo"
                },
            },
            required: [
                "type",
                "friend",
            ],
            additionalProperties: false
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
                    anyOf: [
                        {
                            $ref: "node#/definitions/AvatarImage",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
            },
            required: [
                "type",
                "name",
            ],
            additionalProperties: false
        },

        NodeSettingsChangedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
            },
            required: [
                "type",
            ],
            additionalProperties: false
        },

        NodeSettingsMetaChangedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
            },
            required: [
                "type",
            ],
            additionalProperties: false
        },

        PingEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
            },
            required: [
                "type",
            ],
            additionalProperties: false
        },

        PluginsUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
            },
            required: [
                "type",
            ],
            additionalProperties: false
        },

        PostingAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "id": {
                    type: "string"
                },
            },
            required: [
                "type",
                "id",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "total",
            ],
            additionalProperties: false
        },

        PostingDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "id": {
                    type: "string"
                },
            },
            required: [
                "type",
                "id",
            ],
            additionalProperties: false
        },

        PostingReactionsChangedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "id": {
                    type: "string"
                },
            },
            required: [
                "type",
                "id",
            ],
            additionalProperties: false
        },

        PostingRestoredEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "id": {
                    type: "string"
                },
            },
            required: [
                "type",
                "id",
            ],
            additionalProperties: false
        },

        PostingUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "id": {
                    type: "string"
                },
            },
            required: [
                "type",
                "id",
            ],
            additionalProperties: false
        },

        ProfileUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
            },
            required: [
                "type",
            ],
            additionalProperties: false
        },

        RegisteredNameOperationStatusEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
            },
            required: [
                "type",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "remoteNodeName",
                "remotePostingId",
                "remoteCommentId",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "remoteNodeName",
                "remotePostingId",
                "remoteCommentId",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "remoteNodeName",
                "remotePostingId",
                "remoteCommentId",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "nodeName",
                "postingId",
                "commentId",
                "errorCode",
                "errorMessage",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "nodeName",
                "postingId",
                "commentId",
                "correct",
            ],
            additionalProperties: false
        },

        RemoteFriendshipUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "friendOf": {
                    $ref: "node#/definitions/FriendOfInfo"
                },
            },
            required: [
                "type",
                "friendOf",
            ],
            additionalProperties: false
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
                    anyOf: [
                        {
                            $ref: "node#/definitions/AvatarImage",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
            },
            required: [
                "type",
                "name",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "name",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "remoteNodeName",
                "remotePostingId",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "remoteNodeName",
                "remotePostingId",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "remoteNodeName",
                "remotePostingId",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "nodeName",
                "receiverName",
                "postingId",
                "revisionId",
                "errorCode",
                "errorMessage",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "nodeName",
                "receiverName",
                "postingId",
                "revisionId",
                "correct",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "remoteNodeName",
                "remotePostingId",
                "negative",
                "emoji",
                "createdAt",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "remoteNodeName",
                "remotePostingId",
            ],
            additionalProperties: false
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
                "commentId": {
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
                },
            },
            required: [
                "type",
                "id",
                "nodeName",
                "postingId",
                "commentId",
                "reactionOwnerName",
                "errorCode",
                "errorMessage",
            ],
            additionalProperties: false
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
                "commentId": {
                    type: "string"
                },
                "reactionOwnerName": {
                    type: "string"
                },
                "correct": {
                    type: "boolean"
                },
            },
            required: [
                "type",
                "id",
                "nodeName",
                "postingId",
                "commentId",
                "reactionOwnerName",
                "correct",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "complain",
                "groupId",
            ],
            additionalProperties: false
        },

        SheriffComplainGroupAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "group": {
                    $ref: "node#/definitions/SheriffComplainGroupInfo"
                },
            },
            required: [
                "type",
                "group",
            ],
            additionalProperties: false
        },

        SheriffComplainGroupUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "group": {
                    $ref: "node#/definitions/SheriffComplainGroupInfo"
                },
            },
            required: [
                "type",
                "group",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "feedName",
                "before",
            ],
            additionalProperties: false
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
                    anyOf: [
                        {
                            $ref: "node#/definitions/AvatarImage",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "summary": {
                    type: "string",
                    nullable: true
                },
                "summaryData": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/StorySummaryData",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
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
                    anyOf: [
                        {
                            $ref: "node#/definitions/StoryOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
            },
            required: [
                "type",
                "id",
                "storyType",
                "feedName",
                "publishedAt",
                "pinned",
                "moment",
            ],
            additionalProperties: false
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
                },
            },
            required: [
                "type",
                "id",
                "storyType",
                "feedName",
                "moment",
            ],
            additionalProperties: false
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
                    anyOf: [
                        {
                            $ref: "node#/definitions/AvatarImage",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "summary": {
                    type: "string",
                    nullable: true
                },
                "summaryData": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/StorySummaryData",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
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
                    anyOf: [
                        {
                            $ref: "node#/definitions/StoryOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
            },
            required: [
                "type",
                "id",
                "storyType",
                "feedName",
                "publishedAt",
                "pinned",
                "moment",
            ],
            additionalProperties: false
        },

        SubscribedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "sessionId": {
                    type: "string"
                },
            },
            required: [
                "type",
                "sessionId",
            ],
            additionalProperties: false
        },

        SubscriberAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "subscriber": {
                    $ref: "node#/definitions/SubscriberInfo"
                },
            },
            required: [
                "type",
                "subscriber",
            ],
            additionalProperties: false
        },

        SubscriberDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "subscriber": {
                    $ref: "node#/definitions/SubscriberInfo"
                },
            },
            required: [
                "type",
                "subscriber",
            ],
            additionalProperties: false
        },

        SubscriberUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "subscriber": {
                    $ref: "node#/definitions/SubscriberInfo"
                },
            },
            required: [
                "type",
                "subscriber",
            ],
            additionalProperties: false
        },

        SubscribersTotalChangedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "feedSubscribersTotal": {
                    type: "integer"
                },
            },
            required: [
                "type",
                "feedSubscribersTotal",
            ],
            additionalProperties: false
        },

        SubscriptionAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "subscription": {
                    $ref: "node#/definitions/SubscriptionInfo"
                },
            },
            required: [
                "type",
                "subscription",
            ],
            additionalProperties: false
        },

        SubscriptionDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "subscription": {
                    $ref: "node#/definitions/SubscriptionInfo"
                },
            },
            required: [
                "type",
                "subscription",
            ],
            additionalProperties: false
        },

        SubscriptionUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "subscription": {
                    $ref: "node#/definitions/SubscriptionInfo"
                },
            },
            required: [
                "type",
                "subscription",
            ],
            additionalProperties: false
        },

        SubscriptionsTotalChangedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "feedSubscriptionsTotal": {
                    type: "integer"
                },
            },
            required: [
                "type",
                "feedSubscriptionsTotal",
            ],
            additionalProperties: false
        },

        TokenAddedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "token": {
                    $ref: "node#/definitions/TokenInfo"
                },
            },
            required: [
                "type",
                "token",
            ],
            additionalProperties: false
        },

        TokenDeletedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "id": {
                    type: "string"
                },
            },
            required: [
                "type",
                "id",
            ],
            additionalProperties: false
        },

        TokenUpdatedEvent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "token": {
                    $ref: "node#/definitions/TokenInfo"
                },
            },
            required: [
                "type",
                "token",
            ],
            additionalProperties: false
        },

    }
}
