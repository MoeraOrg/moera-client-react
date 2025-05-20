// This file is generated for schema compiler only, do not use directly

export const NODE_API_SCHEMAS = {
    $id: "node",
    definitions: {

        CommentOperations: {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                },
                "edit": {
                    type: "string",
                    nullable: true
                },
                "delete": {
                    type: "string",
                    nullable: true
                },
                "viewReactions": {
                    type: "string",
                    nullable: true
                },
                "viewNegativeReactions": {
                    type: "string",
                    nullable: true
                },
                "viewReactionTotals": {
                    type: "string",
                    nullable: true
                },
                "viewNegativeReactionTotals": {
                    type: "string",
                    nullable: true
                },
                "viewReactionRatios": {
                    type: "string",
                    nullable: true
                },
                "viewNegativeReactionRatios": {
                    type: "string",
                    nullable: true
                },
                "addReaction": {
                    type: "string",
                    nullable: true
                },
                "addNegativeReaction": {
                    type: "string",
                    nullable: true
                },
                "overrideReaction": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        ContactOperations: {
            type: "object",
            properties: {
                "viewFeedSubscriber": {
                    type: "string",
                    nullable: true
                },
                "viewFeedSubscription": {
                    type: "string",
                    nullable: true
                },
                "viewFriend": {
                    type: "string",
                    nullable: true
                },
                "viewFriendOf": {
                    type: "string",
                    nullable: true
                },
                "viewBlock": {
                    type: "string",
                    nullable: true
                },
                "viewBlockBy": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        FeedOperations: {
            type: "object",
            properties: {
                "add": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        FriendOperations: {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        FriendGroupOperations: {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        NodeNameOperations: {
            type: "object",
            properties: {
                "manage": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        PeopleOperations: {
            type: "object",
            properties: {
                "viewSubscribers": {
                    type: "string",
                    nullable: true
                },
                "viewSubscriptions": {
                    type: "string",
                    nullable: true
                },
                "viewFriends": {
                    type: "string",
                    nullable: true
                },
                "viewFriendOfs": {
                    type: "string",
                    nullable: true
                },
                "viewBlocked": {
                    type: "string",
                    nullable: true
                },
                "viewBlockedBy": {
                    type: "string",
                    nullable: true
                },
                "viewSubscribersTotal": {
                    type: "string",
                    nullable: true
                },
                "viewSubscriptionsTotal": {
                    type: "string",
                    nullable: true
                },
                "viewFriendsTotal": {
                    type: "string",
                    nullable: true
                },
                "viewFriendOfsTotal": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        PostingOperations: {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                },
                "edit": {
                    type: "string",
                    nullable: true
                },
                "delete": {
                    type: "string",
                    nullable: true
                },
                "viewComments": {
                    type: "string",
                    nullable: true
                },
                "addComment": {
                    type: "string",
                    nullable: true
                },
                "overrideComment": {
                    type: "string",
                    nullable: true
                },
                "viewReactions": {
                    type: "string",
                    nullable: true
                },
                "viewNegativeReactions": {
                    type: "string",
                    nullable: true
                },
                "viewReactionTotals": {
                    type: "string",
                    nullable: true
                },
                "viewNegativeReactionTotals": {
                    type: "string",
                    nullable: true
                },
                "viewReactionRatios": {
                    type: "string",
                    nullable: true
                },
                "viewNegativeReactionRatios": {
                    type: "string",
                    nullable: true
                },
                "addReaction": {
                    type: "string",
                    nullable: true
                },
                "addNegativeReaction": {
                    type: "string",
                    nullable: true
                },
                "overrideReaction": {
                    type: "string",
                    nullable: true
                },
                "overrideCommentReaction": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        PrivateMediaFileOperations: {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        ProfileOperations: {
            type: "object",
            properties: {
                "edit": {
                    type: "string",
                    nullable: true
                },
                "viewEmail": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        ReactionOperations: {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                },
                "delete": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        SearchEntryOperations: {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        StoryOperations: {
            type: "object",
            properties: {
                "edit": {
                    type: "string",
                    nullable: true
                },
                "delete": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        SubscriberOperations: {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                },
                "delete": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        SubscriptionOperations: {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                },
                "delete": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        AcceptedReactions: {
            type: "object",
            properties: {
                "positive": {
                    type: "string"
                },
                "negative": {
                    type: "string"
                },
            },
            required: [
                "positive",
                "negative",
            ],
            additionalProperties: false
        },

        AsyncOperationCreated: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
            },
            required: [
                "id",
            ],
            additionalProperties: false
        },

        AvatarImage: {
            type: "object",
            properties: {
                "mediaId": {
                    type: "string"
                },
                "path": {
                    type: "string"
                },
                "width": {
                    type: "integer",
                    nullable: true
                },
                "height": {
                    type: "integer",
                    nullable: true
                },
                "shape": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "mediaId",
                "path",
            ],
            additionalProperties: false
        },

        AvatarInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "mediaId": {
                    type: "string"
                },
                "path": {
                    type: "string"
                },
                "width": {
                    type: "integer",
                    nullable: true
                },
                "height": {
                    type: "integer",
                    nullable: true
                },
                "shape": {
                    type: "string",
                    nullable: true
                },
                "ordinal": {
                    type: "integer"
                },
            },
            required: [
                "id",
                "mediaId",
                "path",
                "ordinal",
            ],
            additionalProperties: false
        },

        AvatarInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/AvatarInfo"
            }
        },

        AvatarOrdinal: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "ordinal": {
                    type: "integer"
                },
            },
            required: [
                "id",
                "ordinal",
            ],
            additionalProperties: false
        },

        AvatarOrdinalArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/AvatarOrdinal"
            }
        },

        BlockedInstantInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "storyType": {
                    type: "string"
                },
                "entryId": {
                    type: "string",
                    nullable: true
                },
                "remoteNodeName": {
                    type: "string",
                    nullable: true
                },
                "remotePostingId": {
                    type: "string",
                    nullable: true
                },
                "remoteOwnerName": {
                    type: "string",
                    nullable: true
                },
                "createdAt": {
                    type: "integer"
                },
                "deadline": {
                    type: "integer",
                    nullable: true
                },
            },
            required: [
                "id",
                "storyType",
                "createdAt",
            ],
            additionalProperties: false
        },

        BlockedInstantInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/BlockedInstantInfo"
            }
        },

        BlockedPostingInstantInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "storyType": {
                    type: "string"
                },
                "remoteOwnerName": {
                    type: "string",
                    nullable: true
                },
                "deadline": {
                    type: "integer",
                    nullable: true
                },
            },
            required: [
                "id",
                "storyType",
            ],
            additionalProperties: false
        },

        BlockedUsersChecksums: {
            type: "object",
            properties: {
                "visibility": {
                    type: "integer"
                },
            },
            required: [
                "visibility",
            ],
            additionalProperties: false
        },

        CarteInfo: {
            type: "object",
            properties: {
                "carte": {
                    type: "string"
                },
                "beginning": {
                    type: "integer"
                },
                "deadline": {
                    type: "integer"
                },
                "nodeName": {
                    type: "string",
                    nullable: true
                },
                "clientScope": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                },
                "adminScope": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                },
            },
            required: [
                "carte",
                "beginning",
                "deadline",
            ],
            additionalProperties: false
        },

        CarteSet: {
            type: "object",
            properties: {
                "cartesIp": {
                    type: "string",
                    nullable: true
                },
                "cartes": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/CarteInfo"
                    }
                },
                "createdAt": {
                    type: "integer"
                },
            },
            required: [
                "cartes",
                "createdAt",
            ],
            additionalProperties: false
        },

        CarteVerificationInfo: {
            type: "object",
            properties: {
                "valid": {
                    type: "boolean"
                },
                "clientName": {
                    type: "string",
                    nullable: true
                },
                "clientScope": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                },
                "adminScope": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                },
                "errorCode": {
                    type: "string",
                    nullable: true
                },
                "errorMessage": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "valid",
            ],
            additionalProperties: false
        },

        ClientReactionInfo: {
            type: "object",
            properties: {
                "negative": {
                    type: "boolean"
                },
                "emoji": {
                    type: "integer"
                },
                "createdAt": {
                    type: "integer"
                },
                "deadline": {
                    type: "integer",
                    nullable: true
                },
            },
            required: [
                "negative",
                "emoji",
                "createdAt",
            ],
            additionalProperties: false
        },

        CommentTotalInfo: {
            type: "object",
            properties: {
                "total": {
                    type: "integer"
                },
            },
            required: [
                "total",
            ],
            additionalProperties: false
        },

        ContactInfo: {
            type: "object",
            properties: {
                "nodeName": {
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
                "distance": {
                    type: "number"
                },
                "hasFeedSubscriber": {
                    type: "boolean",
                    nullable: true
                },
                "hasFeedSubscription": {
                    type: "boolean",
                    nullable: true
                },
                "hasFriend": {
                    type: "boolean",
                    nullable: true
                },
                "hasFriendOf": {
                    type: "boolean",
                    nullable: true
                },
                "hasBlock": {
                    type: "boolean",
                    nullable: true
                },
                "hasBlockBy": {
                    type: "boolean",
                    nullable: true
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ContactOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "ownerOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ContactOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "adminOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ContactOperations",
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
                "nodeName",
                "distance",
            ],
            additionalProperties: false
        },

        ContactInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/ContactInfo"
            }
        },

        CredentialsCreated: {
            type: "object",
            properties: {
                "created": {
                    type: "boolean"
                },
            },
            required: [
                "created",
            ],
            additionalProperties: false
        },

        DeleteNodeStatus: {
            type: "object",
            properties: {
                "requested": {
                    type: "boolean"
                },
            },
            required: [
                "requested",
            ],
            additionalProperties: false
        },

        DomainAvailable: {
            type: "object",
            properties: {
                "name": {
                    type: "string"
                },
            },
            required: [
                "name",
            ],
            additionalProperties: false
        },

        DomainInfo: {
            type: "object",
            properties: {
                "name": {
                    type: "string"
                },
                "nodeId": {
                    type: "string"
                },
                "createdAt": {
                    type: "integer"
                },
            },
            required: [
                "name",
                "nodeId",
                "createdAt",
            ],
            additionalProperties: false
        },

        DomainInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/DomainInfo"
            }
        },

        EmailHint: {
            type: "object",
            properties: {
                "emailHint": {
                    type: "string"
                },
            },
            required: [
                "emailHint",
            ],
            additionalProperties: false
        },

        FeedReference: {
            type: "object",
            properties: {
                "feedName": {
                    type: "string"
                },
                "publishedAt": {
                    type: "integer"
                },
                "pinned": {
                    type: "boolean",
                    nullable: true
                },
                "moment": {
                    type: "integer"
                },
                "storyId": {
                    type: "string"
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
                "feedName",
                "publishedAt",
                "moment",
                "storyId",
            ],
            additionalProperties: false
        },

        FeedStatus: {
            type: "object",
            properties: {
                "total": {
                    type: "integer"
                },
                "totalPinned": {
                    type: "integer"
                },
                "lastMoment": {
                    type: "integer",
                    nullable: true
                },
                "notViewed": {
                    type: "integer",
                    nullable: true
                },
                "notRead": {
                    type: "integer",
                    nullable: true
                },
                "notViewedMoment": {
                    type: "integer",
                    nullable: true
                },
                "notReadMoment": {
                    type: "integer",
                    nullable: true
                },
            },
            required: [
                "total",
                "totalPinned",
            ],
            additionalProperties: false
        },

        FeedWithStatus: {
            type: "object",
            properties: {
                "feedName": {
                    type: "string"
                },
                "notViewed": {
                    type: "integer"
                },
                "notRead": {
                    type: "integer"
                },
                "notViewedMoment": {
                    type: "integer",
                    nullable: true
                },
                "notReadMoment": {
                    type: "integer",
                    nullable: true
                },
            },
            required: [
                "feedName",
                "notViewed",
                "notRead",
            ],
            additionalProperties: false
        },

        FriendGroupDetails: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "title": {
                    type: "string",
                    nullable: true
                },
                "addedAt": {
                    type: "integer"
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/FriendOperations",
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
                "id",
                "addedAt",
            ],
            additionalProperties: false
        },

        FriendGroupInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "title": {
                    type: "string",
                    nullable: true
                },
                "createdAt": {
                    type: "integer"
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/FriendGroupOperations",
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
                "id",
                "createdAt",
            ],
            additionalProperties: false
        },

        FriendGroupInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/FriendGroupInfo"
            }
        },

        FriendGroupsFeatures: {
            type: "object",
            properties: {
                "available": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/FriendGroupInfo"
                    }
                },
                "memberOf": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/FriendGroupDetails"
                    },
                    nullable: true
                },
            },
            required: [
                "available",
            ],
            additionalProperties: false
        },

        FriendInfo: {
            type: "object",
            properties: {
                "nodeName": {
                    type: "string"
                },
                "contact": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ContactInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "groups": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/FriendGroupDetails"
                    },
                    nullable: true
                },
            },
            required: [
                "nodeName",
            ],
            additionalProperties: false
        },

        FriendInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/FriendInfo"
            }
        },

        FriendOfInfo: {
            type: "object",
            properties: {
                "remoteNodeName": {
                    type: "string"
                },
                "contact": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ContactInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "groups": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/FriendGroupDetails"
                    },
                    nullable: true
                },
            },
            required: [
                "remoteNodeName",
            ],
            additionalProperties: false
        },

        FriendOfInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/FriendOfInfo"
            }
        },

        FundraiserInfo: {
            type: "object",
            properties: {
                "title": {
                    type: "string"
                },
                "qrCode": {
                    type: "string",
                    nullable: true
                },
                "text": {
                    type: "string",
                    nullable: true
                },
                "href": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "title",
            ],
            additionalProperties: false
        },

        GrantInfo: {
            type: "object",
            properties: {
                "nodeName": {
                    type: "string"
                },
                "scope": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
            },
            required: [
                "nodeName",
                "scope",
            ],
            additionalProperties: false
        },

        GrantInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/GrantInfo"
            }
        },

        KeyMnemonic: {
            type: "object",
            properties: {
                "mnemonic": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
            },
            required: [
                "mnemonic",
            ],
            additionalProperties: false
        },

        LinkPreview: {
            type: "object",
            properties: {
                "siteName": {
                    type: "string",
                    nullable: true
                },
                "url": {
                    type: "string",
                    nullable: true
                },
                "title": {
                    type: "string",
                    nullable: true
                },
                "description": {
                    type: "string",
                    nullable: true
                },
                "imageHash": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        LinkPreviewInfo: {
            type: "object",
            properties: {
                "siteName": {
                    type: "string",
                    nullable: true
                },
                "url": {
                    type: "string",
                    nullable: true
                },
                "title": {
                    type: "string",
                    nullable: true
                },
                "description": {
                    type: "string",
                    nullable: true
                },
                "imageUrl": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        MediaFilePreviewInfo: {
            type: "object",
            properties: {
                "targetWidth": {
                    type: "integer"
                },
                "directPath": {
                    type: "string",
                    nullable: true
                },
                "width": {
                    type: "integer"
                },
                "height": {
                    type: "integer"
                },
                "original": {
                    type: "boolean",
                    nullable: true
                },
            },
            required: [
                "targetWidth",
                "width",
                "height",
            ],
            additionalProperties: false
        },

        NodeNameInfo: {
            type: "object",
            properties: {
                "name": {
                    type: "string",
                    nullable: true
                },
                "operationStatus": {
                    type: "string",
                    nullable: true
                },
                "operationStatusUpdated": {
                    type: "integer",
                    nullable: true
                },
                "operationErrorCode": {
                    type: "string",
                    nullable: true
                },
                "operationErrorMessage": {
                    type: "string",
                    nullable: true
                },
                "storedMnemonic": {
                    type: "boolean",
                    nullable: true
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/NodeNameOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
            },
            additionalProperties: false
        },

        PeopleGeneralInfo: {
            type: "object",
            properties: {
                "feedSubscribersTotal": {
                    type: "integer",
                    nullable: true
                },
                "feedSubscriptionsTotal": {
                    type: "integer",
                    nullable: true
                },
                "friendsTotal": {
                    type: "object",
                    patternProperties: {
                        "^.*$": {
                            type: "integer"
                        }
                    },
                    nullable: true
                },
                "friendOfsTotal": {
                    type: "integer",
                    nullable: true
                },
                "blockedTotal": {
                    type: "integer",
                    nullable: true
                },
                "blockedByTotal": {
                    type: "integer",
                    nullable: true
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/PeopleOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
            },
            additionalProperties: false
        },

        PostingFeatures: {
            type: "object",
            properties: {
                "post": {
                    type: "boolean",
                    nullable: true
                },
                "subjectPresent": {
                    type: "boolean"
                },
                "sourceFormats": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                "mediaMaxSize": {
                    type: "integer"
                },
                "imageRecommendedSize": {
                    type: "integer"
                },
                "imageRecommendedPixels": {
                    type: "integer"
                },
                "imageFormats": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
            },
            required: [
                "subjectPresent",
                "sourceFormats",
                "mediaMaxSize",
                "imageRecommendedSize",
                "imageRecommendedPixels",
                "imageFormats",
            ],
            additionalProperties: false
        },

        PostingSourceInfo: {
            type: "object",
            properties: {
                "nodeName": {
                    type: "string"
                },
                "fullName": {
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
                "feedName": {
                    type: "string"
                },
                "postingId": {
                    type: "string"
                },
                "createdAt": {
                    type: "integer"
                },
            },
            required: [
                "nodeName",
                "feedName",
                "postingId",
                "createdAt",
            ],
            additionalProperties: false
        },

        PrivateMediaFileInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "hash": {
                    type: "string"
                },
                "path": {
                    type: "string"
                },
                "directPath": {
                    type: "string",
                    nullable: true
                },
                "mimeType": {
                    type: "string"
                },
                "width": {
                    type: "integer",
                    default: 0
                },
                "height": {
                    type: "integer",
                    default: 0
                },
                "orientation": {
                    type: "integer",
                    default: 1
                },
                "size": {
                    type: "integer"
                },
                "postingId": {
                    type: "string",
                    nullable: true
                },
                "previews": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/MediaFilePreviewInfo"
                    },
                    nullable: true
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/PrivateMediaFileOperations",
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
                "id",
                "hash",
                "path",
                "mimeType",
                "width",
                "height",
                "orientation",
                "size",
            ],
            additionalProperties: false
        },

        ProfileInfo: {
            type: "object",
            properties: {
                "fullName": {
                    type: "string",
                    nullable: true
                },
                "gender": {
                    type: "string",
                    nullable: true
                },
                "email": {
                    type: "string",
                    nullable: true
                },
                "title": {
                    type: "string",
                    nullable: true
                },
                "bioSrc": {
                    type: "string",
                    nullable: true
                },
                "bioSrcFormat": {
                    type: "string",
                    nullable: true
                },
                "bioHtml": {
                    type: "string",
                    nullable: true
                },
                "avatar": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/AvatarInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "fundraisers": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/FundraiserInfo"
                    },
                    nullable: true
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ProfileOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
            },
            additionalProperties: false
        },

        PublicMediaFileInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "path": {
                    type: "string"
                },
                "width": {
                    type: "integer",
                    default: 0
                },
                "height": {
                    type: "integer",
                    default: 0
                },
                "orientation": {
                    type: "integer",
                    default: 1
                },
                "size": {
                    type: "integer"
                },
            },
            required: [
                "id",
                "path",
                "width",
                "height",
                "orientation",
                "size",
            ],
            additionalProperties: false
        },

        ReactionInfo: {
            type: "object",
            properties: {
                "ownerName": {
                    type: "string",
                    nullable: true
                },
                "ownerFullName": {
                    type: "string",
                    nullable: true
                },
                "ownerGender": {
                    type: "string",
                    nullable: true
                },
                "ownerAvatar": {
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
                "postingId": {
                    type: "string",
                    nullable: true
                },
                "postingRevisionId": {
                    type: "string",
                    nullable: true
                },
                "commentId": {
                    type: "string",
                    nullable: true
                },
                "commentRevisionId": {
                    type: "string",
                    nullable: true
                },
                "negative": {
                    type: "boolean",
                    nullable: true
                },
                "emoji": {
                    type: "integer",
                    nullable: true
                },
                "moment": {
                    type: "integer",
                    nullable: true
                },
                "createdAt": {
                    type: "integer",
                    nullable: true
                },
                "deadline": {
                    type: "integer",
                    nullable: true
                },
                "signature": {
                    type: "string",
                    nullable: true
                },
                "signatureVersion": {
                    type: "integer",
                    nullable: true
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ReactionOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "ownerOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ReactionOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "seniorOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ReactionOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "majorOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ReactionOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
            },
            additionalProperties: false
        },

        ReactionInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/ReactionInfo"
            }
        },

        ReactionsSliceInfo: {
            type: "object",
            properties: {
                "before": {
                    type: "integer"
                },
                "after": {
                    type: "integer"
                },
                "total": {
                    type: "integer"
                },
                "reactions": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/ReactionInfo"
                    }
                },
            },
            required: [
                "before",
                "after",
                "total",
                "reactions",
            ],
            additionalProperties: false
        },

        ReactionTotalInfo: {
            type: "object",
            properties: {
                "emoji": {
                    type: "integer"
                },
                "total": {
                    type: "integer",
                    nullable: true
                },
                "share": {
                    type: "number",
                    nullable: true,
                    minimum: 0,
                    maximum: 1
                },
            },
            required: [
                "emoji",
            ],
            additionalProperties: false
        },

        ReactionTotalsInfo: {
            type: "object",
            properties: {
                "entryId": {
                    type: "string"
                },
                "positive": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/ReactionTotalInfo"
                    },
                    default: []
                },
                "negative": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/ReactionTotalInfo"
                    },
                    default: []
                },
            },
            required: [
                "entryId",
                "positive",
                "negative",
            ],
            additionalProperties: false
        },

        ReactionTotalsInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/ReactionTotalsInfo"
            }
        },

        RegisteredNameSecret: {
            type: "object",
            properties: {
                "name": {
                    type: "string"
                },
                "mnemonic": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true,
                    minItems: 24,
                    maxItems: 24
                },
                "secret": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "name",
            ],
            additionalProperties: false
        },

        RemoteMediaInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "hash": {
                    type: "string",
                    nullable: true
                },
                "digest": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "id",
            ],
            additionalProperties: false
        },

        RemotePostingVerificationInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "nodeName": {
                    type: "string"
                },
                "postingId": {
                    type: "string"
                },
                "revisionId": {
                    type: "string",
                    nullable: true
                },
                "status": {
                    type: "string",
                    nullable: true
                },
                "errorCode": {
                    type: "string",
                    nullable: true
                },
                "errorMessage": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "id",
                "nodeName",
                "postingId",
            ],
            additionalProperties: false
        },

        RemoteReactionVerificationInfo: {
            type: "object",
            properties: {
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
                "status": {
                    type: "string",
                    nullable: true
                },
                "errorCode": {
                    type: "string",
                    nullable: true
                },
                "errorMessage": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "id",
                "nodeName",
                "postingId",
                "reactionOwnerName",
            ],
            additionalProperties: false
        },

        RepliedTo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "revisionId": {
                    type: "string",
                    nullable: true
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
                "heading": {
                    type: "string",
                    nullable: true
                },
                "digest": {
                    type: "string"
                },
            },
            required: [
                "id",
                "name",
                "digest",
            ],
            additionalProperties: false
        },

        Result: {
            type: "object",
            properties: {
                "errorCode": {
                    type: "string"
                },
                "message": {
                    type: "string",
                    default: ""
                },
            },
            required: [
                "errorCode",
                "message",
            ],
            additionalProperties: false
        },

        SheriffMark: {
            type: "object",
            properties: {
                "sheriffName": {
                    type: "string"
                },
            },
            required: [
                "sheriffName",
            ],
            additionalProperties: false
        },

        SearchNodeInfo: {
            type: "object",
            properties: {
                "nodeName": {
                    type: "string"
                },
                "fullName": {
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
                "distance": {
                    type: "number"
                },
            },
            required: [
                "nodeName",
                "distance",
            ],
            additionalProperties: false
        },

        SearchNodeInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/SearchNodeInfo"
            }
        },

        SearchNodePageInfo: {
            type: "object",
            properties: {
                "page": {
                    type: "integer"
                },
                "total": {
                    type: "integer"
                },
                "nodes": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/SearchNodeInfo"
                    }
                },
            },
            required: [
                "page",
                "total",
                "nodes",
            ],
            additionalProperties: false
        },

        SearchRepliedTo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "revisionId": {
                    type: "string",
                    nullable: true
                },
                "name": {
                    type: "string"
                },
                "fullName": {
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
                "heading": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "id",
                "name",
            ],
            additionalProperties: false
        },

        SettingInfo: {
            type: "object",
            properties: {
                "name": {
                    type: "string"
                },
                "value": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "name",
            ],
            additionalProperties: false
        },

        SettingInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/SettingInfo"
            }
        },

        SettingTypeModifiers: {
            type: "object",
            properties: {
                "format": {
                    type: "string",
                    nullable: true
                },
                "min": {
                    type: "string",
                    nullable: true
                },
                "max": {
                    type: "string",
                    nullable: true
                },
                "multiline": {
                    type: "boolean",
                    nullable: true
                },
                "never": {
                    type: "boolean",
                    nullable: true
                },
                "always": {
                    type: "boolean",
                    nullable: true
                },
                "principals": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                },
            },
            additionalProperties: false
        },

        SheriffComplaintGroupInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "remoteNodeName": {
                    type: "string"
                },
                "remoteNodeFullName": {
                    type: "string",
                    nullable: true
                },
                "remoteFeedName": {
                    type: "string"
                },
                "remotePostingId": {
                    type: "string",
                    nullable: true
                },
                "remotePostingRevisionId": {
                    type: "string",
                    nullable: true
                },
                "remotePostingOwnerName": {
                    type: "string",
                    nullable: true
                },
                "remotePostingOwnerFullName": {
                    type: "string",
                    nullable: true
                },
                "remotePostingOwnerGender": {
                    type: "string",
                    nullable: true
                },
                "remotePostingHeading": {
                    type: "string",
                    nullable: true
                },
                "remoteCommentId": {
                    type: "string",
                    nullable: true
                },
                "remoteCommentRevisionId": {
                    type: "string",
                    nullable: true
                },
                "remoteCommentOwnerName": {
                    type: "string",
                    nullable: true
                },
                "remoteCommentOwnerFullName": {
                    type: "string",
                    nullable: true
                },
                "remoteCommentOwnerGender": {
                    type: "string",
                    nullable: true
                },
                "remoteCommentHeading": {
                    type: "string",
                    nullable: true
                },
                "createdAt": {
                    type: "integer"
                },
                "moment": {
                    type: "integer"
                },
                "status": {
                    type: "string"
                },
                "decisionCode": {
                    type: "string",
                    nullable: true
                },
                "decisionDetails": {
                    type: "string",
                    nullable: true
                },
                "decidedAt": {
                    type: "integer",
                    nullable: true
                },
                "anonymous": {
                    type: "boolean",
                    nullable: true
                },
            },
            required: [
                "id",
                "remoteNodeName",
                "remoteFeedName",
                "createdAt",
                "moment",
                "status",
            ],
            additionalProperties: false
        },

        SheriffComplaintGroupsSliceInfo: {
            type: "object",
            properties: {
                "before": {
                    type: "integer"
                },
                "after": {
                    type: "integer"
                },
                "groups": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/SheriffComplaintGroupInfo"
                    }
                },
                "total": {
                    type: "integer"
                },
                "totalInPast": {
                    type: "integer"
                },
                "totalInFuture": {
                    type: "integer"
                },
            },
            required: [
                "before",
                "after",
                "groups",
                "total",
                "totalInPast",
                "totalInFuture",
            ],
            additionalProperties: false
        },

        SheriffComplaintInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "ownerName": {
                    type: "string"
                },
                "ownerFullName": {
                    type: "string",
                    nullable: true
                },
                "ownerGender": {
                    type: "string",
                    nullable: true
                },
                "group": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/SheriffComplaintGroupInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "reasonCode": {
                    type: "string"
                },
                "reasonDetails": {
                    type: "string",
                    nullable: true
                },
                "anonymousRequested": {
                    type: "boolean",
                    nullable: true
                },
                "createdAt": {
                    type: "integer"
                },
            },
            required: [
                "id",
                "ownerName",
                "reasonCode",
                "createdAt",
            ],
            additionalProperties: false
        },

        SheriffComplaintInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/SheriffComplaintInfo"
            }
        },

        SheriffOrderInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "delete": {
                    type: "boolean",
                    nullable: true
                },
                "sheriffName": {
                    type: "string"
                },
                "nodeName": {
                    type: "string"
                },
                "nodeFullName": {
                    type: "string",
                    nullable: true
                },
                "feedName": {
                    type: "string"
                },
                "postingId": {
                    type: "string",
                    nullable: true
                },
                "postingRevisionId": {
                    type: "string",
                    nullable: true
                },
                "postingOwnerName": {
                    type: "string",
                    nullable: true
                },
                "postingOwnerFullName": {
                    type: "string",
                    nullable: true
                },
                "postingOwnerGender": {
                    type: "string",
                    nullable: true
                },
                "postingHeading": {
                    type: "string",
                    nullable: true
                },
                "commentId": {
                    type: "string",
                    nullable: true
                },
                "commentRevisionId": {
                    type: "string",
                    nullable: true
                },
                "commentOwnerName": {
                    type: "string",
                    nullable: true
                },
                "commentOwnerFullName": {
                    type: "string",
                    nullable: true
                },
                "commentOwnerGender": {
                    type: "string",
                    nullable: true
                },
                "commentHeading": {
                    type: "string",
                    nullable: true
                },
                "category": {
                    type: "string"
                },
                "reasonCode": {
                    type: "string",
                    nullable: true
                },
                "reasonDetails": {
                    type: "string",
                    nullable: true
                },
                "createdAt": {
                    type: "integer"
                },
                "moment": {
                    type: "integer"
                },
                "signature": {
                    type: "string"
                },
                "signatureVersion": {
                    type: "integer"
                },
                "complaintGroupId": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "id",
                "sheriffName",
                "nodeName",
                "feedName",
                "category",
                "createdAt",
                "moment",
                "signature",
                "signatureVersion",
            ],
            additionalProperties: false
        },

        SheriffOrdersSliceInfo: {
            type: "object",
            properties: {
                "before": {
                    type: "integer"
                },
                "after": {
                    type: "integer"
                },
                "orders": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/SheriffOrderInfo"
                    }
                },
                "total": {
                    type: "integer"
                },
                "totalInPast": {
                    type: "integer"
                },
                "totalInFuture": {
                    type: "integer"
                },
            },
            required: [
                "before",
                "after",
                "orders",
                "total",
                "totalInPast",
                "totalInFuture",
            ],
            additionalProperties: false
        },

        StorySummaryBlocked: {
            type: "object",
            properties: {
                "operations": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                "period": {
                    type: "integer",
                    nullable: true
                },
            },
            required: [
                "operations",
            ],
            additionalProperties: false
        },

        StorySummaryFriendGroup: {
            type: "object",
            properties: {
                "id": {
                    type: "string",
                    nullable: true
                },
                "title": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        StorySummaryEntry: {
            type: "object",
            properties: {
                "ownerName": {
                    type: "string",
                    nullable: true
                },
                "ownerFullName": {
                    type: "string",
                    nullable: true
                },
                "ownerGender": {
                    type: "string",
                    nullable: true
                },
                "heading": {
                    type: "string",
                    nullable: true
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
            additionalProperties: false
        },

        StorySummaryNode: {
            type: "object",
            properties: {
                "ownerName": {
                    type: "string",
                    nullable: true
                },
                "ownerFullName": {
                    type: "string",
                    nullable: true
                },
                "ownerGender": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        StorySummaryPageClicks: {
            type: "object",
            properties: {
                "heading": {
                    type: "string",
                    nullable: true
                },
                "href": {
                    type: "string"
                },
                "clicks": {
                    type: "integer"
                },
            },
            required: [
                "href",
                "clicks",
            ],
            additionalProperties: false
        },

        StorySummaryReaction: {
            type: "object",
            properties: {
                "ownerName": {
                    type: "string",
                    nullable: true
                },
                "ownerFullName": {
                    type: "string",
                    nullable: true
                },
                "ownerGender": {
                    type: "string",
                    nullable: true
                },
                "emoji": {
                    type: "integer",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        StorySummarySheriff: {
            type: "object",
            properties: {
                "sheriffName": {
                    type: "string"
                },
                "orderId": {
                    type: "string",
                    nullable: true
                },
                "complaintId": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "sheriffName",
            ],
            additionalProperties: false
        },

        SubscriberInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "type": {
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
                "contact": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ContactInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "createdAt": {
                    type: "integer"
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/SubscriberOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "ownerOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/SubscriberOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "adminOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/SubscriberOperations",
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
                "id",
                "type",
                "nodeName",
                "createdAt",
            ],
            additionalProperties: false
        },

        SubscriberInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/SubscriberInfo"
            }
        },

        SubscriptionInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "type": {
                    type: "string"
                },
                "feedName": {
                    type: "string",
                    nullable: true
                },
                "remoteNodeName": {
                    type: "string"
                },
                "contact": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ContactInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
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
                },
                "reason": {
                    type: "string"
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/SubscriptionOperations",
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
                "id",
                "type",
                "remoteNodeName",
                "createdAt",
                "reason",
            ],
            additionalProperties: false
        },

        SubscriptionInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/SubscriptionInfo"
            }
        },

        TokenInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "token": {
                    type: "string"
                },
                "name": {
                    type: "string",
                    nullable: true
                },
                "permissions": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    default: []
                },
                "pluginName": {
                    type: "string",
                    nullable: true
                },
                "createdAt": {
                    type: "integer"
                },
                "deadline": {
                    type: "integer",
                    nullable: true
                },
                "lastUsedAt": {
                    type: "integer",
                    nullable: true
                },
                "lastUsedBrowser": {
                    type: "string",
                    nullable: true
                },
                "lastUsedIp": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "id",
                "token",
                "permissions",
                "createdAt",
            ],
            additionalProperties: false
        },

        TokenInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/TokenInfo"
            }
        },

        UpdateInfo: {
            type: "object",
            properties: {
                "important": {
                    type: "boolean",
                    nullable: true
                },
                "description": {
                    type: "string",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        UserListInfo: {
            type: "object",
            properties: {
                "name": {
                    type: "string"
                },
                "total": {
                    type: "integer"
                },
            },
            required: [
                "name",
                "total",
            ],
            additionalProperties: false
        },

        UserListItemInfo: {
            type: "object",
            properties: {
                "nodeName": {
                    type: "string"
                },
                "createdAt": {
                    type: "integer"
                },
                "moment": {
                    type: "integer"
                },
            },
            required: [
                "nodeName",
                "createdAt",
                "moment",
            ],
            additionalProperties: false
        },

        UserListSliceInfo: {
            type: "object",
            properties: {
                "listName": {
                    type: "string"
                },
                "before": {
                    type: "integer"
                },
                "after": {
                    type: "integer"
                },
                "items": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/UserListItemInfo"
                    }
                },
                "total": {
                    type: "integer"
                },
                "totalInPast": {
                    type: "integer"
                },
                "totalInFuture": {
                    type: "integer"
                },
            },
            required: [
                "listName",
                "before",
                "after",
                "items",
                "total",
                "totalInPast",
                "totalInFuture",
            ],
            additionalProperties: false
        },

        WhoAmI: {
            type: "object",
            properties: {
                "nodeName": {
                    type: "string",
                    nullable: true
                },
                "nodeNameChanging": {
                    type: "boolean",
                    nullable: true
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
                "frozen": {
                    type: "boolean",
                    nullable: true
                },
            },
            additionalProperties: false
        },

        ActivityReactionInfo: {
            type: "object",
            properties: {
                "remoteNodeName": {
                    type: "string"
                },
                "remoteFullName": {
                    type: "string",
                    nullable: true
                },
                "remoteAvatar": {
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
                "remoteNodeName",
                "remotePostingId",
                "negative",
                "emoji",
                "createdAt",
            ],
            additionalProperties: false
        },

        ActivityReactionInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/ActivityReactionInfo"
            }
        },

        BlockedByUserInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "blockedOperation": {
                    type: "string"
                },
                "contact": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ContactInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "nodeName": {
                    type: "string"
                },
                "postingId": {
                    type: "string",
                    nullable: true
                },
                "createdAt": {
                    type: "integer"
                },
                "deadline": {
                    type: "integer",
                    nullable: true
                },
                "reason": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "id",
                "blockedOperation",
                "nodeName",
                "createdAt",
            ],
            additionalProperties: false
        },

        BlockedByUserInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/BlockedByUserInfo"
            }
        },

        BlockedUserInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "blockedOperation": {
                    type: "string"
                },
                "nodeName": {
                    type: "string"
                },
                "contact": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ContactInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "entryId": {
                    type: "string",
                    nullable: true
                },
                "entryNodeName": {
                    type: "string",
                    nullable: true
                },
                "entryPostingId": {
                    type: "string",
                    nullable: true
                },
                "createdAt": {
                    type: "integer"
                },
                "deadline": {
                    type: "integer",
                    nullable: true
                },
                "reasonSrc": {
                    type: "string",
                    nullable: true
                },
                "reasonSrcFormat": {
                    type: "string",
                    nullable: true
                },
                "reason": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "id",
                "blockedOperation",
                "nodeName",
                "createdAt",
            ],
            additionalProperties: false
        },

        BlockedUserInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/BlockedUserInfo"
            }
        },

        Body: {
            type: "object",
            properties: {
                "subject": {
                    type: "string",
                    nullable: true
                },
                "text": {
                    type: "string",
                    nullable: true
                },
                "linkPreviews": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/LinkPreview"
                    },
                    nullable: true
                },
            },
            additionalProperties: false
        },

        CommentRevisionInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "postingRevisionId": {
                    type: "string"
                },
                "bodyPreview": {
                    type: "string",
                    nullable: true
                },
                "bodySrcHash": {
                    type: "string"
                },
                "bodySrcFormat": {
                    type: "string",
                    nullable: true
                },
                "body": {
                    type: "string"
                },
                "bodyFormat": {
                    type: "string",
                    nullable: true
                },
                "heading": {
                    type: "string"
                },
                "createdAt": {
                    type: "integer"
                },
                "deletedAt": {
                    type: "integer",
                    nullable: true
                },
                "deadline": {
                    type: "integer",
                    nullable: true
                },
                "digest": {
                    type: "string",
                    nullable: true
                },
                "signature": {
                    type: "string",
                    nullable: true
                },
                "signatureVersion": {
                    type: "integer",
                    nullable: true
                },
                "clientReaction": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ClientReactionInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "reactions": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ReactionTotalsInfo",
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
                "id",
                "postingRevisionId",
                "bodySrcHash",
                "body",
                "heading",
                "createdAt",
            ],
            additionalProperties: false
        },

        CommentRevisionInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/CommentRevisionInfo"
            }
        },

        Features: {
            type: "object",
            properties: {
                "posting": {
                    $ref: "node#/definitions/PostingFeatures"
                },
                "plugins": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                },
                "feedWidth": {
                    type: "integer"
                },
                "friendGroups": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/FriendGroupsFeatures",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "ask": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                },
                "subscribed": {
                    type: "boolean",
                    nullable: true
                },
            },
            required: [
                "posting",
                "feedWidth",
            ],
            additionalProperties: false
        },

        FeedInfo: {
            type: "object",
            properties: {
                "feedName": {
                    type: "string"
                },
                "title": {
                    type: "string",
                    nullable: true
                },
                "total": {
                    type: "integer"
                },
                "firstCreatedAt": {
                    type: "integer",
                    nullable: true
                },
                "lastCreatedAt": {
                    type: "integer",
                    nullable: true
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/FeedOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
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
                "feedName",
                "total",
            ],
            additionalProperties: false
        },

        FeedInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/FeedInfo"
            }
        },

        MediaAttachment: {
            type: "object",
            properties: {
                "media": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/PrivateMediaFileInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "remoteMedia": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/RemoteMediaInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "embedded": {
                    type: "boolean"
                },
            },
            required: [
                "embedded",
            ],
            additionalProperties: false
        },

        PostingInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "revisionId": {
                    type: "string"
                },
                "receiverRevisionId": {
                    type: "string",
                    nullable: true
                },
                "totalRevisions": {
                    type: "integer"
                },
                "receiverName": {
                    type: "string",
                    nullable: true
                },
                "receiverFullName": {
                    type: "string",
                    nullable: true
                },
                "receiverGender": {
                    type: "string",
                    nullable: true
                },
                "receiverAvatar": {
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
                "receiverPostingId": {
                    type: "string",
                    nullable: true
                },
                "parentMediaId": {
                    type: "string",
                    nullable: true
                },
                "ownerName": {
                    type: "string"
                },
                "ownerFullName": {
                    type: "string",
                    nullable: true
                },
                "ownerGender": {
                    type: "string",
                    nullable: true
                },
                "ownerAvatar": {
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
                "bodyPreview": {
                    type: "string",
                    nullable: true
                },
                "bodySrc": {
                    type: "string",
                    nullable: true
                },
                "bodySrcHash": {
                    type: "string"
                },
                "bodySrcFormat": {
                    type: "string",
                    nullable: true
                },
                "body": {
                    type: "string"
                },
                "bodyFormat": {
                    type: "string",
                    nullable: true
                },
                "media": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/MediaAttachment"
                    },
                    nullable: true
                },
                "heading": {
                    type: "string"
                },
                "updateInfo": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/UpdateInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "createdAt": {
                    type: "integer"
                },
                "editedAt": {
                    type: "integer",
                    nullable: true
                },
                "deletedAt": {
                    type: "integer",
                    nullable: true
                },
                "receiverCreatedAt": {
                    type: "integer",
                    nullable: true
                },
                "receiverEditedAt": {
                    type: "integer",
                    nullable: true
                },
                "receiverDeletedAt": {
                    type: "integer",
                    nullable: true
                },
                "revisionCreatedAt": {
                    type: "integer"
                },
                "receiverRevisionCreatedAt": {
                    type: "integer",
                    nullable: true
                },
                "deadline": {
                    type: "integer",
                    nullable: true
                },
                "digest": {
                    type: "string",
                    nullable: true
                },
                "signature": {
                    type: "string",
                    nullable: true
                },
                "signatureVersion": {
                    type: "integer",
                    nullable: true
                },
                "feedReferences": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/FeedReference"
                    },
                    nullable: true
                },
                "blockedInstants": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/BlockedPostingInstantInfo"
                    },
                    nullable: true
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/PostingOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "receiverOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/PostingOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "commentOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/CommentOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "reactionOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ReactionOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "commentReactionOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ReactionOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "blockedOperations": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                },
                "blockedCommentOperations": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
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
                "acceptedReactions": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/AcceptedReactions",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "clientReaction": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ClientReactionInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "reactions": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ReactionTotalsInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "sources": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/PostingSourceInfo"
                    },
                    nullable: true
                },
                "totalComments": {
                    type: "integer",
                    nullable: true
                },
            },
            required: [
                "id",
                "revisionId",
                "totalRevisions",
                "ownerName",
                "bodySrcHash",
                "body",
                "heading",
                "createdAt",
                "revisionCreatedAt",
            ],
            additionalProperties: false
        },

        PostingInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/PostingInfo"
            }
        },

        PostingRevisionInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "receiverId": {
                    type: "string",
                    nullable: true
                },
                "bodyPreview": {
                    type: "string",
                    nullable: true
                },
                "bodySrcHash": {
                    type: "string"
                },
                "bodySrcFormat": {
                    type: "string",
                    nullable: true
                },
                "body": {
                    type: "string"
                },
                "bodyFormat": {
                    type: "string",
                    nullable: true
                },
                "media": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/MediaAttachment"
                    },
                    nullable: true
                },
                "heading": {
                    type: "string"
                },
                "updateInfo": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/UpdateInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "createdAt": {
                    type: "integer"
                },
                "deletedAt": {
                    type: "integer",
                    nullable: true
                },
                "receiverCreatedAt": {
                    type: "integer",
                    nullable: true
                },
                "receiverDeletedAt": {
                    type: "integer",
                    nullable: true
                },
                "digest": {
                    type: "string",
                    nullable: true
                },
                "signature": {
                    type: "string",
                    nullable: true
                },
                "signatureVersion": {
                    type: "integer",
                    nullable: true
                },
                "clientReaction": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ClientReactionInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "reactions": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ReactionTotalsInfo",
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
                "id",
                "bodySrcHash",
                "body",
                "heading",
                "createdAt",
            ],
            additionalProperties: false
        },

        PostingRevisionInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/PostingRevisionInfo"
            }
        },

        ReactionCreated: {
            type: "object",
            properties: {
                "reaction": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ReactionInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "totals": {
                    $ref: "node#/definitions/ReactionTotalsInfo"
                },
            },
            required: [
                "totals",
            ],
            additionalProperties: false
        },

        SearchEntryInfo: {
            type: "object",
            properties: {
                "nodeName": {
                    type: "string"
                },
                "postingId": {
                    type: "string"
                },
                "commentId": {
                    type: "string",
                    nullable: true
                },
                "ownerName": {
                    type: "string"
                },
                "ownerFullName": {
                    type: "string",
                    nullable: true
                },
                "ownerAvatar": {
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
                "bodyPreview": {
                    type: "string"
                },
                "bodyFormat": {
                    type: "string",
                    nullable: true
                },
                "heading": {
                    type: "string"
                },
                "imageCount": {
                    type: "integer",
                    nullable: true
                },
                "videoPresent": {
                    type: "boolean",
                    nullable: true
                },
                "repliedTo": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/SearchRepliedTo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "createdAt": {
                    type: "integer"
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/SearchEntryOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "moment": {
                    type: "integer"
                },
            },
            required: [
                "nodeName",
                "postingId",
                "ownerName",
                "bodyPreview",
                "heading",
                "createdAt",
                "moment",
            ],
            additionalProperties: false
        },

        SearchHashtagSliceInfo: {
            type: "object",
            properties: {
                "before": {
                    type: "integer"
                },
                "after": {
                    type: "integer"
                },
                "entries": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/SearchEntryInfo"
                    }
                },
            },
            required: [
                "before",
                "after",
                "entries",
            ],
            additionalProperties: false
        },

        SearchTextPageInfo: {
            type: "object",
            properties: {
                "page": {
                    type: "integer"
                },
                "total": {
                    type: "integer"
                },
                "entries": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/SearchEntryInfo"
                    }
                },
            },
            required: [
                "page",
                "total",
                "entries",
            ],
            additionalProperties: false
        },

        SettingMetaInfo: {
            type: "object",
            properties: {
                "name": {
                    type: "string"
                },
                "type": {
                    type: "string"
                },
                "defaultValue": {
                    type: "string",
                    nullable: true
                },
                "privileged": {
                    type: "boolean",
                    nullable: true
                },
                "title": {
                    type: "string"
                },
                "modifiers": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/SettingTypeModifiers",
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
                "name",
                "type",
                "title",
            ],
            additionalProperties: false
        },

        SettingMetaInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/SettingMetaInfo"
            }
        },

        StorySummaryData: {
            type: "object",
            properties: {
                "node": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/StorySummaryNode",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "posting": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/StorySummaryEntry",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "comment": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/StorySummaryEntry",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "comments": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/StorySummaryEntry"
                    },
                    nullable: true
                },
                "totalComments": {
                    type: "integer",
                    nullable: true
                },
                "repliedTo": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/StorySummaryEntry",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "parentPosting": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/StorySummaryEntry",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "reaction": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/StorySummaryReaction",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "reactions": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/StorySummaryReaction"
                    },
                    nullable: true
                },
                "totalReactions": {
                    type: "integer",
                    nullable: true
                },
                "feedName": {
                    type: "string",
                    nullable: true
                },
                "subscriptionReason": {
                    type: "string",
                    nullable: true
                },
                "friendGroup": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/StorySummaryFriendGroup",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "blocked": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/StorySummaryBlocked",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "sheriff": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/StorySummarySheriff",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "description": {
                    type: "string",
                    nullable: true
                },
                "clicks": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/StorySummaryPageClicks"
                    },
                    nullable: true
                },
            },
            additionalProperties: false
        },

        CommentInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "ownerName": {
                    type: "string"
                },
                "ownerFullName": {
                    type: "string",
                    nullable: true
                },
                "ownerGender": {
                    type: "string",
                    nullable: true
                },
                "ownerAvatar": {
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
                "postingId": {
                    type: "string"
                },
                "postingRevisionId": {
                    type: "string"
                },
                "revisionId": {
                    type: "string"
                },
                "totalRevisions": {
                    type: "integer"
                },
                "bodyPreview": {
                    type: "string",
                    nullable: true
                },
                "bodySrc": {
                    type: "string",
                    nullable: true
                },
                "bodySrcHash": {
                    type: "string"
                },
                "bodySrcFormat": {
                    type: "string",
                    nullable: true
                },
                "body": {
                    type: "string"
                },
                "bodyFormat": {
                    type: "string",
                    nullable: true
                },
                "media": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/MediaAttachment"
                    },
                    nullable: true
                },
                "heading": {
                    type: "string"
                },
                "repliedTo": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/RepliedTo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "moment": {
                    type: "integer"
                },
                "createdAt": {
                    type: "integer"
                },
                "editedAt": {
                    type: "integer",
                    nullable: true
                },
                "deletedAt": {
                    type: "integer",
                    nullable: true
                },
                "revisionCreatedAt": {
                    type: "integer"
                },
                "deadline": {
                    type: "integer",
                    nullable: true
                },
                "digest": {
                    type: "string",
                    nullable: true
                },
                "signature": {
                    type: "string",
                    nullable: true
                },
                "signatureVersion": {
                    type: "integer",
                    nullable: true
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/CommentOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "reactionOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ReactionOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "ownerOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/CommentOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "seniorOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/CommentOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "blockedOperations": {
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
                "acceptedReactions": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/AcceptedReactions",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "clientReaction": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ClientReactionInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "seniorReaction": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ClientReactionInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "reactions": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/ReactionTotalsInfo",
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
                "id",
                "ownerName",
                "postingId",
                "postingRevisionId",
                "revisionId",
                "totalRevisions",
                "bodySrcHash",
                "body",
                "heading",
                "moment",
                "createdAt",
                "revisionCreatedAt",
            ],
            additionalProperties: false
        },

        CommentsSliceInfo: {
            type: "object",
            properties: {
                "before": {
                    type: "integer"
                },
                "after": {
                    type: "integer"
                },
                "comments": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/CommentInfo"
                    }
                },
                "total": {
                    type: "integer"
                },
                "totalInPast": {
                    type: "integer"
                },
                "totalInFuture": {
                    type: "integer"
                },
            },
            required: [
                "before",
                "after",
                "comments",
                "total",
                "totalInPast",
                "totalInFuture",
            ],
            additionalProperties: false
        },

        DraftInfo: {
            type: "object",
            properties: {
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
                    type: "string",
                    nullable: true
                },
                "receiverCommentId": {
                    type: "string",
                    nullable: true
                },
                "repliedToId": {
                    type: "string",
                    nullable: true
                },
                "createdAt": {
                    type: "integer"
                },
                "editedAt": {
                    type: "integer",
                    nullable: true
                },
                "deadline": {
                    type: "integer",
                    nullable: true
                },
                "ownerFullName": {
                    type: "string",
                    nullable: true
                },
                "ownerAvatar": {
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
                "acceptedReactions": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/AcceptedReactions",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "bodySrc": {
                    type: "string",
                    nullable: true
                },
                "bodySrcFormat": {
                    type: "string",
                    nullable: true
                },
                "body": {
                    type: "string"
                },
                "bodyFormat": {
                    type: "string",
                    nullable: true
                },
                "media": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/MediaAttachment"
                    },
                    nullable: true
                },
                "heading": {
                    type: "string"
                },
                "publishAt": {
                    type: "integer",
                    nullable: true
                },
                "updateInfo": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/UpdateInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "operations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/PostingOperations",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "commentOperations": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/CommentOperations",
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
                "id",
                "draftType",
                "receiverName",
                "createdAt",
                "body",
                "heading",
            ],
            additionalProperties: false
        },

        DraftInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/DraftInfo"
            }
        },

        EntryInfo: {
            type: "object",
            properties: {
                "posting": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/PostingInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "comment": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/CommentInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
            },
            additionalProperties: false
        },

        EntryInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/EntryInfo"
            }
        },

        PluginInfo: {
            type: "object",
            properties: {
                "nodeId": {
                    type: "string"
                },
                "local": {
                    type: "boolean"
                },
                "name": {
                    type: "string"
                },
                "title": {
                    type: "string",
                    nullable: true
                },
                "description": {
                    type: "string",
                    nullable: true
                },
                "location": {
                    type: "string",
                    nullable: true
                },
                "acceptedEvents": {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    nullable: true
                },
                "settings": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/SettingMetaInfo"
                    },
                    nullable: true
                },
                "tokenId": {
                    type: "string",
                    nullable: true
                },
            },
            required: [
                "nodeId",
                "local",
                "name",
            ],
            additionalProperties: false
        },

        PluginInfoArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/PluginInfo"
            }
        },

        StoryInfo: {
            type: "object",
            properties: {
                "id": {
                    type: "string"
                },
                "feedName": {
                    type: "string"
                },
                "storyType": {
                    type: "string"
                },
                "createdAt": {
                    type: "integer"
                },
                "publishedAt": {
                    type: "integer"
                },
                "pinned": {
                    type: "boolean",
                    nullable: true
                },
                "moment": {
                    type: "integer"
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
                "posting": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/PostingInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "postingId": {
                    type: "string",
                    nullable: true
                },
                "comment": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/CommentInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "commentId": {
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
                "remoteMediaId": {
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
                "id",
                "feedName",
                "storyType",
                "createdAt",
                "publishedAt",
                "moment",
            ],
            additionalProperties: false
        },

        CommentCreated: {
            type: "object",
            properties: {
                "comment": {
                    $ref: "node#/definitions/CommentInfo"
                },
                "total": {
                    type: "integer"
                },
            },
            required: [
                "comment",
                "total",
            ],
            additionalProperties: false
        },

        FeedSliceInfo: {
            type: "object",
            properties: {
                "before": {
                    type: "integer"
                },
                "after": {
                    type: "integer"
                },
                "stories": {
                    type: "array",
                    items: {
                        $ref: "node#/definitions/StoryInfo"
                    }
                },
                "totalInPast": {
                    type: "integer"
                },
                "totalInFuture": {
                    type: "integer"
                },
            },
            required: [
                "before",
                "after",
                "stories",
                "totalInPast",
                "totalInFuture",
            ],
            additionalProperties: false
        },

        PushContent: {
            type: "object",
            properties: {
                "type": {
                    type: "string"
                },
                "id": {
                    type: "string",
                    nullable: true
                },
                "story": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/StoryInfo",
                            type: "object",
                            nullable: true
                        },
                        {
                            type: "null"
                        }
                    ]
                },
                "feedStatus": {
                    anyOf: [
                        {
                            $ref: "node#/definitions/FeedWithStatus",
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
            ],
            additionalProperties: false
        },

        PushContentArray: {
            type: "array",
            items: {
                $ref: "node#/definitions/PushContent"
            }
        },

    }
}
