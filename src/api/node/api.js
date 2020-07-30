import schema from "api/schema";

export const Result = schema({
    type: "object",
    properties: {
        "errorCode": {
            type: "string"
        },
        "message": {
            type: "string",
            default: ""
        }
    },
    additionalProperties: false,
    required: ["errorCode", "message"]
});

export const WhoAmI = schema({
    type: "object",
    properties: {
        "nodeName": {
            type: "string"
        }
    },
    additionalProperties: false
});

export const ProfileInfo = schema({
    type: "object",
    properties: {
        "fullName": {
            type: "string"
        },
        "gender": {
            type: "string"
        },
        "email": {
            type: "string",
            anyOf: [{
                const: ""
            }, {
                format: "email"
            }]
        },
        "operations": {
            type: "object",
            properties: {
                "edit": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },
            additionalProperties: false
        }
    },
    additionalProperties: false
});

export const TokenCreated = schema({
    type: "object",
    properties: {
        "token": {
            type: "string"
        },
        "permissions": {
            type: "array",
            items: {
                type: "string"
            },
            default: []
        }
    },
    additionalProperties: false,
    required: ["token", "permissions"]
});

export const NodeNameInfo = schema({
    type: "object",
    properties: {
        "name": {
            type: "string"
        },
        "operationStatus": {
            type: "string"
        },
        "operationStatusUpdated": {
            type: "integer"
        },
        "operationErrorCode": {
            type: "string"
        },
        "operationErrorMessage": {
            type: "string"
        },
        "operations": {
            type: "object",
            properties: {
                "manage": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },
            additionalProperties: false
        }
    },
    additionalProperties: false
});

export const RegisteredNameSecret = schema({
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
            minItems: 24,
            maxItems: 24
        },
        "secret": {
            type: "string"
        }
    },
    additionalProperties: false
});

export const Body = schema({
    type: "object",
    properties: {
        "subject": {
            type: "string"
        },
        "text": {
            type: "string"
        }
    },
    additionalProperties: false
});

const ReactionTotalInfoType = {
    type: "object",
    properties: {
        "emoji": {
            type: "integer"
        },
        "total": {
            type: "integer"
        },
        "share": {
            type: "number",
            minimum: 0,
            maximum: 1
        }
    },
    additionalProperties: false
};

const ReactionTotalsInfoType = {
    type: "object",
    properties: {
        "positive": {
            type: "array",
            items: ReactionTotalInfoType,
            default: []
        },
        "negative": {
            type: "array",
            items: ReactionTotalInfoType,
            default: []
        }
    },
    additionalProperties: false
};

export const ReactionTotalsInfo = schema(ReactionTotalsInfoType);

const PostingInfoType = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        },
        "revisionId": {
            type: "string"
        },
        "receiverRevisionId": {
            type: "string"
        },
        "totalRevisions": {
            type: "integer"
        },
        "receiverName": {
            type: "string"
        },
        "receiverPostingId": {
            type: "string"
        },
        "ownerName": {
            type: "string"
        },
        "bodyPreview": {
            type: "string"
        },
        "bodySrc": {
            type: "string"
        },
        "bodySrcFormat": {
            type: "string"
        },
        "body": {
            type: "string"
        },
        "bodyFormat": {
            type: "string"
        },
        "heading": {
            type: "string"
        },
        "createdAt": {
            type: "integer"
        },
        "editedAt": {
            type: "integer"
        },
        "deletedAt": {
            type: "integer"
        },
        "receiverCreatedAt": {
            type: "integer"
        },
        "receiverEditedAt": {
            type: "integer"
        },
        "receiverDeletedAt": {
            type: "integer"
        },
        "draft": {
            type: "boolean"
        },
        "draftPending": {
            type: "boolean"
        },
        "signature": {
            type: "string"
        },
        "signatureVersion": {
            type: "integer"
        },
        "feedReferences": {
            type: "array",
            items: {
                type: "object",
                properties: {
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
                    "storyId": {
                        type: "string"
                    }
                },
                additionalProperties: false
            }
        },
        "clientReaction": {
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
                    type: "integer"
                }
            },
            additionalProperties: false
        },
        "operations": {
            type: "object",
            properties: {
                "edit": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                "delete": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                "reactions": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },
            additionalProperties: false
        },
        "acceptedReactions": {
            type: "object",
            properties: {
                "positive": {
                    type: "string"
                },
                "negative": {
                    type: "string"
                },
            },
            additionalProperties: false
        },
        "reactions": ReactionTotalsInfoType,
        "reactionsVisible": {
            type: "boolean"
        },
        "reactionTotalsVisible": {
            type: "boolean"
        },
        "sources": {
            type: "array",
            items: {
                type: "object",
                properties: {
                    "nodeName": {
                        type: "string"
                    },
                    "feedName": {
                        type: "string"
                    },
                    "postingId": {
                        type: "string"
                    },
                    "createdAt": {
                        type: "integer"
                    }
                },
                additionalProperties: false
            }
        },
        "totalComments": {
            type: "integer"
        }
    },
    additionalProperties: false
};

export const PostingInfo = schema(PostingInfoType);

export const PostingInfoList = schema({
    type: "array",
    items: PostingInfoType
});

export const FeedInfo = schema({
    type: "object",
    properties: {
        "feedName": {
            type: "string"
        },
        "subscriberId": {
            type: "string"
        },
        "operations": {
            type: "object",
            properties: {
                "add": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },
            additionalProperties: false
        }
    },
    additionalProperties: false
});

export const FeedStatus = schema({
    type: "object",
    properties: {
        "notViewed": {
            type: "integer"
        },
        "notRead": {
            type: "integer"
        }
    },
    additionalProperties: false
});

const StoryInfoType = {
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
            type: "boolean"
        },
        "moment": {
            type: "integer"
        },
        "viewed": {
            type: "boolean"
        },
        "read": {
            type: "boolean"
        },
        "posting": PostingInfoType,
        "summary": {
            type: "string"
        },
        "trackingId": {
            type: "string"
        },
        "remoteNodeName": {
            type: "string"
        },
        "remotePostingId": {
            type: "string"
        },
        "operations": {
            type: "object",
            properties: {
                "edit": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                "delete": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },
            additionalProperties: false
        }
    },
    additionalProperties: false
};

export const StoryInfo = schema(StoryInfoType);

export const FeedSliceInfo = schema({
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
            items: StoryInfoType
        }
    },
    additionalProperties: false
});

const ChoiceType = {
    type: "object",
    properties: {
        "value": {
            type: "string"
        },
        "title": {
            type: "string"
        }
    },
    additionalProperties: false
};

export const PostingFeatures = schema({
    type: "object",
    properties: {
        "subjectPresent": {
            type: "boolean"
        },
        "sourceFormats": {
            type: "array",
            items: ChoiceType
        }
    },
    additionalProperties: false
});

export const SettingInfoArray = schema({
    type: "array",
    items: {
        type: "object",
        properties: {
            "name": {
                type: "string"
            },
            "value": {
                type: "string"
            }
        },
        additionalProperties: false
    }
});

export const SettingMetaInfoArray = schema({
    type: "array",
    items: {
        type: "object",
        properties: {
            "name": {
                type: "string"
            },
            "type": {
                type: "string"
            },
            "defaultValue": {
                type: "string"
            },
            "title": {
                type: "string"
            },
            "modifiers": {
                anyOf: [{
                    type: "object",
                    properties: {
                        "format": {
                            type: "string"
                        },
                        "min": {
                            type: "string"
                        },
                        "max": {
                            type: "string"
                        },
                        "multiline": {
                            type: "boolean"
                        }
                    },
                    additionalProperties: false
                }, {
                    type: "null"
                }]
            }
        },
        additionalProperties: false
    }
});

export const AsyncOperationCreated = schema({
    type: "object",
    properties: {
        "id": {
            type: "string"
        }
    },
    additionalProperties: false
});

export const CarteSet = schema({
    type: "object",
    properties: {
        "cartesIp": {
            type: "string"
        },
        "cartes": {
            type: "array",
            items: {
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
                    }
                },
                additionalProperties: false
            },
            default: []
        }
    },
    additionalProperties: false
});

const ReactionInfoType = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        },
        "ownerName": {
            type: "string"
        },
        "postingId": {
            type: "string"
        },
        "postingRevisionId": {
            type: "string"
        },
        "negative": {
            type: "boolean"
        },
        "emoji": {
            type: "integer"
        },
        "moment": {
            type: "integer"
        },
        "createdAt": {
            type: "integer"
        },
        "deadline": {
            type: "integer"
        },
        "signature": {
            type: "string"
        },
        "signatureVersion": {
            type: "integer"
        },
        "operations": {
            type: "object",
            properties: {
                "delete": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },
            additionalProperties: false
        }
    },
    additionalProperties: false
};

export const ReactionInfo = schema(ReactionInfoType);

export const ReactionCreated = schema({
    type: "object",
    properties: {
        "reaction": ReactionInfoType,
        "totals": ReactionTotalsInfoType
    },
    additionalProperties: false
});

export const ReactionsSliceInfo = schema({
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
            items: ReactionInfoType
        }
    },
    additionalProperties: false
});

export const SubscriberInfoType = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        },
        "type": {
            type: "string"
        },
        "feedName": {
            type: "string"
        },
        "postingId": {
            type: "string"
        },
        "nodeName": {
            type: "string"
        },
        "createdAt": {
            type: "integer"
        }
    },
    additionalProperties: false
};

export const SubscriberInfo = schema(SubscriberInfoType);

export const SubscriberInfoArray = schema({
    type: "array",
    items: SubscriberInfoType
});

export const SubscriptionInfoType = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        },
        "type": {
            type: "string"
        },
        "feedName": {
            type: "string"
        },
        "remoteSubscriberId": {
            type: "string"
        },
        "remoteNodeName": {
            type: "string"
        },
        "remoteFeedName": {
            type: "string"
        },
        "remotePostingId": {
            type: "string"
        },
        "createdAt": {
            type: "integer"
        }
    },
    additionalProperties: false
};

export const SubscriptionInfo = schema(SubscriptionInfoType);

export const SubscriptionInfoArray = schema({
    type: "array",
    items: SubscriptionInfoType
});

export const ActivityReactionInfoArray = schema({
    type: "array",
    items: {
        type: "object",
        properties: {
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
        additionalProperties: false
    }
});

export const PeopleGeneralInfo = schema({
    type: "object",
    properties: {
        "feedSubscribersTotal": {
            type: "integer"
        },
        "feedSubscriptionsTotal": {
            type: "integer"
        },
    },
    additionalProperties: false
});

export const CommentInfoType = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        },
        "ownerName": {
            type: "string"
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
            type: "string"
        },
        "bodySrc": {
            type: "string"
        },
        "bodySrcFormat": {
            type: "string"
        },
        "body": {
            type: "string"
        },
        "bodyFormat": {
            type: "string"
        },
        "heading": {
            type: "string"
        },
        "moment": {
            type: "integer"
        },
        "createdAt": {
            type: "integer"
        },
        "editedAt": {
            type: "integer"
        },
        "deletedAt": {
            type: "integer"
        },
        "revisionCreatedAt": {
            type: "integer"
        },
        "deadline": {
            type: "integer"
        },
        "signature": {
            type: "string"
        },
        "signatureVersion": {
            type: "integer"
        },
        "operations": {
            type: "object",
            properties: {
                "edit": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                "delete": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                "revisions": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                "reactions": {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },
            additionalProperties: false
        },
        "acceptedReactions": {
            type: "object",
            properties: {
                "positive": {
                    type: "string"
                },
                "negative": {
                    type: "string"
                },
            },
            additionalProperties: false
        },
        "clientReaction": {
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
                    type: "integer"
                }
            },
            additionalProperties: false
        },
        "reactions": ReactionTotalsInfoType
    },
    additionalProperties: false
};

export const CommentInfo = schema(CommentInfoType);

export const CommentCreated = schema({
    type: "object",
    properties: {
        "comment": CommentInfoType,
        "total": {
            type: "integer"
        }
    },
    additionalProperties: false
});

export const CommentsSliceInfo = schema({
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
            items: CommentInfoType
        }
    },
    additionalProperties: false
});
