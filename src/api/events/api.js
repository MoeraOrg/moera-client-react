import schema from "api/schema";
import { AvatarImageType } from "api/node/api";

const baseEvent = (properties = {}) => schema({
    type: "object",
    properties: {
        "type": {
            type: "string"
        },
        ...properties
    },
    additionalProperties: false,
    required: ["type"]
});

const postingEvent = (properties = {}) => baseEvent({
    "id": {
        type: "string"
    },
    ...properties
});

const draftPostingEvent = (properties = {}) => baseEvent({
    "id": {
        type: "string"
    },
    ...properties
});

const remotePostingVerificationEvent = (properties = {}) => baseEvent({
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
    ...properties
});

const remoteReactionEvent = (properties = {}) => baseEvent({
    "remoteNodeName": {
        type: "string"
    },
    "remotePostingId": {
        type: "string"
    },
    ...properties
});

const remoteReactionVerificationEvent = (properties = {}) => baseEvent({
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
    ...properties
});

const storyEvent = (properties = {}) => baseEvent({
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
    "summary": {
        type: "string"
    },
    "trackingId": {
        type: "string"
    },
    "remoteNodeName": {
        type: "string"
    },
    "remoteFullName": {
        type: "string"
    },
    "remotePostingId": {
        type: "string"
    },
    "remoteCommentId": {
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
    },
    ...properties
});

const subscriberEvent = (properties = {}) => baseEvent({
    "id": {
        type: "string"
    },
    "subscriptionType": {
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
    "fullName": {
        type: "string"
    },
    "createdAt": {
        type: "integer"
    },
    ...properties
});

const subscriptionEvent = (properties = {}) => baseEvent({
    "id": {
        type: "string"
    },
    "subscriptionType": {
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
    "remoteFullName": {
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
    },
    ...properties
});

const commentEvent = (properties = {}) => baseEvent({
    "id": {
        type: "string"
    },
    "postingId": {
        type: "string"
    },
    "moment": {
        type: "integer"
    },
    ...properties
});

const remoteCommentVerificationEvent = (properties = {}) => baseEvent({
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
    ...properties
});

const remoteCommentEvent = (properties = {}) => baseEvent({
    "remoteNodeName": {
        type: "string"
    },
    "remotePostingId": {
        type: "string"
    },
    "remoteCommentId": {
        type: "string"
    },
    ...properties
});

export const EventPacket = schema({
    type: "object",
    properties: {
        "queueStartedAt": {
            type: "integer"
        },
        "ordinal": {
            type: "integer"
        },
        "sentAt": {
            type: "integer"
        },
        "cid": {
            type: "string"
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
});

export const EVENT_SCHEMES = {
    "SUBSCRIBED": baseEvent({
        "clientIp": {
            type: "string"
        }
    }),
    "PING": baseEvent(),
    "PROFILE_UPDATED": baseEvent(),
    "NODE_SETTINGS_CHANGED": baseEvent(),
    "CLIENT_SETTINGS_CHANGED": baseEvent(),
    "POSTING_ADDED": postingEvent(),
    "POSTING_UPDATED": postingEvent(),
    "POSTING_DELETED": postingEvent(),
    "POSTING_RESTORED": postingEvent(),
    "POSTING_REACTIONS_CHANGED": postingEvent(),
    "POSTING_COMMENTS_CHANGED": postingEvent({
        "total": {
            type: "integer"
        }
    }),
    "REGISTERED_NAME_OPERATION_STATUS": baseEvent(),
    "NODE_NAME_CHANGED": baseEvent({
        "name": {
            type: "string"
        },
        "fullName": {
            type: "string"
        },
        "gender": {
            type: "string"
        },
        "title": {
            type: "string"
        }
    }),
    "REMOTE_POSTING_VERIFIED": remotePostingVerificationEvent({
        "correct": {
            type: "boolean"
        }
    }),
    "REMOTE_POSTING_VERIFICATION_FAILED": remotePostingVerificationEvent({
        "errorCode": {
            type: "string"
        },
        "errorMessage": {
            type: "string"
        },
    }),
    "REMOTE_REACTION_ADDED": remoteReactionEvent({
        "negative": {
            type: "boolean"
        },
        "emoji": {
            type: "integer"
        },
        "createdAt": {
            type: "integer"
        }
    }),
    "REMOTE_REACTION_DELETED": remoteReactionEvent(),
    "REMOTE_REACTION_VERIFIED": remoteReactionVerificationEvent({
        "correct": {
            type: "boolean"
        }
    }),
    "REMOTE_REACTION_VERIFICATION_FAILED": remoteReactionVerificationEvent({
        "errorCode": {
            type: "string"
        },
        "errorMessage": {
            type: "string"
        },
    }),
    "DRAFT_POSTING_ADDED": draftPostingEvent(),
    "DRAFT_POSTING_UPDATED": draftPostingEvent(),
    "DRAFT_POSTING_DELETED": draftPostingEvent(),
    "POSTING_DRAFT_REVISION_UPDATED": draftPostingEvent(),
    "POSTING_DRAFT_REVISION_DELETED": draftPostingEvent(),
    "STORY_ADDED": storyEvent(),
    "STORY_DELETED": storyEvent(),
    "STORY_UPDATED": storyEvent(),
    "FEED_STATUS_UPDATED": baseEvent({
        "feedName": {
            type: "string"
        },
        "notViewed": {
            type: "integer"
        },
        "notRead": {
            type: "integer"
        }
    }),
    "STORIES_STATUS_UPDATED": baseEvent({
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
    }),
    "SUBSCRIBER_ADDED": subscriberEvent(),
    "SUBSCRIBER_DELETED": subscriberEvent(),
    "SUBSCRIPTION_ADDED": subscriptionEvent(),
    "SUBSCRIPTION_DELETED": subscriptionEvent(),
    "COMMENT_ADDED": commentEvent(),
    "COMMENT_UPDATED": commentEvent(),
    "COMMENT_DELETED": commentEvent(),
    "COMMENT_REACTIONS_CHANGED": commentEvent(),
    "REMOTE_COMMENT_ADDED": remoteCommentEvent(),
    "REMOTE_COMMENT_UPDATED": remoteCommentEvent(),
    "REMOTE_COMMENT_DELETED": remoteCommentEvent(),
    "REMOTE_COMMENT_VERIFIED": remoteCommentVerificationEvent({
        "correct": {
            type: "boolean"
        }
    }),
    "REMOTE_COMMENT_VERIFICATION_FAILED": remoteCommentVerificationEvent({
        "errorCode": {
            type: "string"
        },
        "errorMessage": {
            type: "string"
        },
    }),
    "REMOTE_NODE_FULL_NAME_CHANGED": baseEvent({
        "name": {
            type: "string"
        },
        "fullName": {
            type: "string"
        }
    }),
    "PEOPLE_CHANGED": baseEvent({
        "feedSubscribersTotal": {
            type: "integer"
        },
        "feedSubscriptionsTotal": {
            type: "integer"
        }
    }),
    "REMOTE_NODE_AVATAR_CHANGED": baseEvent({
        "name": {
            type: "string"
        },
        "avatar": AvatarImageType
    })
};

export const ALLOWED_SELF_EVENTS = new Set([
    "STORY_ADDED",
    "STORY_DELETED",
    "STORY_UPDATED",
    "FEED_STATUS_UPDATED",
    "NODE_NAME_CHANGED",
    "PEOPLE_CHANGED"
]);
