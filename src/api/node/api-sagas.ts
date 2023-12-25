// This file is generated

import { callApi, CallApiResult, ErrorFilter } from "api/node/call";
import * as API from "api/node/api-types";
import { ProgressHandler } from 'api/fetcher';
import { ClientAction } from "state/action";
import { urlWithParameters, ut } from "util/url";
import { commaSeparatedFlags } from "util/misc";

export function* searchActivityReactions(
    caller: ClientAction | null, nodeName: string | null, filter: API.ActivityReactionFilter,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ActivityReactionInfo[]> {

    const location = "/activity/reactions/search";
    return yield* callApi<API.ActivityReactionInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "ActivityReactionInfoArray",
        errorFilter
    });
}

export function* getRemotePostingVerificationStatus(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.RemotePostingVerificationInfo> {

    const location = ut`/async-operations/remote-posting-verification/${id}`;
    return yield* callApi<API.RemotePostingVerificationInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "RemotePostingVerificationInfo", errorFilter
    });
}

export function* getRemoteReactionVerificationStatus(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.RemoteReactionVerificationInfo> {

    const location = ut`/async-operations/remote-reaction-verification/${id}`;
    return yield* callApi<API.RemoteReactionVerificationInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "RemoteReactionVerificationInfo", errorFilter
    });
}

export function* getAvatars(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false
): CallApiResult<API.AvatarInfo[]> {

    const location = "/avatars";
    return yield* callApi<API.AvatarInfo[]>({
        caller, nodeName, method: "GET", location, schema: "AvatarInfoArray", errorFilter
    });
}

export function* createAvatar(
    caller: ClientAction | null, nodeName: string | null, avatar: API.AvatarAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AvatarInfo> {

    const location = "/avatars";
    return yield* callApi<API.AvatarInfo>({
        caller, nodeName, method: "POST", location, body: avatar, auth, schema: "AvatarInfo", errorFilter
    });
}

export function* getAvatar(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false
): CallApiResult<API.AvatarInfo> {

    const location = ut`/avatars/${id}`;
    return yield* callApi<API.AvatarInfo>({
        caller, nodeName, method: "GET", location, schema: "AvatarInfo", errorFilter
    });
}

export function* deleteAvatar(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/avatars/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* reorderAvatars(
    caller: ClientAction | null, nodeName: string | null, order: API.AvatarsOrdered,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AvatarOrdinal[]> {

    const location = "/avatars/reorder";
    return yield* callApi<API.AvatarOrdinal[]>({
        caller, nodeName, method: "POST", location, body: order, auth, schema: "AvatarOrdinalArray",
        errorFilter
    });
}

export function* blockInstant(
    caller: ClientAction | null, nodeName: string | null, instant: API.BlockedInstantAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.BlockedInstantInfo> {

    const location = "/blocked-instants";
    return yield* callApi<API.BlockedInstantInfo>({
        caller, nodeName, method: "POST", location, body: instant, auth, schema: "BlockedInstantInfo",
        errorFilter
    });
}

export function* getBlockedInstant(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.BlockedInstantInfo> {

    const location = ut`/blocked-instants/${id}`;
    return yield* callApi<API.BlockedInstantInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "BlockedInstantInfo", errorFilter
    });
}

export function* unblockInstant(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/blocked-instants/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* searchBlockedInstants(
    caller: ClientAction | null, nodeName: string | null, filter: API.BlockedInstantFilter,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.BlockedInstantInfo[]> {

    const location = "/blocked-instants/search";
    return yield* callApi<API.BlockedInstantInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "BlockedInstantInfoArray",
        errorFilter
    });
}

export function* blockUser(
    caller: ClientAction | null, nodeName: string | null, user: API.BlockedUserAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.BlockedUserInfo> {

    const location = "/people/blocked-users";
    return yield* callApi<API.BlockedUserInfo>({
        caller, nodeName, method: "POST", location, body: user, auth, schema: "BlockedUserInfo", errorFilter
    });
}

export function* getBlockedUser(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.BlockedUserInfo> {

    const location = ut`/people/blocked-users/${id}`;
    return yield* callApi<API.BlockedUserInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "BlockedUserInfo", errorFilter
    });
}

export function* unblockUser(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/people/blocked-users/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* searchBlockedUsers(
    caller: ClientAction | null, nodeName: string | null, filter: API.BlockedUserFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.BlockedUserInfo[]> {

    const location = "/people/blocked-users/search";
    return yield* callApi<API.BlockedUserInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "BlockedUserInfoArray",
        errorFilter
    });
}

export function* getBlockedUsersChecksums(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.BlockedUsersChecksums> {

    const location = "/people/blocked-users/checksums";
    return yield* callApi<API.BlockedUsersChecksums>({
        caller, nodeName, method: "GET", location, auth, schema: "BlockedUsersChecksums", errorFilter
    });
}

export function* getBlockedByUser(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.BlockedByUserInfo> {

    const location = ut`/people/blocked-by-users/${id}`;
    return yield* callApi<API.BlockedByUserInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "BlockedByUserInfo", errorFilter
    });
}

export function* searchBlockedByUsers(
    caller: ClientAction | null, nodeName: string | null, filter: API.BlockedByUserFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.BlockedByUserInfo[]> {

    const location = "/people/blocked-by-users/search";
    return yield* callApi<API.BlockedByUserInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "BlockedByUserInfoArray",
        errorFilter
    });
}

export function* getCartes(
    caller: ClientAction | null, nodeName: string | null, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.CarteSet> {

    const location = urlWithParameters(ut`/cartes`, {limit});
    return yield* callApi<API.CarteSet>({
        caller, nodeName, method: "GET", location, auth, schema: "CarteSet", errorFilter
    });
}

export function* getCommentsSlice(
    caller: ClientAction | null, nodeName: string | null, postingId: string, after: number | null = null,
    before: number | null = null, limit: number | null = null, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.CommentsSliceInfo> {

    const location = urlWithParameters(ut`/postings/${postingId}/comments`, {after, before, limit});
    return yield* callApi<API.CommentsSliceInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "CommentsSliceInfo", decodeBodies: true,
        errorFilter
    });
}

export function* createComment(
    caller: ClientAction | null, nodeName: string | null, postingId: string, comment: API.CommentText,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.CommentCreated> {

    const location = ut`/postings/${postingId}/comments`;
    return yield* callApi<API.CommentCreated>({
        caller, nodeName, method: "POST", location, body: comment, auth, schema: "CommentCreated",
        decodeBodies: true, errorFilter
    });
}

export function* getComment(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string,
    withSource: boolean = false, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.CommentInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters(ut`/postings/${postingId}/comments/${commentId}`, {include});
    return yield* callApi<API.CommentInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "CommentInfo", decodeBodies: true, errorFilter
    });
}

export function* updateAllComments(
    caller: ClientAction | null, nodeName: string | null, postingId: string, attributes: API.CommentMassAttributes,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.Result> {

    const location = ut`/postings/${postingId}/comments`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: attributes, auth, schema: "Result", errorFilter
    });
}

export function* updateComment(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string,
    comment: API.CommentText, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.CommentInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}`;
    return yield* callApi<API.CommentInfo>({
        caller, nodeName, method: "PUT", location, body: comment, auth, schema: "CommentInfo",
        decodeBodies: true, errorFilter
    });
}

export function* deleteComment(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.CommentTotalInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}`;
    return yield* callApi<API.CommentTotalInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "CommentTotalInfo", errorFilter
    });
}

export function* getPostingsAttachedToComment(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingInfo[]> {

    const location = ut`/postings/${postingId}/comments/${commentId}/attached`;
    return yield* callApi<API.PostingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* getCommentRevisions(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.CommentRevisionInfo[]> {

    const location = ut`/postings/${postingId}/comments/${commentId}/revisions`;
    return yield* callApi<API.CommentRevisionInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "CommentRevisionInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* getCommentRevision(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.CommentRevisionInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/revisions/${id}`;
    return yield* callApi<API.CommentRevisionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "CommentRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export function* createCommentReaction(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string,
    reaction: API.ReactionDescription, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionCreated> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions`;
    return yield* callApi<API.ReactionCreated>({
        caller, nodeName, method: "POST", location, body: reaction, auth, schema: "ReactionCreated",
        errorFilter
    });
}

export function* updateCommentReaction(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string, ownerName: string,
    reaction: API.ReactionOverride, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`;
    return yield* callApi<API.ReactionInfo>({
        caller, nodeName, method: "PUT", location, body: reaction, auth, schema: "ReactionInfo", errorFilter
    });
}

export function* getCommentReactionsSlice(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string,
    negative: boolean | null = null, emoji: number | null = null, before: number | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionsSliceInfo> {

    const location = urlWithParameters(
        ut`/postings/${postingId}/comments/${commentId}/reactions`,
        {negative, emoji, before, limit}
    );
    return yield* callApi<API.ReactionsSliceInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionsSliceInfo", errorFilter
    });
}

export function* getCommentReaction(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string, ownerName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`;
    return yield* callApi<API.ReactionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionInfo", errorFilter
    });
}

export function* deleteAllCommentReactions(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* deleteCommentReaction(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string, ownerName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`;
    return yield* callApi<API.ReactionTotalsInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "ReactionTotalsInfo", errorFilter
    });
}

export function* getCommentReactionTotals(
    caller: ClientAction | null, nodeName: string | null, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reaction-totals`;
    return yield* callApi<API.ReactionTotalsInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionTotalsInfo", errorFilter
    });
}

export function* getContacts(
    caller: ClientAction | null, nodeName: string | null, query: string | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ContactInfo[]> {

    const location = urlWithParameters(ut`/people/contacts`, {query, limit});
    return yield* callApi<API.ContactInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "ContactInfoArray", errorFilter
    });
}

export function* checkCredentials(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false
): CallApiResult<API.CredentialsCreated> {

    const location = "/credentials";
    return yield* callApi<API.CredentialsCreated>({
        caller, nodeName, method: "GET", location, schema: "CredentialsCreated", errorFilter
    });
}

export function* createCredentials(
    caller: ClientAction | null, nodeName: string | null, credentials: API.Credentials,
    errorFilter: ErrorFilter = false
): CallApiResult<API.Result> {

    const location = "/credentials";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: credentials, schema: "Result", errorFilter
    });
}

export function* updateCredentials(
    caller: ClientAction | null, nodeName: string | null, credentials: API.CredentialsChange,
    errorFilter: ErrorFilter = false
): CallApiResult<API.Result> {

    const location = "/credentials";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: credentials, schema: "Result", errorFilter
    });
}

export function* deleteCredentials(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/credentials";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* resetCredentials(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false
): CallApiResult<API.EmailHint> {

    const location = "/credentials/reset";
    return yield* callApi<API.EmailHint>({
        caller, nodeName, method: "POST", location, schema: "EmailHint", errorFilter
    });
}

export function* getDeletedPostings(
    caller: ClientAction | null, nodeName: string | null, page: number | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingInfo[]> {

    const location = urlWithParameters(ut`/deleted-postings`, {page, limit});
    return yield* callApi<API.PostingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* getDeletedPosting(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PostingInfo> {

    const location = ut`/deleted-postings/${id}`;
    return yield* callApi<API.PostingInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfo", decodeBodies: true, errorFilter
    });
}

export function* restoreDeletedPosting(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PostingInfo> {

    const location = ut`/deleted-postings/${id}/restore`;
    return yield* callApi<API.PostingInfo>({
        caller, nodeName, method: "POST", location, auth, schema: "PostingInfo", decodeBodies: true,
        errorFilter
    });
}

export function* getDeletePostingRevisions(
    caller: ClientAction | null, nodeName: string | null, postingId: string, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingRevisionInfo[]> {

    const location = urlWithParameters(ut`/deleted-postings/${postingId}/revisions`, {limit});
    return yield* callApi<API.PostingRevisionInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingRevisionInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* getDeletedPostingRevision(
    caller: ClientAction | null, nodeName: string | null, postingId: string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingRevisionInfo> {

    const location = ut`/deleted-postings/${postingId}/revisions/${id}`;
    return yield* callApi<API.PostingRevisionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export function* restoreDeletedPostingRevision(
    caller: ClientAction | null, nodeName: string | null, postingId: string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingRevisionInfo> {

    const location = ut`/postings/${postingId}/revisions/${id}/restore`;
    return yield* callApi<API.PostingRevisionInfo>({
        caller, nodeName, method: "POST", location, auth, schema: "PostingRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export function* getDomains(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.DomainInfo[]> {

    const location = "/domains";
    return yield* callApi<API.DomainInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "DomainInfoArray", errorFilter
    });
}

export function* getDomain(
    caller: ClientAction | null, nodeName: string | null, name: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.DomainInfo> {

    const location = ut`/domains/${name}`;
    return yield* callApi<API.DomainInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "DomainInfo", errorFilter
    });
}

export function* createDomain(
    caller: ClientAction | null, nodeName: string | null, domain: API.DomainAttributes,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.DomainInfo> {

    const location = "/domains";
    return yield* callApi<API.DomainInfo>({
        caller, nodeName, method: "POST", location, body: domain, auth, schema: "DomainInfo", errorFilter
    });
}

export function* updateDomain(
    caller: ClientAction | null, nodeName: string | null, name: string, domain: API.DomainAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DomainInfo> {

    const location = ut`/domains/${name}`;
    return yield* callApi<API.DomainInfo>({
        caller, nodeName, method: "PUT", location, body: domain, auth, schema: "DomainInfo", errorFilter
    });
}

export function* deleteDomain(
    caller: ClientAction | null, nodeName: string | null, name: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/domains/${name}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* isDomainAvailable(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, errorFilter: ErrorFilter = false
): CallApiResult<API.DomainAvailable> {

    const location = urlWithParameters(ut`/domains/available`, {nodeName: remoteNodeName});
    return yield* callApi<API.DomainAvailable>({
        caller, nodeName, method: "GET", location, schema: "DomainAvailable", errorFilter
    });
}

export function* getDrafts(
    caller: ClientAction | null, nodeName: string | null, draftType: API.DraftType, remoteNodeName: string,
    postingId: string | null = null, commentId: string | null = null, page: number | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DraftInfo[]> {

    const location = urlWithParameters(
        ut`/drafts`,
        {draftType, nodeName: remoteNodeName, postingId, commentId, page, limit}
    );
    return yield* callApi<API.DraftInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "DraftInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* createDraft(
    caller: ClientAction | null, nodeName: string | null, draft: API.DraftText, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.DraftInfo> {

    const location = "/drafts";
    return yield* callApi<API.DraftInfo>({
        caller, nodeName, method: "POST", location, body: draft, auth, schema: "DraftInfo", decodeBodies: true,
        errorFilter
    });
}

export function* getDraft(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.DraftInfo> {

    const location = ut`/drafts/${id}`;
    return yield* callApi<API.DraftInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "DraftInfo", decodeBodies: true, errorFilter
    });
}

export function* updateDraft(
    caller: ClientAction | null, nodeName: string | null, id: string, draft: API.DraftText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DraftInfo> {

    const location = ut`/drafts/${id}`;
    return yield* callApi<API.DraftInfo>({
        caller, nodeName, method: "PUT", location, body: draft, auth, schema: "DraftInfo", decodeBodies: true,
        errorFilter
    });
}

export function* deleteDraft(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/drafts/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* getFeatures(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.Features> {

    const location = "/features";
    return yield* callApi<API.Features>({
        caller, nodeName, method: "GET", location, auth, schema: "Features", errorFilter
    });
}

export function* getFeeds(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.FeedInfo[]> {

    const location = "/feeds";
    return yield* callApi<API.FeedInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "FeedInfoArray", errorFilter
    });
}

export function* getFeedGeneral(
    caller: ClientAction | null, nodeName: string | null, feedName: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.FeedInfo> {

    const location = ut`/feeds/${feedName}`;
    return yield* callApi<API.FeedInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FeedInfo", errorFilter
    });
}

export function* getFeedStatus(
    caller: ClientAction | null, nodeName: string | null, feedName: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.FeedStatus> {

    const location = ut`/feeds/${feedName}/status`;
    return yield* callApi<API.FeedStatus>({
        caller, nodeName, method: "GET", location, auth, schema: "FeedStatus", errorFilter
    });
}

export function* updateFeedStatus(
    caller: ClientAction | null, nodeName: string | null, feedName: string, change: API.FeedStatusChange,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FeedStatus> {

    const location = ut`/feeds/${feedName}/status`;
    return yield* callApi<API.FeedStatus>({
        caller, nodeName, method: "PUT", location, body: change, auth, schema: "FeedStatus", errorFilter
    });
}

export function* getFeedSlice(
    caller: ClientAction | null, nodeName: string | null, feedName: string, after: number | null = null,
    before: number | null = null, limit: number | null = null, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.FeedSliceInfo> {

    const location = urlWithParameters(ut`/feeds/${feedName}/stories`, {after, before, limit});
    return yield* callApi<API.FeedSliceInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FeedSliceInfo", decodeBodies: true,
        errorFilter
    });
}

export function* getFriendGroups(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.FriendGroupInfo[]> {

    const location = "/people/friends/groups";
    return yield* callApi<API.FriendGroupInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendGroupInfoArray", errorFilter
    });
}

export function* getFriendGroup(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.FriendGroupInfo> {

    const location = ut`/people/friends/groups/${id}`;
    return yield* callApi<API.FriendGroupInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendGroupInfo", errorFilter
    });
}

export function* createFriendGroup(
    caller: ClientAction | null, nodeName: string | null, friendGroup: API.FriendGroupDescription,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FriendGroupInfo> {

    const location = "/people/friends/groups";
    return yield* callApi<API.FriendGroupInfo>({
        caller, nodeName, method: "POST", location, body: friendGroup, auth, schema: "FriendGroupInfo",
        errorFilter
    });
}

export function* updateFriendGroup(
    caller: ClientAction | null, nodeName: string | null, id: string, friendGroup: API.FriendGroupDescription,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FriendGroupInfo> {

    const location = ut`/people/friends/groups/${id}`;
    return yield* callApi<API.FriendGroupInfo>({
        caller, nodeName, method: "PUT", location, body: friendGroup, auth, schema: "FriendGroupInfo",
        errorFilter
    });
}

export function* deleteFriendGroup(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/people/friends/groups/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* getFriends(
    caller: ClientAction | null, nodeName: string | null, groupId: string | null = null,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.FriendInfo[]> {

    const location = urlWithParameters(ut`/people/friends`, {groupId});
    return yield* callApi<API.FriendInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendInfoArray", errorFilter
    });
}

export function* getFriend(
    caller: ClientAction | null, nodeName: string | null, name: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.FriendInfo> {

    const location = ut`/people/friends/${name}`;
    return yield* callApi<API.FriendInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendInfo", errorFilter
    });
}

export function* updateFriends(
    caller: ClientAction | null, nodeName: string | null, friends: API.FriendDescription[],
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FriendInfo[]> {

    const location = "/people/friends";
    return yield* callApi<API.FriendInfo[]>({
        caller, nodeName, method: "PUT", location, body: friends, auth, schema: "FriendInfoArray", errorFilter
    });
}

export function* getFriendOfs(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.FriendOfInfo[]> {

    const location = "/people/friend-ofs";
    return yield* callApi<API.FriendOfInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendOfInfoArray", errorFilter
    });
}

export function* getFriendOf(
    caller: ClientAction | null, nodeName: string | null, name: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.FriendOfInfo> {

    const location = ut`/people/friend-ofs/${name}`;
    return yield* callApi<API.FriendOfInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendOfInfo", errorFilter
    });
}

export function* uploadPrivateMedia(
    caller: ClientAction | null, nodeName: string | null, file: File, onProgress?: ProgressHandler,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PrivateMediaFileInfo> {

    const location = "/media/private";
    return yield* callApi<API.PrivateMediaFileInfo>({
        caller, nodeName, method: "POST", location, body: file, onProgress, auth, schema: "PrivateMediaFileInfo",
        errorFilter
    });
}

export function* getPrivateMedia(
    caller: ClientAction | null, nodeName: string | null, id: string, width: number | null = null,
    download: boolean | null = null, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<Blob> {

    const location = urlWithParameters(ut`/media/private/${id}/data`, {width, download});
    return yield* callApi<Blob>({
        caller, nodeName, method: "GET", location, auth, schema: "blob", errorFilter
    });
}

export function* getPrivateMediaInfo(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.PrivateMediaFileInfo> {

    const location = ut`/media/private/${id}/info`;
    return yield* callApi<API.PrivateMediaFileInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PrivateMediaFileInfo", errorFilter
    });
}

export function* getPrivateMediaParentEntry(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.EntryInfo[]> {

    const location = ut`/media/private/${id}/parent`;
    return yield* callApi<API.EntryInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "EntryInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* uploadPublicMedia(
    caller: ClientAction | null, nodeName: string | null, file: File, onProgress?: ProgressHandler,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PublicMediaFileInfo> {

    const location = "/media/public";
    return yield* callApi<API.PublicMediaFileInfo>({
        caller, nodeName, method: "POST", location, body: file, onProgress, auth, schema: "PublicMediaFileInfo",
        errorFilter
    });
}

export function* getPublicMedia(
    caller: ClientAction | null, nodeName: string | null, id: string, width: number | null = null,
    download: boolean | null = null, errorFilter: ErrorFilter = false
): CallApiResult<Blob> {

    const location = urlWithParameters(ut`/media/public/${id}/data`, {width, download});
    return yield* callApi<Blob>({
        caller, nodeName, method: "GET", location, schema: "blob", errorFilter
    });
}

export function* getPublicMediaInfo(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false
): CallApiResult<API.PublicMediaFileInfo> {

    const location = ut`/media/public/${id}/info`;
    return yield* callApi<API.PublicMediaFileInfo>({
        caller, nodeName, method: "GET", location, schema: "PublicMediaFileInfo", errorFilter
    });
}

export function* getNodeName(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.NodeNameInfo> {

    const location = "/node-name";
    return yield* callApi<API.NodeNameInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "NodeNameInfo", errorFilter
    });
}

export function* createNodeName(
    caller: ClientAction | null, nodeName: string | null, nameToRegister: API.NameToRegister,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.RegisteredNameSecret> {

    const location = "/node-name";
    return yield* callApi<API.RegisteredNameSecret>({
        caller, nodeName, method: "POST", location, body: nameToRegister, auth, schema: "RegisteredNameSecret",
        errorFilter
    });
}

export function* updateNodeName(
    caller: ClientAction | null, nodeName: string | null, secret: API.RegisteredNameSecret,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/node-name";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: secret, auth, schema: "Result", errorFilter
    });
}

export function* deleteNodeName(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/node-name";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* sendNotification(
    caller: ClientAction | null, nodeName: string | null, packet: API.NotificationPacket,
    errorFilter: ErrorFilter = false
): CallApiResult<API.Result> {

    const location = "/notifications";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: packet, schema: "Result", errorFilter
    });
}

export function* getPeopleGeneral(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.PeopleGeneralInfo> {

    const location = "/people";
    return yield* callApi<API.PeopleGeneralInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PeopleGeneralInfo", errorFilter
    });
}

export function* registerPlugin(
    caller: ClientAction | null, nodeName: string | null, plugin: API.PluginDescription,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PluginInfo> {

    const location = "/plugins";
    return yield* callApi<API.PluginInfo>({
        caller, nodeName, method: "POST", location, body: plugin, auth, schema: "PluginInfo", errorFilter
    });
}

export function* getPlugins(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.PluginInfo[]> {

    const location = "/plugins";
    return yield* callApi<API.PluginInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PluginInfoArray", errorFilter
    });
}

export function* getPlugin(
    caller: ClientAction | null, nodeName: string | null, pluginName: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.PluginInfo> {

    const location = ut`/plugins/${pluginName}`;
    return yield* callApi<API.PluginInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PluginInfo", errorFilter
    });
}

export function* unregisterPlugin(
    caller: ClientAction | null, nodeName: string | null, pluginName: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/plugins/${pluginName}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* createPosting(
    caller: ClientAction | null, nodeName: string | null, posting: API.PostingText, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.PostingInfo> {

    const location = "/postings";
    return yield* callApi<API.PostingInfo>({
        caller, nodeName, method: "POST", location, body: posting, auth, schema: "PostingInfo",
        decodeBodies: true, errorFilter
    });
}

export function* updatePosting(
    caller: ClientAction | null, nodeName: string | null, id: string, posting: API.PostingText,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingInfo> {

    const location = ut`/postings/${id}`;
    return yield* callApi<API.PostingInfo>({
        caller, nodeName, method: "PUT", location, body: posting, auth, schema: "PostingInfo",
        decodeBodies: true, errorFilter
    });
}

export function* getPosting(
    caller: ClientAction | null, nodeName: string | null, id: string, withSource: boolean = false,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters(ut`/postings/${id}`, {include});
    return yield* callApi<API.PostingInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfo", decodeBodies: true, errorFilter
    });
}

export function* deletePosting(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.Result> {

    const location = ut`/postings/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* getPostingsAttachedToPosting(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.PostingInfo[]> {

    const location = ut`/postings/${id}/attached`;
    return yield* callApi<API.PostingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* getPostingRevisions(
    caller: ClientAction | null, nodeName: string | null, postingId: string, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingRevisionInfo[]> {

    const location = urlWithParameters(ut`/postings/${postingId}/revisions`, {limit});
    return yield* callApi<API.PostingRevisionInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingRevisionInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* getPostingRevision(
    caller: ClientAction | null, nodeName: string | null, postingId: string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingRevisionInfo> {

    const location = ut`/postings/${postingId}/revisions/${id}`;
    return yield* callApi<API.PostingRevisionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export function* restorePostingRevision(
    caller: ClientAction | null, nodeName: string | null, postingId: string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingRevisionInfo> {

    const location = ut`/postings/${postingId}/revisions/${id}/restore`;
    return yield* callApi<API.PostingRevisionInfo>({
        caller, nodeName, method: "POST", location, auth, schema: "PostingRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export function* createPostingReaction(
    caller: ClientAction | null, nodeName: string | null, postingId: string, reaction: API.ReactionDescription,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionCreated> {

    const location = ut`/postings/${postingId}/reactions`;
    return yield* callApi<API.ReactionCreated>({
        caller, nodeName, method: "POST", location, body: reaction, auth, schema: "ReactionCreated",
        errorFilter
    });
}

export function* getPostingReactionsSlice(
    caller: ClientAction | null, nodeName: string | null, postingId: string, negative: boolean | null = null,
    emoji: number | null = null, before: number | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionsSliceInfo> {

    const location = urlWithParameters(
        ut`/postings/${postingId}/reactions`,
        {negative, emoji, before, limit}
    );
    return yield* callApi<API.ReactionsSliceInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionsSliceInfo", errorFilter
    });
}

export function* updatePostingReaction(
    caller: ClientAction | null, nodeName: string | null, postingId: string, ownerName: string,
    reaction: API.ReactionOverride, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/reactions/${ownerName}`;
    return yield* callApi<API.ReactionInfo>({
        caller, nodeName, method: "PUT", location, body: reaction, auth, schema: "ReactionInfo", errorFilter
    });
}

export function* getPostingReaction(
    caller: ClientAction | null, nodeName: string | null, postingId: string, ownerName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/reactions/${ownerName}`;
    return yield* callApi<API.ReactionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionInfo", errorFilter
    });
}

export function* deleteAllPostingReactions(
    caller: ClientAction | null, nodeName: string | null, postingId: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.Result> {

    const location = ut`/postings/${postingId}/reactions`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* deletePostingReaction(
    caller: ClientAction | null, nodeName: string | null, postingId: string, ownerName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/reactions/${ownerName}`;
    return yield* callApi<API.ReactionTotalsInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "ReactionTotalsInfo", errorFilter
    });
}

export function* searchPostingReactions(
    caller: ClientAction | null, nodeName: string | null, filter: API.ReactionsFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionInfo[]> {

    const location = "/postings/reactions/search";
    return yield* callApi<API.ReactionInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "ReactionInfoArray",
        errorFilter
    });
}

export function* getPostingReactionTotals(
    caller: ClientAction | null, nodeName: string | null, postingId: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/reaction-totals`;
    return yield* callApi<API.ReactionTotalsInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionTotalsInfo", errorFilter
    });
}

export function* searchPostingReactionTotals(
    caller: ClientAction | null, nodeName: string | null, filter: API.ReactionTotalsFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionTotalsInfo[]> {

    const location = "/postings/reaction-totals/search";
    return yield* callApi<API.ReactionTotalsInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "ReactionTotalsInfoArray",
        errorFilter
    });
}

export function* getProfile(
    caller: ClientAction | null, nodeName: string | null, withSource: boolean = false,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ProfileInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters(ut`/profile`, {include});
    return yield* callApi<API.ProfileInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ProfileInfo", errorFilter
    });
}

export function* updateProfile(
    caller: ClientAction | null, nodeName: string | null, profile: API.ProfileAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ProfileInfo> {

    const location = "/profile";
    return yield* callApi<API.ProfileInfo>({
        caller, nodeName, method: "PUT", location, body: profile, auth, schema: "ProfileInfo", errorFilter
    });
}

export function* proxyMedia(
    caller: ClientAction | null, nodeName: string | null, url: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<Blob> {

    const location = urlWithParameters(ut`/proxy/media`, {url});
    return yield* callApi<Blob>({
        caller, nodeName, method: "GET", location, auth, schema: "blob", errorFilter
    });
}

export function* proxyLinkPreview(
    caller: ClientAction | null, nodeName: string | null, url: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.LinkPreviewInfo> {

    const location = urlWithParameters(ut`/proxy/link-preview`, {url});
    return yield* callApi<API.LinkPreviewInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "LinkPreviewInfo", errorFilter
    });
}

export function* askRemoteNode(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, details: API.AskDescription,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/ask`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: details, auth, schema: "Result", errorFilter
    });
}

export function* createRemoteComment(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, postingId: string,
    comment: API.CommentSourceText, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: comment, auth, schema: "Result", errorFilter
    });
}

export function* updateRemoteComment(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, postingId: string,
    commentId: string, comment: API.CommentSourceText, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: comment, auth, schema: "Result", errorFilter
    });
}

export function* deleteRemoteComment(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, postingId: string,
    commentId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* verifyRemoteComment(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, postingId: string,
    commentId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/verify`;
    return yield* callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export function* createRemoteCommentReaction(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, postingId: string,
    commentId: string, reaction: API.ReactionAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: reaction, auth, schema: "Result", errorFilter
    });
}

export function* deleteRemoteCommentReaction(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, postingId: string,
    commentId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* verifyRemoteCommentReaction(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, postingId: string,
    commentId: string, ownerName: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions/${ownerName}/verify`;
    return yield* callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export function* createRemotePosting(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, posting: API.PostingSourceText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: posting, auth, schema: "Result", errorFilter
    });
}

export function* updateRemotePosting(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, postingId: string,
    posting: API.PostingSourceText, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: posting, auth, schema: "Result", errorFilter
    });
}

export function* deleteRemotePosting(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, postingId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* verifyRemotePosting(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${id}/verify`;
    return yield* callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export function* verifyRemotePostingRevision(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, id: string, revisionId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${id}/revisions/${revisionId}/verify`;
    return yield* callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export function* createRemotePostingReaction(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, postingId: string,
    reaction: API.ReactionAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: reaction, auth, schema: "Result", errorFilter
    });
}

export function* deleteRemotePostingReaction(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, postingId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* verifyRemotePostingReaction(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, postingId: string,
    ownerName: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions/${ownerName}/verify`;
    return yield* callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export function* createRemoteSheriffOrder(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string,
    sheriffOrder: API.SheriffOrderAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/sheriff/orders`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: sheriffOrder, auth, schema: "Result", errorFilter
    });
}

export function* getRemoteSheriffOrder(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string, id: string,
    errorFilter: ErrorFilter = false
): CallApiResult<API.SheriffOrderInfo> {

    const location = ut`/nodes/${remoteNodeName}/sheriff/orders/${id}`;
    return yield* callApi<API.SheriffOrderInfo>({
        caller, nodeName, method: "GET", location, schema: "SheriffOrderInfo", errorFilter
    });
}

export function* updateSettings(
    caller: ClientAction | null, nodeName: string | null, settings: API.SettingInfo[],
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/settings";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: settings, auth, schema: "Result", errorFilter
    });
}

export function* getClientSettings(
    caller: ClientAction | null, nodeName: string | null, prefix: string | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SettingInfo[]> {

    const location = urlWithParameters(ut`/settings/client`, {prefix});
    return yield* callApi<API.SettingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SettingInfoArray", errorFilter
    });
}

export function* getNodeSettings(
    caller: ClientAction | null, nodeName: string | null, prefix: string | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SettingInfo[]> {

    const location = urlWithParameters(ut`/settings/node`, {prefix});
    return yield* callApi<API.SettingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SettingInfoArray", errorFilter
    });
}

export function* getNodeSettingsMetadata(
    caller: ClientAction | null, nodeName: string | null, prefix: string | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SettingMetaInfo[]> {

    const location = urlWithParameters(ut`/settings/node/metadata`, {prefix});
    return yield* callApi<API.SettingMetaInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SettingMetaInfoArray", errorFilter
    });
}

export function* updateNodeSettingsMetadata(
    caller: ClientAction | null, nodeName: string | null, metadata: API.SettingMetaAttributes[],
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/settings/node/metadata";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: metadata, auth, schema: "Result", errorFilter
    });
}

export function* getSheriffComplaintGroupsSlice(
    caller: ClientAction | null, nodeName: string | null, after: number | null = null, before: number | null = null,
    limit: number | null = null, status: API.SheriffComplainStatus | null = null, errorFilter: ErrorFilter = false
): CallApiResult<API.SheriffComplainGroupsSliceInfo> {

    const location = urlWithParameters(ut`/sheriff/complains/groups`, {after, before, limit, status});
    return yield* callApi<API.SheriffComplainGroupsSliceInfo>({
        caller, nodeName, method: "GET", location, schema: "SheriffComplainGroupsSliceInfo", errorFilter
    });
}

export function* getSheriffComplaintGroup(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false
): CallApiResult<API.SheriffComplainGroupInfo> {

    const location = ut`/sheriff/complains/groups/${id}`;
    return yield* callApi<API.SheriffComplainGroupInfo>({
        caller, nodeName, method: "GET", location, schema: "SheriffComplainGroupInfo", errorFilter
    });
}

export function* getSheriffComplaintsByGroup(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false
): CallApiResult<API.SheriffComplainInfo[]> {

    const location = ut`/sheriff/complains/groups/${id}/complains`;
    return yield* callApi<API.SheriffComplainInfo[]>({
        caller, nodeName, method: "GET", location, schema: "SheriffComplainInfoArray", errorFilter
    });
}

export function* updateSheriffComplaintGroup(
    caller: ClientAction | null, nodeName: string | null, id: string, decision: API.SheriffComplainDecisionText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SheriffComplainGroupInfo> {

    const location = ut`/sheriff/complains/groups/${id}`;
    return yield* callApi<API.SheriffComplainGroupInfo>({
        caller, nodeName, method: "PUT", location, body: decision, auth, schema: "SheriffComplainGroupInfo",
        errorFilter
    });
}

export function* createSheriffComplaint(
    caller: ClientAction | null, nodeName: string | null, complaint: API.SheriffComplainText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SheriffComplainInfo> {

    const location = "/sheriff/complains";
    return yield* callApi<API.SheriffComplainInfo>({
        caller, nodeName, method: "POST", location, body: complaint, auth, schema: "SheriffComplainInfo",
        errorFilter
    });
}

export function* createSheriffOrder(
    caller: ClientAction | null, nodeName: string | null, sheriffOrder: API.SheriffOrderDetails,
    errorFilter: ErrorFilter = false
): CallApiResult<API.Result> {

    const location = "/sheriff/orders";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: sheriffOrder, schema: "Result", errorFilter
    });
}

export function* getStory(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.StoryInfo> {

    const location = ut`/stories/${id}`;
    return yield* callApi<API.StoryInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "StoryInfo", decodeBodies: true, errorFilter
    });
}

export function* updateStory(
    caller: ClientAction | null, nodeName: string | null, id: string, story: API.StoryAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.StoryInfo> {

    const location = ut`/stories/${id}`;
    return yield* callApi<API.StoryInfo>({
        caller, nodeName, method: "PUT", location, body: story, auth, schema: "StoryInfo", decodeBodies: true,
        errorFilter
    });
}

export function* getSubscribers(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string | null = null,
    type: API.SubscriptionType | null = null, feedName: string | null = null, entryId: string | null = null,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.SubscriberInfo[]> {

    const location = urlWithParameters(
        ut`/people/subscribers`,
        {nodeName: remoteNodeName, type, feedName, entryId}
    );
    return yield* callApi<API.SubscriberInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SubscriberInfoArray", errorFilter
    });
}

export function* createSubscriber(
    caller: ClientAction | null, nodeName: string | null, subscriber: API.SubscriberDescription,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SubscriberInfo> {

    const location = "/people/subscribers";
    return yield* callApi<API.SubscriberInfo>({
        caller, nodeName, method: "POST", location, body: subscriber, auth, schema: "SubscriberInfo",
        errorFilter
    });
}

export function* getSubscriber(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.SubscriberInfo> {

    const location = ut`/people/subscribers/${id}`;
    return yield* callApi<API.SubscriberInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "SubscriberInfo", errorFilter
    });
}

export function* updateSubscriber(
    caller: ClientAction | null, nodeName: string | null, id: string, subscriber: API.SubscriberOverride,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SubscriberInfo> {

    const location = ut`/people/subscribers/${id}`;
    return yield* callApi<API.SubscriberInfo>({
        caller, nodeName, method: "PUT", location, body: subscriber, auth, schema: "SubscriberInfo",
        errorFilter
    });
}

export function* deleteSubscriber(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.ContactInfo> {

    const location = ut`/people/subscribers/${id}`;
    return yield* callApi<API.ContactInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "ContactInfo", errorFilter
    });
}

export function* getSubscriptions(
    caller: ClientAction | null, nodeName: string | null, remoteNodeName: string | null = null,
    type: API.SubscriptionType | null = null, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.SubscriptionInfo[]> {

    const location = urlWithParameters(ut`/people/subscriptions`, {nodeName: remoteNodeName, type});
    return yield* callApi<API.SubscriptionInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SubscriptionInfoArray", errorFilter
    });
}

export function* createSubscription(
    caller: ClientAction | null, nodeName: string | null, subscription: API.SubscriptionDescription,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SubscriptionInfo> {

    const location = "/people/subscriptions";
    return yield* callApi<API.SubscriptionInfo>({
        caller, nodeName, method: "POST", location, body: subscription, auth, schema: "SubscriptionInfo",
        errorFilter
    });
}

export function* updateSubscription(
    caller: ClientAction | null, nodeName: string | null, id: string, subscription: API.SubscriptionOverride,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SubscriptionInfo> {

    const location = ut`/people/subscriptions/${id}`;
    return yield* callApi<API.SubscriptionInfo>({
        caller, nodeName, method: "PUT", location, body: subscription, auth, schema: "SubscriptionInfo",
        errorFilter
    });
}

export function* deleteSubscription(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.ContactInfo> {

    const location = ut`/people/subscriptions/${id}`;
    return yield* callApi<API.ContactInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "ContactInfo", errorFilter
    });
}

export function* searchSubscriptions(
    caller: ClientAction | null, nodeName: string | null, filter: API.SubscriptionFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.SubscriptionInfo[]> {

    const location = "/people/subscriptions/search";
    return yield* callApi<API.SubscriptionInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "SubscriptionInfoArray",
        errorFilter
    });
}

export function* getTokens(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.TokenInfo[]> {

    const location = "/tokens";
    return yield* callApi<API.TokenInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "TokenInfoArray", errorFilter
    });
}

export function* createToken(
    caller: ClientAction | null, nodeName: string | null, token: API.TokenAttributes,
    errorFilter: ErrorFilter = false
): CallApiResult<API.TokenInfo> {

    const location = "/tokens";
    return yield* callApi<API.TokenInfo>({
        caller, nodeName, method: "POST", location, body: token, schema: "TokenInfo", errorFilter
    });
}

export function* getTokenInfo(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.TokenInfo> {

    const location = ut`/tokens/${id}`;
    return yield* callApi<API.TokenInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "TokenInfo", errorFilter
    });
}

export function* updateToken(
    caller: ClientAction | null, nodeName: string | null, id: string, token: API.TokenName,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.TokenInfo> {

    const location = ut`/tokens/${id}`;
    return yield* callApi<API.TokenInfo>({
        caller, nodeName, method: "PUT", location, body: token, auth, schema: "TokenInfo", errorFilter
    });
}

export function* deleteToken(
    caller: ClientAction | null, nodeName: string | null, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/tokens/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* getUserListGeneral(
    caller: ClientAction | null, nodeName: string | null, name: string, errorFilter: ErrorFilter = false
): CallApiResult<API.UserListInfo> {

    const location = ut`/user-lists/${name}`;
    return yield* callApi<API.UserListInfo>({
        caller, nodeName, method: "GET", location, schema: "UserListInfo", errorFilter
    });
}

export function* getUserListSlice(
    caller: ClientAction | null, nodeName: string | null, name: string, after: number | null = null,
    before: number | null = null, limit: number | null = null, errorFilter: ErrorFilter = false
): CallApiResult<API.UserListSliceInfo> {

    const location = urlWithParameters(ut`/user-lists/${name}/items`, {after, before, limit});
    return yield* callApi<API.UserListSliceInfo>({
        caller, nodeName, method: "GET", location, schema: "UserListSliceInfo", errorFilter
    });
}

export function* getUserListItem(
    caller: ClientAction | null, nodeName: string | null, name: string, remoteNodeName: string,
    errorFilter: ErrorFilter = false
): CallApiResult<API.UserListItemInfo> {

    const location = ut`/user-lists/${name}/items/${remoteNodeName}`;
    return yield* callApi<API.UserListItemInfo>({
        caller, nodeName, method: "GET", location, schema: "UserListItemInfo", errorFilter
    });
}

export function* createUserListItem(
    caller: ClientAction | null, nodeName: string | null, name: string, item: API.UserListItemAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.UserListItemInfo> {

    const location = ut`/user-lists/${name}/items`;
    return yield* callApi<API.UserListItemInfo>({
        caller, nodeName, method: "POST", location, body: item, auth, schema: "UserListItemInfo", errorFilter
    });
}

export function* deleteUserListItem(
    caller: ClientAction | null, nodeName: string | null, name: string, remoteNodeName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/user-lists/${name}/items/${remoteNodeName}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* whoAmI(
    caller: ClientAction | null, nodeName: string | null, errorFilter: ErrorFilter = false
): CallApiResult<API.WhoAmI> {

    const location = "/whoami";
    return yield* callApi<API.WhoAmI>({
        caller, nodeName, method: "GET", location, schema: "WhoAmI", errorFilter
    });
}
