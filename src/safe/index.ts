/* eslint-disable no-restricted-globals */

import { isSchemaValid } from "api/schema";
import { NODE_API_VALIDATORS } from "api/node/api-validators";
import { safeValidateResponse, SafeValidationErrors, SafeWorkerMessage } from "safe/message-types";
import {
    Body,
    BodyFormat,
    CommentCreated,
    CommentInfo,
    CommentRevisionInfo,
    CommentsSliceInfo,
    DraftInfo,
    EncodedCommentCreated,
    EncodedCommentInfo,
    EncodedCommentRevisionInfo,
    EncodedCommentsSliceInfo,
    EncodedDraftInfo,
    EncodedEntryInfo,
    EncodedFeedSliceInfo,
    EncodedPostingInfo,
    EncodedPostingRevisionInfo,
    EncodedSearchEntryInfo, EncodedSearchHashtagSliceInfo, EncodedSearchTextPageInfo,
    EncodedStoryInfo,
    EntryInfo,
    FeedSliceInfo,
    PostingInfo,
    PostingRevisionInfo,
    SearchEntryInfo,
    SourceFormat,
    StoryInfo
} from "api";

self.onmessage = (e: MessageEvent) => {
    const message = e.data as SafeWorkerMessage;
    switch (message.type) {
        case "VALIDATE": {
            let {id, schemaName, data, decodeBodies: decode} = message.payload;
            const schema = NODE_API_VALIDATORS[schemaName];
            if (schema == null) {
                postMessage(safeValidateResponse(id, false, [{message: `Schema ${schemaName} is not found`}]));
                break;
            }
            let valid = isSchemaValid(schema, data);
            let errors: SafeValidationErrors | null | undefined = schema.errors;
            if (valid && decode) {
                try {
                    data = decodeBodies(data);
                } catch (e) {
                    valid = false;
                    if (e instanceof BodyError) {
                        errors = [{message: "Server returned incorrect Body"}];
                        if (e.errors != null) {
                            errors.concat(e.errors);
                        }
                    }
                }
            }
            postMessage(safeValidateResponse(id, valid, data, errors));
            break;
        }
    }
}

class BodyError {
    errors?: SafeValidationErrors | null;

    constructor(errors: SafeValidationErrors | null | undefined) {
        this.errors = errors;
    }
}

function decodeBody(encoded: string, format: BodyFormat | SourceFormat | null): Body {
    if (format != null && format.toLowerCase() === "application") {
        return {text: ""};
    }
    let body = JSON.parse(encoded);
    const schema = NODE_API_VALIDATORS['Body'];
    if (schema == null) {
        throw new BodyError([{message: "Schema Body is not found"}]);
    }
    if (!isSchemaValid(schema, body)) {
        throw new BodyError(schema.errors);
    }
    return body;
}

type Entities = Partial<PostingInfo | PostingRevisionInfo | CommentInfo | CommentRevisionInfo | StoryInfo
    | CommentCreated | DraftInfo | FeedSliceInfo | CommentsSliceInfo | EntryInfo | SearchEntryInfo>;
type EncodedEntities = Partial<EncodedPostingInfo | EncodedPostingRevisionInfo | EncodedCommentInfo
    | EncodedCommentRevisionInfo | EncodedStoryInfo | EncodedCommentCreated | EncodedDraftInfo | EncodedFeedSliceInfo
    | EncodedCommentsSliceInfo | EncodedEntryInfo | EncodedSearchEntryInfo | EncodedSearchHashtagSliceInfo
    | EncodedSearchTextPageInfo>;

function decodeBodies(data: EncodedEntities[]): Entities[];
function decodeBodies(data: EncodedEntities): Entities;
function decodeBodies(data: EncodedEntities | EncodedEntities[]): Entities | Entities[] {
    if (Array.isArray(data)) {
        return data.map(p => decodeBodies(p));
    }

    const decoded: any = {...data};
    if ("stories" in data && data.stories != null) {
        decoded.stories = data.stories.map(p => decodeBodies(p));
    }
    if ("comments" in data && data.comments != null) {
        decoded.comments = data.comments.map(c => decodeBodies(c));
    }
    if ("entries" in data && data.entries != null) {
        decoded.entries = data.entries.map(e => decodeBodies(e));
    }
    if ("comment" in data && data.comment != null) {
        decoded.comment = decodeBodies(data.comment);
    }
    if ("posting" in data && data.posting != null) {
        decoded.posting = decodeBodies(data.posting);
    }
    if ("body" in data && data.body != null) {
        decoded.body = decodeBody(data.body, data.bodyFormat ?? null);
    }
    if ("bodyPreview" in data && data.bodyPreview != null) {
        decoded.bodyPreview = decodeBody(data.bodyPreview, data.bodyFormat ?? null);
    }
    if ("bodySrc" in data && data.bodySrc != null) {
        decoded.bodySrc = decodeBody(data.bodySrc, data.bodySrcFormat ?? null);
    }
    return decoded;
}
