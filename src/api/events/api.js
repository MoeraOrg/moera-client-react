import schema from "api/schema";

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
    "PROFILE_UPDATED": baseEvent(),
    "NODE_SETTINGS_CHANGED": baseEvent(),
    "CLIENT_SETTINGS_CHANGED": baseEvent(),
    "POSTING_ADDED": postingEvent(),
    "POSTING_UPDATED": postingEvent(),
    "POSTING_DELETED": postingEvent(),
    "POSTING_RESTORED": postingEvent(),
    "POSTING_REACTIONS_CHANGED": postingEvent(),
    "REGISTERED_NAME_OPERATION_STATUS": baseEvent(),
    "NODE_NAME_CHANGED": baseEvent({
        "name": {
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
    "STORY_UPDATED": storyEvent()
};
