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
    "moment": {
        type: "integer"
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
    "SUBSCRIBED": baseEvent(),
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
    })
};
