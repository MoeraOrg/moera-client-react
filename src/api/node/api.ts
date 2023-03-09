import { JSONSchemaType, ValidateFunction } from 'ajv';

import schema from "api/schema";
import * as API from "api/node/api-types";

const ResultType: JSONSchemaType<API.Result> = {
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
};

export const Result: ValidateFunction<API.Result> = schema(ResultType);

export const AvatarImageType: JSONSchemaType<API.AvatarImage> = {
    type: "object",
    properties: {
        "mediaId": {
            type: "string"
        },
        "path": {
            type: "string"
        },
        "width": {
            type: "integer"
        },
        "height": {
            type: "integer"
        },
        "shape": {
            type: "string",
            nullable: true
        },
    },
    required: ["mediaId", "path", "width", "height"],
    additionalProperties: false
};

export const AvatarInfoType: JSONSchemaType<API.AvatarInfo> = {
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
            type: "integer"
        },
        "height": {
            type: "integer"
        },
        "shape": {
            type: "string",
            nullable: true
        },
        "ordinal": {
            type: "integer"
        }
    },
    required: ["id", "mediaId", "path", "width", "height", "ordinal"],
    additionalProperties: false
};

export const AvatarInfo = schema(AvatarInfoType);

export const AvatarInfoArray = schema({
    type: "array",
    items: AvatarInfoType
} as JSONSchemaType<API.AvatarInfo[]>);

const WhoAmIType: JSONSchemaType<API.WhoAmI> = {
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
            ...AvatarImageType,
            nullable: true
        }
    },
    additionalProperties: false
};

export const WhoAmI = schema(WhoAmIType);

export const FundraiserInfoType: JSONSchemaType<API.FundraiserInfo> = {
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
        }
    },
    required: ["title"],
    additionalProperties: false
};

const ProfileInfoType: JSONSchemaType<API.ProfileInfo> = {
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
            anyOf: [
                {
                    const: ""
                },
                {
                    format: "email"
                }
            ],
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
        "bioHtml": {
            type: "string",
            nullable: true
        },
        "avatar": {
            ...AvatarInfoType,
            nullable: true
        },
        "fundraisers": {
            type: "array",
            items: FundraiserInfoType,
            nullable: true
        },
        "operations": {
            type: "object",
            properties: {
                "viewEmail": {
                    type: "string",
                    nullable: true
                },
                "edit": {
                    type: "string",
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    additionalProperties: false
};

export const ProfileInfo = schema(ProfileInfoType);

export const TokenInfoType: JSONSchemaType<API.TokenInfo> = {
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
        }
    },
    additionalProperties: false,
    required: ["id", "token", "permissions", "createdAt"]
};

export const TokenInfo = schema(TokenInfoType);

export const TokenInfoArray = schema({
    type: "array",
    items: TokenInfoType
} as JSONSchemaType<API.TokenInfo[]>);

const NodeNameInfoType: JSONSchemaType<API.NodeNameInfo> = {
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
        "operations": {
            type: "object",
            properties: {
                "manage": {
                    type: "string",
                    nullable: true
                },
            },
            nullable: true,
            additionalProperties: false
        }
    },
    additionalProperties: false
};

export const NodeNameInfo = schema(NodeNameInfoType);

const RegisteredNameSecretType: JSONSchemaType<API.RegisteredNameSecret> = {
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
    required: ["name", "mnemonic", "secret"],
    additionalProperties: false
};

export const RegisteredNameSecret = schema(RegisteredNameSecretType);

const LinkPreviewInfoType: JSONSchemaType<API.LinkPreviewInfo> = {
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
        }
    },
    additionalProperties: false
};

export const LinkPreviewInfo = schema(LinkPreviewInfoType);

const LinkPreviewType: JSONSchemaType<API.LinkPreview> = {
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
        }
    },
    additionalProperties: false
};

export const LinkPreview = schema(LinkPreviewType);

const BodyType: JSONSchemaType<API.Body> = {
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
            items: LinkPreviewType,
            nullable: true
        }
    },
    additionalProperties: false
};

export const Body = schema(BodyType);

const ReactionTotalInfoType: JSONSchemaType<API.ReactionTotalInfo> = {
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
            minimum: 0,
            maximum: 1,
            nullable: true
        }
    },
    required: ["emoji"],
    additionalProperties: false
};

const ReactionTotalsInfoType: JSONSchemaType<API.ReactionTotalsInfo> = {
    type: "object",
    properties: {
        "entryId": {
            type: "string"
        },
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
    required: ["entryId", "positive", "negative"],
    additionalProperties: false
};

export const ReactionTotalsInfo = schema(ReactionTotalsInfoType);

export const ReactionTotalsInfoArray = schema({
    type: "array",
    items: ReactionTotalsInfoType
} as JSONSchemaType<API.ReactionTotalsInfo[]>);

const UpdateInfoType: JSONSchemaType<API.UpdateInfo> = {
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
};

const FeedReferenceType: JSONSchemaType<API.FeedReference> = {
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
    required: ["feedName", "publishedAt", "moment", "storyId"],
    additionalProperties: false
};

export const BlockedInstantInfoType: JSONSchemaType<API.BlockedInstantInfo> = {
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
        "createdAt": {
            type: "integer"
        }
    },
    required: ["id", "storyType", "createdAt"],
    additionalProperties: false
};

export const BlockedInstantInfo = schema(BlockedInstantInfoType);

const BlockedPostingInstantInfoType: JSONSchemaType<API.BlockedPostingInstantInfo> = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        },
        "storyType": {
            type: "string"
        }
    },
    required: ["id", "storyType"],
    additionalProperties: false
};

const ClientReactionInfoType: JSONSchemaType<API.ClientReactionInfo> = {
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
        }
    },
    required: ["negative", "emoji", "createdAt"],
    additionalProperties: false
};

const AcceptedReactionsType: JSONSchemaType<API.AcceptedReactions> = {
    type: "object",
    properties: {
        "positive": {
            type: "string"
        },
        "negative": {
            type: "string"
        },
    },
    required: ["positive", "negative"],
    additionalProperties: false
};

const PostingSourceInfo: JSONSchemaType<API.PostingSourceInfo> = {
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
            ...AvatarImageType,
            nullable: true
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
    required: ["nodeName", "feedName", "postingId", "createdAt"],
    additionalProperties: false
};

const PublicMediaFileInfoType: JSONSchemaType<API.PublicMediaFileInfo> = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        },
        "path": {
            type: "string"
        },
        "width": {
            type: "integer"
        },
        "height": {
            type: "integer"
        },
        "orientation": {
            type: "integer",
            default: 1
        },
        "size": {
            type: "integer"
        }
    },
    required: ["id", "path", "width", "height", "size"],
    additionalProperties: false
};

export const PublicMediaFileInfo = schema(PublicMediaFileInfoType);

const MediaFilePreviewInfoType: JSONSchemaType<API.MediaFilePreviewInfo> = {
    type: "object",
    properties: {
        "targetWidth": {
            type: "integer"
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
        }
    },
    required: ["targetWidth", "width", "height"],
    additionalProperties: false
};

const PrivateMediaFileInfoType: JSONSchemaType<API.PrivateMediaFileInfo> = {
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
        "mimeType": {
            type: "string"
        },
        "width": {
            type: "integer"
        },
        "height": {
            type: "integer"
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
            items: MediaFilePreviewInfoType,
            nullable: true
        },
        "operations": {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    required: ["id", "hash", "path", "mimeType", "width", "height", "size"],
    additionalProperties: false
};

export const PrivateMediaFileInfo = schema(PrivateMediaFileInfoType);

const RemoteMediaInfoType: JSONSchemaType<API.RemoteMediaInfo> = {
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
        }
    },
    required: ["id"],
    additionalProperties: false
};

const MediaAttachmentType: JSONSchemaType<API.MediaAttachment> = {
    type: "object",
    properties: {
        "media": {
            ...PrivateMediaFileInfoType,
            nullable: true
        },
        "remoteMedia": {
            ...RemoteMediaInfoType,
            nullable: true
        },
        "embedded": {
            type: "boolean"
        }
    },
    required: ["embedded"],
    additionalProperties: false
};

export const MediaAttachment = schema(MediaAttachmentType);

const PostingOperationsInfoType: JSONSchemaType<API.PostingOperationsInfo> = {
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
        }
    },
    additionalProperties: false
};

export const PostingOperationsInfo = schema(PostingOperationsInfoType);

const CommentOperationsInfoType: JSONSchemaType<API.CommentOperationsInfo> = {
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
        }
    },
    additionalProperties: false
};

export const CommentOperationsInfo = schema(CommentOperationsInfoType);

const PostingInfoType: JSONSchemaType<API.EncodedPostingInfo> = {
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
            ...AvatarImageType,
            nullable: true
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
            ...AvatarImageType,
            nullable: true
        },
        "bodyPreview": {
            type: "string",
            nullable: true
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
            items: MediaAttachmentType,
            nullable: true
        },
        "heading": {
            type: "string"
        },
        "updateInfo": {
            ...UpdateInfoType,
            nullable: true
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
            items: FeedReferenceType,
            nullable: true
        },
        "blockedInstants": {
            type: "array",
            items: BlockedPostingInstantInfoType,
            nullable: true
        },
        "clientReaction": {
            ...ClientReactionInfoType,
            nullable: true
        },
        "operations": {
            ...PostingOperationsInfoType,
            nullable: true
        },
        "receiverOperations": {
            ...PostingOperationsInfoType,
            nullable: true
        },
        "commentOperations": {
            ...CommentOperationsInfoType,
            nullable: true
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
        "acceptedReactions": {
            ...AcceptedReactionsType,
            nullable: true
        },
        "reactions": {
            ...ReactionTotalsInfoType,
            nullable: true
        },
        "sources": {
            type: "array",
            items: PostingSourceInfo,
            nullable: true
        },
        "totalComments": {
            type: "integer",
            nullable: true
        }
    },
    required: ["id", "revisionId", "totalRevisions", "ownerName", "body", "heading", "createdAt"],
    additionalProperties: false
};

export const PostingInfo = schema(PostingInfoType);

export const PostingInfoArray = schema({
    type: "array",
    items: PostingInfoType
} as JSONSchemaType<API.EncodedPostingInfo[]>);

const PartialPostingInfoType: JSONSchemaType<API.EncodedPartialPostingInfo> = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        },
        "revisionId": {
            type: "string",
            nullable: true
        },
        "receiverRevisionId": {
            type: "string",
            nullable: true
        },
        "totalRevisions": {
            type: "integer",
            nullable: true
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
            ...AvatarImageType,
            nullable: true
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
            ...AvatarImageType,
            nullable: true
        },
        "bodyPreview": {
            type: "string",
            nullable: true
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
            type: "string",
            nullable: true
        },
        "bodyFormat": {
            type: "string",
            nullable: true
        },
        "media": {
            type: "array",
            items: MediaAttachmentType,
            nullable: true
        },
        "heading": {
            type: "string",
            nullable: true
        },
        "updateInfo": {
            ...UpdateInfoType,
            nullable: true
        },
        "createdAt": {
            type: "integer",
            nullable: true
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
            items: FeedReferenceType,
            nullable: true
        },
        "blockedInstants": {
            type: "array",
            items: BlockedPostingInstantInfoType,
            nullable: true
        },
        "clientReaction": {
            ...ClientReactionInfoType,
            nullable: true
        },
        "operations": {
            ...PostingOperationsInfoType,
            nullable: true
        },
        "receiverOperations": {
            ...PostingOperationsInfoType,
            nullable: true
        },
        "commentOperations": {
            ...CommentOperationsInfoType,
            nullable: true
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
        "acceptedReactions": {
            ...AcceptedReactionsType,
            nullable: true
        },
        "reactions": {
            ...ReactionTotalsInfoType,
            nullable: true
        },
        "sources": {
            type: "array",
            items: PostingSourceInfo,
            nullable: true
        },
        "totalComments": {
            type: "integer",
            nullable: true
        }
    },
    required: ["id"],
    additionalProperties: false
}

const FeedInfoType: JSONSchemaType<API.FeedInfo> = {
    type: "object",
    properties: {
        "feedName": {
            type: "string"
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
            type: "object",
            properties: {
                "add": {
                    type: "string",
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    required: ["feedName", "total"],
    additionalProperties: false
}

export const FeedInfo = schema(FeedInfoType);

export const FeedStatusType: JSONSchemaType<API.FeedStatus> = {
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
        }
    },
    required: ["total", "totalPinned"],
    additionalProperties: false
};

export const FeedStatus = schema(FeedStatusType);

const RepliedToType: JSONSchemaType<API.RepliedTo> = {
    type: "object",
    properties: {
        "id": {
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
        "avatar": {
            ...AvatarImageType,
            nullable: true
        },
        "heading": {
            type: "string",
            nullable: true
        },
    },
    required: ["id", "name"],
    additionalProperties: false
};

const CommentInfoType: JSONSchemaType<API.EncodedCommentInfo> = {
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
            ...AvatarImageType,
            nullable: true
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
            items: MediaAttachmentType,
            nullable: true
        },
        "heading": {
            type: "string"
        },
        "repliedTo": {
            ...RepliedToType,
            nullable: true
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
        "signature": {
            type: "string",
            nullable: true
        },
        "signatureVersion": {
            type: "integer",
            nullable: true
        },
        "operations": {
            ...CommentOperationsInfoType,
            nullable: true
        },
        "ownerOperations": {
            ...CommentOperationsInfoType,
            nullable: true
        },
        "seniorOperations": {
            ...CommentOperationsInfoType,
            nullable: true
        },
        "blockedOperations": {
            type: "array",
            items: {
                type: "string"
            },
            nullable: true
        },
        "acceptedReactions": {
            ...AcceptedReactionsType,
            nullable: true
        },
        "clientReaction": {
            ...ClientReactionInfoType,
            nullable: true
        },
        "seniorReaction": {
            ...ClientReactionInfoType,
            nullable: true
        },
        "reactions": {
            ...ReactionTotalsInfoType,
            nullable: true
        }
    },
    required: [
        "id", "ownerName", "postingId", "postingRevisionId", "revisionId", "totalRevisions", "body", "heading",
        "moment", "createdAt", "revisionCreatedAt"
    ],
    additionalProperties: false
};

const PartialCommentInfoType: JSONSchemaType<API.EncodedPartialCommentInfo> = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        },
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
            ...AvatarImageType,
            nullable: true
        },
        "postingId": {
            type: "string",
            nullable: true
        },
        "postingRevisionId": {
            type: "string",
            nullable: true
        },
        "revisionId": {
            type: "string",
            nullable: true
        },
        "totalRevisions": {
            type: "integer",
            nullable: true
        },
        "bodyPreview": {
            type: "string",
            nullable: true
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
            type: "string",
            nullable: true
        },
        "bodyFormat": {
            type: "string",
            nullable: true
        },
        "media": {
            type: "array",
            items: MediaAttachmentType,
            nullable: true
        },
        "heading": {
            type: "string",
            nullable: true
        },
        "repliedTo": {
            ...RepliedToType,
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
        "editedAt": {
            type: "integer",
            nullable: true
        },
        "deletedAt": {
            type: "integer",
            nullable: true
        },
        "revisionCreatedAt": {
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
            ...CommentOperationsInfoType,
            nullable: true
        },
        "ownerOperations": {
            ...CommentOperationsInfoType,
            nullable: true
        },
        "seniorOperations": {
            ...CommentOperationsInfoType,
            nullable: true
        },
        "blockedOperations": {
            type: "array",
            items: {
                type: "string"
            },
            nullable: true
        },
        "acceptedReactions": {
            ...AcceptedReactionsType,
            nullable: true
        },
        "clientReaction": {
            ...ClientReactionInfoType,
            nullable: true
        },
        "seniorReaction": {
            ...ClientReactionInfoType,
            nullable: true
        },
        "reactions": {
            ...ReactionTotalsInfoType,
            nullable: true
        }
    },
    required: ["id"],
    additionalProperties: false
}

export const CommentInfo = schema(CommentInfoType);

const StorySummaryNodeType: JSONSchemaType<API.StorySummaryNode> = {
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
        }
    },
    required: [],
    additionalProperties: false
};

const StorySummaryEntryType: JSONSchemaType<API.StorySummaryEntry> = {
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
        }
    },
    required: [],
    additionalProperties: false
};

const StorySummaryReactionType: JSONSchemaType<API.StorySummaryReaction> = {
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
        }
    },
    required: [],
    additionalProperties: false
};

const StorySummaryFriendGroupType: JSONSchemaType<API.StorySummaryFriendGroup> = {
    type: "object",
    properties: {
        "id": {
            type: "string",
            nullable: true
        },
        "title": {
            type: "string",
            nullable: true
        }
    },
    required: [],
    additionalProperties: false
};

const StorySummaryBlockedType: JSONSchemaType<API.StorySummaryBlocked> = {
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
        }
    },
    required: [],
    additionalProperties: false
};

export const StorySummaryDataType: JSONSchemaType<API.StorySummaryData> = {
    type: "object",
    properties: {
        "node": {
            ...StorySummaryNodeType,
            nullable: true
        },
        "posting": {
            ...StorySummaryEntryType,
            nullable: true
        },
        "comment": {
            ...StorySummaryEntryType,
            nullable: true
        },
        "comments": {
            type: "array",
            items: StorySummaryEntryType,
            nullable: true
        },
        "totalComments": {
            type: "integer",
            nullable: true
        },
        "repliedTo": {
            ...StorySummaryEntryType,
            nullable: true
        },
        "reaction": {
            ...StorySummaryReactionType,
            nullable: true
        },
        "reactions": {
            type: "array",
            items: StorySummaryReactionType,
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
            ...StorySummaryFriendGroupType,
            nullable: true
        },
        "blocked": {
            ...StorySummaryBlockedType,
            nullable: true
        },
        "description": {
            type: "string",
            nullable: true
        }
    },
    required: [],
    additionalProperties: false
};

const StoryInfoType: JSONSchemaType<API.EncodedStoryInfo> = {
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
        "posting": {
            ...PartialPostingInfoType,
            nullable: true
        },
        "comment": {
            ...PartialCommentInfoType,
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
            ...AvatarImageType,
            nullable: true
        },
        "summary": {
            type: "string",
            nullable: true
        },
        "summaryData": {
            ...StorySummaryDataType,
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
        "remoteMediaId": {
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
    required: ["id", "feedName", "storyType", "createdAt", "publishedAt", "moment"],
    additionalProperties: false
};

export const StoryInfo = schema(StoryInfoType);

const FeedSliceInfoType: JSONSchemaType<API.EncodedFeedSliceInfo> = {
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
        },
        "totalInPast": {
            type: "integer"
        },
        "totalInFuture": {
            type: "integer"
        }
    },
    required: ["before", "after", "stories", "totalInPast", "totalInFuture"],
    additionalProperties: false
};

export const FeedSliceInfo = schema(FeedSliceInfoType);

const ChoiceType: JSONSchemaType<API.Choice<API.SourceFormat>> = {
    type: "object",
    properties: {
        "value": {
            type: "string"
        },
        "title": {
            type: "string"
        }
    },
    required: ["value", "title"],
    additionalProperties: false
};

const PostingFeaturesType: JSONSchemaType<API.PostingFeatures> = {
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
            items: ChoiceType
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
        }
    },
    required: [
        "subjectPresent", "sourceFormats", "mediaMaxSize", "imageRecommendedSize", "imageRecommendedPixels",
        "imageFormats"
    ],
    additionalProperties: false
};

export const ContactInfoType: JSONSchemaType<API.ContactInfo> = {
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
            ...AvatarImageType,
            nullable: true
        },
        "closeness": {
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
                }
            },
            nullable: true,
            additionalProperties: false
        },
        "adminOperations": {
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
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    required: ["nodeName", "closeness"],
    additionalProperties: false
};

export const ContactInfo = schema(ContactInfoType);

export const ContactInfoArray = schema({
    type: "array",
    items: ContactInfoType
} as JSONSchemaType<API.ContactInfo[]>);

export const FriendGroupInfoType: JSONSchemaType<API.FriendGroupInfo> = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        },
        "title": {
            type: "string",
            nullable: true,
        },
        "createdAt": {
            type: "number"
        },
        "operations": {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    required: ["id", "createdAt"],
    additionalProperties: false
};

export const FriendGroupInfo = schema(FriendGroupInfoType);

export const FriendGroupInfoArray = schema({
    type: "array",
    items: FriendGroupInfoType
} as JSONSchemaType<API.FriendGroupInfo[]>);

export const FriendGroupDetailsType: JSONSchemaType<API.FriendGroupDetails> = {
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
            type: "number"
        },
        "operations": {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    required: ["id", "addedAt"],
    additionalProperties: false
};

export const FriendGroupDetails = schema(FriendGroupDetailsType);

export const FriendInfoType: JSONSchemaType<API.FriendInfo> = {
    type: "object",
    properties: {
        "nodeName": {
            type: "string"
        },
        "contact": {
            ...ContactInfoType,
            nullable: true
        },
        "groups": {
            type: "array",
            items: FriendGroupDetailsType,
            nullable: true
        }
    },
    required: ["nodeName"],
    additionalProperties: false
};

export const FriendInfo = schema(FriendInfoType);

export const FriendInfoArray = schema({
    type: "array",
    items: FriendInfoType
} as JSONSchemaType<API.FriendInfo[]>);

export const FriendOfInfoType: JSONSchemaType<API.FriendOfInfo> = {
    type: "object",
    properties: {
        "remoteNodeName": {
            type: "string"
        },
        "contact": {
            ...ContactInfoType,
            nullable: true
        },
        "groups": {
            type: "array",
            items: FriendGroupDetailsType,
            nullable: true
        }
    },
    required: ["remoteNodeName"],
    additionalProperties: false
};

export const FriendOfInfo = schema(FriendOfInfoType);

export const FriendOfInfoArray = schema({
    type: "array",
    items: FriendOfInfoType
} as JSONSchemaType<API.FriendOfInfo[]>);

const FriendGroupsFeaturesType: JSONSchemaType<API.FriendGroupsFeatures> = {
    type: "object",
    properties: {
        "available": {
            type: "array",
            items: FriendGroupInfoType
        },
        "memberOf": {
            type: "array",
            items: FriendGroupDetailsType,
            nullable: true
        }
    },
    required: ["available"],
    additionalProperties: false
};

export const FriendGroupsFeatures = schema(FriendGroupsFeaturesType);

export const FeaturesType: JSONSchemaType<API.Features> = {
    type: "object",
    properties: {
        "posting": PostingFeaturesType,
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
            ...FriendGroupsFeaturesType,
            nullable: true
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
    required: ["posting", "feedWidth"],
    additionalProperties: false
};

export const Features = schema(FeaturesType);

const SettingInfoType: JSONSchemaType<API.SettingInfo> = {
    type: "object",
    properties: {
        "name": {
            type: "string"
        },
        "value": {
            type: "string"
        }
    },
    required: ["name", "value"],
    additionalProperties: false
};

export const SettingInfoArray = schema({
    type: "array",
    items: SettingInfoType
} as JSONSchemaType<API.SettingInfo[]>);

const SettingTypeModifiersType: JSONSchemaType<API.SettingTypeModifiers> = {
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
        }
    },
    additionalProperties: false
};

const SettingMetaInfoType: JSONSchemaType<API.SettingMetaInfo> = {
    type: "object",
    properties: {
        "name": {
            type: "string"
        },
        "type": {
            type: "string"
        },
        "privileged": {
            type: "boolean",
            default: false
        },
        "defaultValue": {
            type: "string",
            nullable: true
        },
        "title": {
            type: "string"
        },
        "modifiers": {
            ...SettingTypeModifiersType,
            nullable: true
        }
    },
    required: ["name", "type", "privileged", "title"],
    additionalProperties: false
};

export const SettingMetaInfoArray = schema({
    type: "array",
    items: SettingMetaInfoType
} as JSONSchemaType<API.SettingMetaInfo[]>);

const AsyncOperationCreatedType: JSONSchemaType<API.AsyncOperationCreated> = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        }
    },
    required: ["id"],
    additionalProperties: false
};

export const AsyncOperationCreated = schema(AsyncOperationCreatedType);

const CarteInfoType: JSONSchemaType<API.CarteInfo> = {
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
        "permissions": {
            type: "array",
            items: {
                type: "string"
            },
            nullable: true
        }
    },
    required: ["carte", "beginning", "deadline"],
    additionalProperties: false
};

const CarteSetType: JSONSchemaType<API.CarteSet> = {
    type: "object",
    properties: {
        "cartesIp": {
            type: "string"
        },
        "cartes": {
            type: "array",
            items: CarteInfoType
        },
        "createdAt": {
            type: "integer"
        }
    },
    required: ["cartesIp", "cartes", "createdAt"],
    additionalProperties: false
};

export const CarteSet = schema(CarteSetType);

const ReactionInfoType: JSONSchemaType<API.ReactionInfo> = {
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
            ...AvatarImageType,
            nullable: true
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
            type: "object",
            properties: {
                "delete": {
                    type: "string",
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    additionalProperties: false
};

export const ReactionInfo = schema(ReactionInfoType);

export const ReactionInfoArray = schema({
    type: "array",
    items: ReactionInfoType
} as JSONSchemaType<API.ReactionInfo[]>);

const ReactionCreatedType: JSONSchemaType<API.ReactionCreated> = {
    type: "object",
    properties: {
        "reaction": {
            ...ReactionInfoType,
            nullable: true
        },
        "totals": ReactionTotalsInfoType
    },
    required: ["totals"],
    additionalProperties: false
};

export const ReactionCreated = schema(ReactionCreatedType);

const ReactionsSliceInfoType: JSONSchemaType<API.ReactionsSliceInfo> = {
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
    required: ["before", "after", "total", "reactions"],
    additionalProperties: false
};

export const ReactionsSliceInfo = schema(ReactionsSliceInfoType);

export const SubscriberInfoType: JSONSchemaType<API.SubscriberInfo> = {
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
            ...ContactInfoType,
            nullable: true
        },
        "createdAt": {
            type: "integer"
        },
        "operations": {
            type: "object",
            properties: {
                "view": {
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
        },
        "ownerOperations": {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        },
        "adminOperations": {
            type: "object",
            properties: {
                "view": {
                    type: "string",
                    nullable: true
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    required: ["id", "type", "nodeName", "createdAt"],
    additionalProperties: false
};

export const SubscriberInfo = schema(SubscriberInfoType);

export const SubscriberInfoArray = schema({
    type: "array",
    items: SubscriberInfoType
} as JSONSchemaType<API.SubscriberInfo[]>);

export const SubscriptionInfoType: JSONSchemaType<API.SubscriptionInfo> = {
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
            ...ContactInfoType,
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
        },
        "operations": {
            type: "object",
            properties: {
                "view": {
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
    required: ["id", "type", "remoteNodeName", "createdAt"],
    additionalProperties: false
};

export const SubscriptionInfo = schema(SubscriptionInfoType);

export const SubscriptionInfoArray = schema({
    type: "array",
    items: SubscriptionInfoType
} as JSONSchemaType<API.SubscriptionInfo[]>);

const ActivityReactionInfoType: JSONSchemaType<API.ActivityReactionInfo> = {
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
            ...AvatarImageType,
            nullable: true
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
    required: ["remoteNodeName", "remotePostingId", "negative", "emoji", "createdAt"],
    additionalProperties: false
};

export const ActivityReactionInfoArray = schema({
    type: "array",
    items: ActivityReactionInfoType
} as JSONSchemaType<API.ActivityReactionInfo[]>);

const PeopleGeneralInfoType: JSONSchemaType<API.PeopleGeneralInfo> = {
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
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    additionalProperties: false
};

export const PeopleGeneralInfo = schema(PeopleGeneralInfoType);

const CommentCreatedType: JSONSchemaType<API.EncodedCommentCreated> = {
    type: "object",
    properties: {
        "comment": CommentInfoType,
        "total": {
            type: "integer"
        }
    },
    required: ["comment", "total"],
    additionalProperties: false
};

export const CommentCreated = schema(CommentCreatedType);

const CommentsSliceInfoType: JSONSchemaType<API.EncodedCommentsSliceInfo> = {
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
        },
        "total": {
            type: "integer"
        },
        "totalInPast": {
            type: "integer"
        },
        "totalInFuture": {
            type: "integer"
        }
    },
    required: ["before", "after", "comments", "total", "totalInPast", "totalInFuture"],
    additionalProperties: false
};

export const CommentsSliceInfo = schema(CommentsSliceInfoType);

const CommentTotalInfoType: JSONSchemaType<API.CommentTotalInfo> = {
    type: "object",
    properties: {
        "total": {
            type: "integer"
        }
    },
    required: ["total"],
    additionalProperties: false
};

export const CommentTotalInfo = schema(CommentTotalInfoType);

const DomainInfoType: JSONSchemaType<API.DomainInfo> = {
    type: "object",
    properties: {
        "name": {
            type: "string"
        },
        "nodeId": {
            type: "string"
        }
    },
    required: ["name", "nodeId"],
    additionalProperties: false
};

export const DomainInfo = schema(DomainInfoType);

const DomainAvailableType: JSONSchemaType<API.DomainAvailable> = {
    type: "object",
    properties: {
        "name": {
            type: "string"
        }
    },
    required: ["name"],
    additionalProperties: false
};

export const DomainAvailable = schema(DomainAvailableType);

const EmailHintType: JSONSchemaType<API.EmailHint> = {
    type: "object",
    properties: {
        "emailHint": {
            type: "string"
        }
    },
    required: ["emailHint"],
    additionalProperties: false
};

export const EmailHint = schema(EmailHintType);

const AvatarOrdinalType: JSONSchemaType<API.AvatarOrdinal> = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        },
        "ordinal": {
            type: "integer"
        }
    },
    required: ["id", "ordinal"],
    additionalProperties: false
};

export const AvatarOrdinalArray = schema({
    type: "array",
    items: AvatarOrdinalType
} as JSONSchemaType<API.AvatarOrdinal[]>);

const DraftInfoType: JSONSchemaType<API.EncodedDraftInfo> = {
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
            ...AvatarImageType,
            nullable: true
        },
        "acceptedReactions": {
            ...AcceptedReactionsType,
            nullable: true
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
            items: MediaAttachmentType,
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
            ...UpdateInfoType,
            nullable: true
        },
        "operations": {
            type: "object",
            properties: {
                "view": {
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
                }
            },
            nullable: true,
            additionalProperties: false
        },
        "commentOperations": {
            type: "object",
            properties: {
                "view": {
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
                }
            },
            nullable: true,
            additionalProperties: false
        }
    },
    required: ["id", "draftType", "receiverName", "createdAt", "body", "heading"],
    additionalProperties: false
};

export const DraftInfo = schema(DraftInfoType);

export const DraftInfoList = schema({
    type: "array",
    items: DraftInfoType
} as JSONSchemaType<API.EncodedDraftInfo[]>);

const PluginInfoType: JSONSchemaType<API.PluginInfo> = {
    type: "object",
    properties: {
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
            items: SettingMetaInfoType,
            nullable: true
        },
        "tokenId": {
            type: "string",
            nullable: true
        }
    },
    required: ["local", "name"],
    additionalProperties: false
};

export const PluginInfo = schema(PluginInfoType);

export const PluginInfoArray = schema({
    type: "array",
    items: PluginInfoType
} as JSONSchemaType<API.PluginInfo[]>);

const BlockedUserInfoType: JSONSchemaType<API.BlockedUserInfo> = {
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
            ...ContactInfoType,
            nullable: true
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
        }
    },
    required: ["id", "blockedOperation", "nodeName", "createdAt"],
    additionalProperties: false
};

export const BlockedUserInfo = schema(BlockedUserInfoType);

export const BlockedUserInfoArray = schema({
    type: "array",
    items: BlockedUserInfoType
} as JSONSchemaType<API.BlockedUserInfo[]>);

const BlockedUsersChecksumsType: JSONSchemaType<API.BlockedUsersChecksums> = {
    type: "object",
    properties: {
        "visibility": {
            type: "integer"
        }
    },
    required: ["visibility"],
    additionalProperties: false
};

export const BlockedUsersChecksums = schema(BlockedUsersChecksumsType);

const BlockedByUserInfoType: JSONSchemaType<API.BlockedByUserInfo> = {
    type: "object",
    properties: {
        "id": {
            type: "string"
        },
        "blockedOperation": {
            type: "string"
        },
        "contact": {
            ...ContactInfoType,
            nullable: true
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
        }
    },
    required: ["id", "blockedOperation", "nodeName", "createdAt"],
    additionalProperties: false
};

export const BlockedByUserInfo = schema(BlockedByUserInfoType);

export const BlockedByUserInfoArray = schema({
    type: "array",
    items: BlockedByUserInfoType
} as JSONSchemaType<API.BlockedByUserInfo[]>);
