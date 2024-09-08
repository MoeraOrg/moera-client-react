// This file is generated

import { callApi, CallApiResult, ErrorFilter } from "api/node/call";
import * as API from "api/node/api-types";
import { ProgressHandler } from 'api/fetcher';
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { RelNodeName } from "util/rel-node-name";
import { urlWithParameters, ut } from "util/url";
import { commaSeparatedFlags } from "util/misc";

export function* searchActivityReactions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.ActivityReactionFilter,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ActivityReactionInfo[]> {

    const location = "/activity/reactions/search";
    return yield* callApi<API.ActivityReactionInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "ActivityReactionInfoArray",
        errorFilter
    });
}

export function* getRemotePostingVerificationStatus(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.RemotePostingVerificationInfo> {

    const location = ut`/async-operations/remote-posting-verification/${id}`;
    return yield* callApi<API.RemotePostingVerificationInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "RemotePostingVerificationInfo", errorFilter
    });
}

export function* getRemoteReactionVerificationStatus(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.RemoteReactionVerificationInfo> {

    const location = ut`/async-operations/remote-reaction-verification/${id}`;
    return yield* callApi<API.RemoteReactionVerificationInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "RemoteReactionVerificationInfo", errorFilter
    });
}

export function* getAvatars(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false
): CallApiResult<API.AvatarInfo[]> {

    const location = "/avatars";
    return yield* callApi<API.AvatarInfo[]>({
        caller, nodeName, method: "GET", location, schema: "AvatarInfoArray", errorFilter
    });
}

export function* createAvatar(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, avatar: API.AvatarAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AvatarInfo> {

    const location = "/avatars";
    return yield* callApi<API.AvatarInfo>({
        caller, nodeName, method: "POST", location, body: avatar, auth, schema: "AvatarInfo", errorFilter
    });
}

export function* getAvatar(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false
): CallApiResult<API.AvatarInfo> {

    const location = ut`/avatars/${id}`;
    return yield* callApi<API.AvatarInfo>({
        caller, nodeName, method: "GET", location, schema: "AvatarInfo", errorFilter
    });
}

export function* deleteAvatar(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/avatars/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* reorderAvatars(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, order: API.AvatarsOrdered,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AvatarOrdinal[]> {

    const location = "/avatars/reorder";
    return yield* callApi<API.AvatarOrdinal[]>({
        caller, nodeName, method: "POST", location, body: order, auth, schema: "AvatarOrdinalArray",
        errorFilter
    });
}

export function* blockInstant(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, instant: API.BlockedInstantAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.BlockedInstantInfo> {

    const location = "/blocked-instants";
    return yield* callApi<API.BlockedInstantInfo>({
        caller, nodeName, method: "POST", location, body: instant, auth, schema: "BlockedInstantInfo",
        errorFilter
    });
}

export function* getBlockedInstant(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.BlockedInstantInfo> {

    const location = ut`/blocked-instants/${id}`;
    return yield* callApi<API.BlockedInstantInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "BlockedInstantInfo", errorFilter
    });
}

export function* unblockInstant(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/blocked-instants/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* searchBlockedInstants(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.BlockedInstantFilter,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.BlockedInstantInfo[]> {

    const location = "/blocked-instants/search";
    return yield* callApi<API.BlockedInstantInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "BlockedInstantInfoArray",
        errorFilter
    });
}

export function* blockUser(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, user: API.BlockedUserAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.BlockedUserInfo> {

    const location = "/people/blocked-users";
    return yield* callApi<API.BlockedUserInfo>({
        caller, nodeName, method: "POST", location, body: user, auth, schema: "BlockedUserInfo", errorFilter
    });
}

export function* getBlockedUser(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.BlockedUserInfo> {

    const location = ut`/people/blocked-users/${id}`;
    return yield* callApi<API.BlockedUserInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "BlockedUserInfo", errorFilter
    });
}

export function* unblockUser(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/people/blocked-users/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* searchBlockedUsers(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.BlockedUserFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.BlockedUserInfo[]> {

    const location = "/people/blocked-users/search";
    return yield* callApi<API.BlockedUserInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "BlockedUserInfoArray",
        errorFilter
    });
}

export function* getBlockedUsersChecksums(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.BlockedUsersChecksums> {

    const location = "/people/blocked-users/checksums";
    return yield* callApi<API.BlockedUsersChecksums>({
        caller, nodeName, method: "GET", location, auth, schema: "BlockedUsersChecksums", errorFilter
    });
}

export function* getBlockedByUser(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.BlockedByUserInfo> {

    const location = ut`/people/blocked-by-users/${id}`;
    return yield* callApi<API.BlockedByUserInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "BlockedByUserInfo", errorFilter
    });
}

export function* searchBlockedByUsers(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.BlockedByUserFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.BlockedByUserInfo[]> {

    const location = "/people/blocked-by-users/search";
    return yield* callApi<API.BlockedByUserInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "BlockedByUserInfoArray",
        errorFilter
    });
}

export function* createCartes(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, attributes: API.CarteAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.CarteSet> {

    const location = "/cartes";
    return yield* callApi<API.CarteSet>({
        caller, nodeName, method: "POST", location, body: attributes, auth, schema: "CarteSet", errorFilter
    });
}

export function* verifyCarte(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, clientCarte: API.ClientCarte,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.CarteVerificationInfo> {

    const location = "/cartes/verify";
    return yield* callApi<API.CarteVerificationInfo>({
        caller, nodeName, method: "POST", location, body: clientCarte, auth, schema: "CarteVerificationInfo",
        errorFilter
    });
}

export function* getCommentsSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    after: number | null = null, before: number | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.CommentsSliceInfo> {

    const location = urlWithParameters(ut`/postings/${postingId}/comments`, {after, before, limit});
    return yield* callApi<API.CommentsSliceInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "CommentsSliceInfo", decodeBodies: true,
        errorFilter
    });
}

export function* createComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    comment: API.CommentText, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.CommentCreated> {

    const location = ut`/postings/${postingId}/comments`;
    return yield* callApi<API.CommentCreated>({
        caller, nodeName, method: "POST", location, body: comment, auth, schema: "CommentCreated",
        decodeBodies: true, errorFilter
    });
}

export function* getComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    withSource: boolean = false, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.CommentInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters(ut`/postings/${postingId}/comments/${commentId}`, {include});
    return yield* callApi<API.CommentInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "CommentInfo", decodeBodies: true, errorFilter
    });
}

export function* updateAllComments(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    attributes: API.CommentMassAttributes, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.Result> {

    const location = ut`/postings/${postingId}/comments`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: attributes, auth, schema: "Result", errorFilter
    });
}

export function* updateComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    comment: API.CommentText, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.CommentInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}`;
    return yield* callApi<API.CommentInfo>({
        caller, nodeName, method: "PUT", location, body: comment, auth, schema: "CommentInfo",
        decodeBodies: true, errorFilter
    });
}

export function* deleteComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.CommentTotalInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}`;
    return yield* callApi<API.CommentTotalInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "CommentTotalInfo", errorFilter
    });
}

export function* getPostingsAttachedToComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingInfo[]> {

    const location = ut`/postings/${postingId}/comments/${commentId}/attached`;
    return yield* callApi<API.PostingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* getCommentRevisions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.CommentRevisionInfo[]> {

    const location = ut`/postings/${postingId}/comments/${commentId}/revisions`;
    return yield* callApi<API.CommentRevisionInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "CommentRevisionInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* getCommentRevision(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    id: string, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.CommentRevisionInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/revisions/${id}`;
    return yield* callApi<API.CommentRevisionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "CommentRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export function* createCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    reaction: API.ReactionDescription, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionCreated> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions`;
    return yield* callApi<API.ReactionCreated>({
        caller, nodeName, method: "POST", location, body: reaction, auth, schema: "ReactionCreated",
        errorFilter
    });
}

export function* updateCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    ownerName: string, reaction: API.ReactionOverride, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`;
    return yield* callApi<API.ReactionInfo>({
        caller, nodeName, method: "PUT", location, body: reaction, auth, schema: "ReactionInfo", errorFilter
    });
}

export function* getCommentReactionsSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
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
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    ownerName: string, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`;
    return yield* callApi<API.ReactionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionInfo", errorFilter
    });
}

export function* deleteAllCommentReactions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* deleteCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    ownerName: string, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`;
    return yield* callApi<API.ReactionTotalsInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "ReactionTotalsInfo", errorFilter
    });
}

export function* getCommentReactionTotals(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reaction-totals`;
    return yield* callApi<API.ReactionTotalsInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionTotalsInfo", errorFilter
    });
}

export function* getContacts(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, query: string | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ContactInfo[]> {

    const location = urlWithParameters(ut`/people/contacts`, {query, limit});
    return yield* callApi<API.ContactInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "ContactInfoArray", errorFilter
    });
}

export function* checkCredentials(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false
): CallApiResult<API.CredentialsCreated> {

    const location = "/credentials";
    return yield* callApi<API.CredentialsCreated>({
        caller, nodeName, method: "GET", location, schema: "CredentialsCreated", errorFilter
    });
}

export function* createCredentials(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, credentials: API.Credentials,
    errorFilter: ErrorFilter = false
): CallApiResult<API.Result> {

    const location = "/credentials";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: credentials, schema: "Result", errorFilter
    });
}

export function* updateCredentials(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, credentials: API.CredentialsChange,
    errorFilter: ErrorFilter = false
): CallApiResult<API.Result> {

    const location = "/credentials";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: credentials, schema: "Result", errorFilter
    });
}

export function* deleteCredentials(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/credentials";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* resetCredentials(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false
): CallApiResult<API.EmailHint> {

    const location = "/credentials/reset";
    return yield* callApi<API.EmailHint>({
        caller, nodeName, method: "POST", location, schema: "EmailHint", errorFilter
    });
}

export function* getDeletedPostings(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, page: number | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingInfo[]> {

    const location = urlWithParameters(ut`/deleted-postings`, {page, limit});
    return yield* callApi<API.PostingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* getDeletedPosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingInfo> {

    const location = ut`/deleted-postings/${id}`;
    return yield* callApi<API.PostingInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfo", decodeBodies: true, errorFilter
    });
}

export function* restoreDeletedPosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingInfo> {

    const location = ut`/deleted-postings/${id}/restore`;
    return yield* callApi<API.PostingInfo>({
        caller, nodeName, method: "POST", location, auth, schema: "PostingInfo", decodeBodies: true,
        errorFilter
    });
}

export function* getDeletePostingRevisions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingRevisionInfo[]> {

    const location = urlWithParameters(ut`/deleted-postings/${postingId}/revisions`, {limit});
    return yield* callApi<API.PostingRevisionInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingRevisionInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* getDeletedPostingRevision(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingRevisionInfo> {

    const location = ut`/deleted-postings/${postingId}/revisions/${id}`;
    return yield* callApi<API.PostingRevisionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export function* restoreDeletedPostingRevision(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingRevisionInfo> {

    const location = ut`/postings/${postingId}/revisions/${id}/restore`;
    return yield* callApi<API.PostingRevisionInfo>({
        caller, nodeName, method: "POST", location, auth, schema: "PostingRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export function* getDomains(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.DomainInfo[]> {

    const location = "/domains";
    return yield* callApi<API.DomainInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "DomainInfoArray", errorFilter
    });
}

export function* getDomain(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.DomainInfo> {

    const location = ut`/domains/${name}`;
    return yield* callApi<API.DomainInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "DomainInfo", errorFilter
    });
}

export function* createDomain(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, domain: API.DomainAttributes,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.DomainInfo> {

    const location = "/domains";
    return yield* callApi<API.DomainInfo>({
        caller, nodeName, method: "POST", location, body: domain, auth, schema: "DomainInfo", errorFilter
    });
}

export function* updateDomain(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    domain: API.DomainAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DomainInfo> {

    const location = ut`/domains/${name}`;
    return yield* callApi<API.DomainInfo>({
        caller, nodeName, method: "PUT", location, body: domain, auth, schema: "DomainInfo", errorFilter
    });
}

export function* deleteDomain(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/domains/${name}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* isDomainAvailable(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    errorFilter: ErrorFilter = false
): CallApiResult<API.DomainAvailable> {

    const location = urlWithParameters(ut`/domains/available`, {nodeName: remoteNodeName});
    return yield* callApi<API.DomainAvailable>({
        caller, nodeName, method: "GET", location, schema: "DomainAvailable", errorFilter
    });
}

export function* getDrafts(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, draftType: API.DraftType,
    remoteNodeName: string, postingId: string | null = null, commentId: string | null = null, page: number | null = null,
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
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, draft: API.DraftText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DraftInfo> {

    const location = "/drafts";
    return yield* callApi<API.DraftInfo>({
        caller, nodeName, method: "POST", location, body: draft, auth, schema: "DraftInfo", decodeBodies: true,
        errorFilter
    });
}

export function* getDraft(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DraftInfo> {

    const location = ut`/drafts/${id}`;
    return yield* callApi<API.DraftInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "DraftInfo", decodeBodies: true, errorFilter
    });
}

export function* updateDraft(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string, draft: API.DraftText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DraftInfo> {

    const location = ut`/drafts/${id}`;
    return yield* callApi<API.DraftInfo>({
        caller, nodeName, method: "PUT", location, body: draft, auth, schema: "DraftInfo", decodeBodies: true,
        errorFilter
    });
}

export function* deleteDraft(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/drafts/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* getFeatures(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.Features> {

    const location = "/features";
    return yield* callApi<API.Features>({
        caller, nodeName, method: "GET", location, auth, schema: "Features", errorFilter
    });
}

export function* getFeeds(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.FeedInfo[]> {

    const location = "/feeds";
    return yield* callApi<API.FeedInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "FeedInfoArray", errorFilter
    });
}

export function* getFeedGeneral(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, feedName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.FeedInfo> {

    const location = ut`/feeds/${feedName}`;
    return yield* callApi<API.FeedInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FeedInfo", errorFilter
    });
}

export function* getFeedStatus(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, feedName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.FeedStatus> {

    const location = ut`/feeds/${feedName}/status`;
    return yield* callApi<API.FeedStatus>({
        caller, nodeName, method: "GET", location, auth, schema: "FeedStatus", errorFilter
    });
}

export function* updateFeedStatus(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, feedName: string,
    change: API.FeedStatusChange, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FeedStatus> {

    const location = ut`/feeds/${feedName}/status`;
    return yield* callApi<API.FeedStatus>({
        caller, nodeName, method: "PUT", location, body: change, auth, schema: "FeedStatus", errorFilter
    });
}

export function* getFeedSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, feedName: string,
    after: number | null = null, before: number | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.FeedSliceInfo> {

    const location = urlWithParameters(ut`/feeds/${feedName}/stories`, {after, before, limit});
    return yield* callApi<API.FeedSliceInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FeedSliceInfo", decodeBodies: true,
        errorFilter
    });
}

export function* getFriendGroups(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.FriendGroupInfo[]> {

    const location = "/people/friends/groups";
    return yield* callApi<API.FriendGroupInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendGroupInfoArray", errorFilter
    });
}

export function* getFriendGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.FriendGroupInfo> {

    const location = ut`/people/friends/groups/${id}`;
    return yield* callApi<API.FriendGroupInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendGroupInfo", errorFilter
    });
}

export function* createFriendGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string,
    friendGroup: API.FriendGroupDescription, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FriendGroupInfo> {

    const location = "/people/friends/groups";
    return yield* callApi<API.FriendGroupInfo>({
        caller, nodeName, method: "POST", location, body: friendGroup, auth, schema: "FriendGroupInfo",
        errorFilter
    });
}

export function* updateFriendGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    friendGroup: API.FriendGroupDescription, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FriendGroupInfo> {

    const location = ut`/people/friends/groups/${id}`;
    return yield* callApi<API.FriendGroupInfo>({
        caller, nodeName, method: "PUT", location, body: friendGroup, auth, schema: "FriendGroupInfo",
        errorFilter
    });
}

export function* deleteFriendGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/people/friends/groups/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* getFriends(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, groupId: string | null = null,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.FriendInfo[]> {

    const location = urlWithParameters(ut`/people/friends`, {groupId});
    return yield* callApi<API.FriendInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendInfoArray", errorFilter
    });
}

export function* getFriend(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.FriendInfo> {

    const location = ut`/people/friends/${name}`;
    return yield* callApi<API.FriendInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendInfo", errorFilter
    });
}

export function* updateFriends(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, friends: API.FriendDescription[],
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FriendInfo[]> {

    const location = "/people/friends";
    return yield* callApi<API.FriendInfo[]>({
        caller, nodeName, method: "PUT", location, body: friends, auth, schema: "FriendInfoArray", errorFilter
    });
}

export function* getFriendOfs(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.FriendOfInfo[]> {

    const location = "/people/friend-ofs";
    return yield* callApi<API.FriendOfInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendOfInfoArray", errorFilter
    });
}

export function* getFriendOf(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.FriendOfInfo> {

    const location = ut`/people/friend-ofs/${name}`;
    return yield* callApi<API.FriendOfInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendOfInfo", errorFilter
    });
}

export function* getAllGrants(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.GrantInfo[]> {

    const location = "/grants";
    return yield* callApi<API.GrantInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "GrantInfoArray", errorFilter
    });
}

export function* getGrant(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.GrantInfo> {

    const location = ut`/grants/${remoteNodeName}`;
    return yield* callApi<API.GrantInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "GrantInfo", errorFilter
    });
}

export function* grantOrRevoke(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    change: API.GrantChange, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.GrantInfo> {

    const location = ut`/grants/${remoteNodeName}`;
    return yield* callApi<API.GrantInfo>({
        caller, nodeName, method: "PUT", location, body: change, auth, schema: "GrantInfo", errorFilter
    });
}

export function* revokeAll(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/grants/${remoteNodeName}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* uploadAdminMedia(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, file: File,
    onProgress?: ProgressHandler, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PrivateMediaFileInfo> {

    const location = "/media/private";
    return yield* callApi<API.PrivateMediaFileInfo>({
        caller, nodeName, method: "POST", location, body: file, onProgress, auth, schema: "PrivateMediaFileInfo",
        errorFilter
    });
}

export function* uploadPrivateMedia(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, clientName: string, file: File,
    onProgress?: ProgressHandler, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PrivateMediaFileInfo> {

    const location = ut`/media/private/${clientName}`;
    return yield* callApi<API.PrivateMediaFileInfo>({
        caller, nodeName, method: "POST", location, body: file, onProgress, auth, schema: "PrivateMediaFileInfo",
        errorFilter
    });
}

export function* getPrivateMedia(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    width: number | null = null, download: boolean | null = null, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<Blob> {

    const location = urlWithParameters(ut`/media/private/${id}/data`, {width, download});
    return yield* callApi<Blob>({
        caller, nodeName, method: "GET", location, auth, schema: "blob", errorFilter
    });
}

export function* getPrivateMediaInfo(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PrivateMediaFileInfo> {

    const location = ut`/media/private/${id}/info`;
    return yield* callApi<API.PrivateMediaFileInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PrivateMediaFileInfo", errorFilter
    });
}

export function* getPrivateMediaParentEntry(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.EntryInfo[]> {

    const location = ut`/media/private/${id}/parent`;
    return yield* callApi<API.EntryInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "EntryInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* uploadPublicMedia(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, file: File,
    onProgress?: ProgressHandler, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PublicMediaFileInfo> {

    const location = "/media/public";
    return yield* callApi<API.PublicMediaFileInfo>({
        caller, nodeName, method: "POST", location, body: file, onProgress, auth, schema: "PublicMediaFileInfo",
        errorFilter
    });
}

export function* getPublicMedia(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    width: number | null = null, download: boolean | null = null, errorFilter: ErrorFilter = false
): CallApiResult<Blob> {

    const location = urlWithParameters(ut`/media/public/${id}/data`, {width, download});
    return yield* callApi<Blob>({
        caller, nodeName, method: "GET", location, schema: "blob", errorFilter
    });
}

export function* getPublicMediaInfo(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false
): CallApiResult<API.PublicMediaFileInfo> {

    const location = ut`/media/public/${id}/info`;
    return yield* callApi<API.PublicMediaFileInfo>({
        caller, nodeName, method: "GET", location, schema: "PublicMediaFileInfo", errorFilter
    });
}

export function* getNodeName(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.NodeNameInfo> {

    const location = "/node-name";
    return yield* callApi<API.NodeNameInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "NodeNameInfo", errorFilter
    });
}

export function* createNodeName(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, nameToRegister: API.NameToRegister,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.RegisteredNameSecret> {

    const location = "/node-name";
    return yield* callApi<API.RegisteredNameSecret>({
        caller, nodeName, method: "POST", location, body: nameToRegister, auth, schema: "RegisteredNameSecret",
        errorFilter
    });
}

export function* updateNodeName(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, secret: API.RegisteredNameSecret,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/node-name";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: secret, auth, schema: "Result", errorFilter
    });
}

export function* deleteNodeName(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/node-name";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* sendNotification(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, packet: API.NotificationPacket,
    errorFilter: ErrorFilter = false
): CallApiResult<API.Result> {

    const location = "/notifications";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: packet, schema: "Result", errorFilter
    });
}

export function* getPeopleGeneral(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.PeopleGeneralInfo> {

    const location = "/people";
    return yield* callApi<API.PeopleGeneralInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PeopleGeneralInfo", errorFilter
    });
}

export function* registerPlugin(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, plugin: API.PluginDescription,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PluginInfo> {

    const location = "/plugins";
    return yield* callApi<API.PluginInfo>({
        caller, nodeName, method: "POST", location, body: plugin, auth, schema: "PluginInfo", errorFilter
    });
}

export function* getPlugins(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): CallApiResult<API.PluginInfo[]> {

    const location = "/plugins";
    return yield* callApi<API.PluginInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PluginInfoArray", errorFilter
    });
}

export function* getPlugin(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, pluginName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PluginInfo> {

    const location = ut`/plugins/${pluginName}`;
    return yield* callApi<API.PluginInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PluginInfo", errorFilter
    });
}

export function* unregisterPlugin(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, pluginName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/plugins/${pluginName}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* createPosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, posting: API.PostingText,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingInfo> {

    const location = "/postings";
    return yield* callApi<API.PostingInfo>({
        caller, nodeName, method: "POST", location, body: posting, auth, schema: "PostingInfo",
        decodeBodies: true, errorFilter
    });
}

export function* updatePosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string, posting: API.PostingText,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingInfo> {

    const location = ut`/postings/${id}`;
    return yield* callApi<API.PostingInfo>({
        caller, nodeName, method: "PUT", location, body: posting, auth, schema: "PostingInfo",
        decodeBodies: true, errorFilter
    });
}

export function* getPosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    withSource: boolean = false, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters(ut`/postings/${id}`, {include});
    return yield* callApi<API.PostingInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfo", decodeBodies: true, errorFilter
    });
}

export function* deletePosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.Result> {

    const location = ut`/postings/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* getPostingsAttachedToPosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingInfo[]> {

    const location = ut`/postings/${id}/attached`;
    return yield* callApi<API.PostingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* getPostingRevisions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingRevisionInfo[]> {

    const location = urlWithParameters(ut`/postings/${postingId}/revisions`, {limit});
    return yield* callApi<API.PostingRevisionInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingRevisionInfoArray", decodeBodies: true,
        errorFilter
    });
}

export function* getPostingRevision(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.PostingRevisionInfo> {

    const location = ut`/postings/${postingId}/revisions/${id}`;
    return yield* callApi<API.PostingRevisionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export function* restorePostingRevision(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingRevisionInfo> {

    const location = ut`/postings/${postingId}/revisions/${id}/restore`;
    return yield* callApi<API.PostingRevisionInfo>({
        caller, nodeName, method: "POST", location, auth, schema: "PostingRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export function* createPostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    reaction: API.ReactionDescription, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionCreated> {

    const location = ut`/postings/${postingId}/reactions`;
    return yield* callApi<API.ReactionCreated>({
        caller, nodeName, method: "POST", location, body: reaction, auth, schema: "ReactionCreated",
        errorFilter
    });
}

export function* getPostingReactionsSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    negative: boolean | null = null, emoji: number | null = null, before: number | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: boolean | string = true
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
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, ownerName: string,
    reaction: API.ReactionOverride, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/reactions/${ownerName}`;
    return yield* callApi<API.ReactionInfo>({
        caller, nodeName, method: "PUT", location, body: reaction, auth, schema: "ReactionInfo", errorFilter
    });
}

export function* getPostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, ownerName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/reactions/${ownerName}`;
    return yield* callApi<API.ReactionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionInfo", errorFilter
    });
}

export function* deleteAllPostingReactions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.Result> {

    const location = ut`/postings/${postingId}/reactions`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* deletePostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, ownerName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/reactions/${ownerName}`;
    return yield* callApi<API.ReactionTotalsInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "ReactionTotalsInfo", errorFilter
    });
}

export function* searchPostingReactions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.ReactionsFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionInfo[]> {

    const location = "/postings/reactions/search";
    return yield* callApi<API.ReactionInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "ReactionInfoArray",
        errorFilter
    });
}

export function* getPostingReactionTotals(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/reaction-totals`;
    return yield* callApi<API.ReactionTotalsInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionTotalsInfo", errorFilter
    });
}

export function* searchPostingReactionTotals(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.ReactionTotalsFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ReactionTotalsInfo[]> {

    const location = "/postings/reaction-totals/search";
    return yield* callApi<API.ReactionTotalsInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "ReactionTotalsInfoArray",
        errorFilter
    });
}

export function* getProfile(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, withSource: boolean = false,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ProfileInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters(ut`/profile`, {include});
    return yield* callApi<API.ProfileInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ProfileInfo", errorFilter
    });
}

export function* updateProfile(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, profile: API.ProfileAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ProfileInfo> {

    const location = "/profile";
    return yield* callApi<API.ProfileInfo>({
        caller, nodeName, method: "PUT", location, body: profile, auth, schema: "ProfileInfo", errorFilter
    });
}

export function* getDeleteNodeRequestStatus(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.DeleteNodeStatus> {

    const location = "/provider/delete-node";
    return yield* callApi<API.DeleteNodeStatus>({
        caller, nodeName, method: "GET", location, auth, schema: "DeleteNodeStatus", errorFilter
    });
}

export function* sendDeleteNodeRequest(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, deleteNodeText: API.DeleteNodeText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DeleteNodeStatus> {

    const location = "/provider/delete-node";
    return yield* callApi<API.DeleteNodeStatus>({
        caller, nodeName, method: "POST", location, body: deleteNodeText, auth, schema: "DeleteNodeStatus",
        errorFilter
    });
}

export function* cancelDeleteNodeRequest(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.DeleteNodeStatus> {

    const location = "/provider/delete-node";
    return yield* callApi<API.DeleteNodeStatus>({
        caller, nodeName, method: "DELETE", location, auth, schema: "DeleteNodeStatus", errorFilter
    });
}

export function* proxyMedia(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, url: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<Blob> {

    const location = urlWithParameters(ut`/proxy/media`, {url});
    return yield* callApi<Blob>({
        caller, nodeName, method: "GET", location, auth, schema: "blob", errorFilter
    });
}

export function* proxyLinkPreview(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, url: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.LinkPreviewInfo> {

    const location = urlWithParameters(ut`/proxy/link-preview`, {url});
    return yield* callApi<API.LinkPreviewInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "LinkPreviewInfo", errorFilter
    });
}

export function* registerAtPushRelay(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string,
    attributes: API.PushRelayClientAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/push-relay";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: attributes, auth, schema: "Result", errorFilter
    });
}

export function* askRemoteNode(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    details: API.AskDescription, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/ask`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: details, auth, schema: "Result", errorFilter
    });
}

export function* createRemoteComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, comment: API.CommentSourceText, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: comment, auth, schema: "Result", errorFilter
    });
}

export function* updateRemoteComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, commentId: string, comment: API.CommentSourceText, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: comment, auth, schema: "Result", errorFilter
    });
}

export function* deleteRemoteComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, commentId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* verifyRemoteComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, commentId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/verify`;
    return yield* callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export function* createRemoteCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, commentId: string, reaction: API.ReactionAttributes, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: reaction, auth, schema: "Result", errorFilter
    });
}

export function* deleteRemoteCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, commentId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* verifyRemoteCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, commentId: string, ownerName: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions/${ownerName}/verify`;
    return yield* callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export function* createRemotePosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    posting: API.PostingSourceText, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: posting, auth, schema: "Result", errorFilter
    });
}

export function* updateRemotePosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, posting: API.PostingSourceText, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: posting, auth, schema: "Result", errorFilter
    });
}

export function* deleteRemotePosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* verifyRemotePosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${id}/verify`;
    return yield* callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export function* verifyRemotePostingRevision(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string, id: string,
    revisionId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${id}/revisions/${revisionId}/verify`;
    return yield* callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export function* createRemotePostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, reaction: API.ReactionAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: reaction, auth, schema: "Result", errorFilter
    });
}

export function* deleteRemotePostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* verifyRemotePostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, ownerName: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions/${ownerName}/verify`;
    return yield* callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export function* createRemoteSheriffOrder(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    sheriffOrder: API.SheriffOrderAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/sheriff/orders`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: sheriffOrder, auth, schema: "Result", errorFilter
    });
}

export function* getRemoteSheriffOrder(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string, id: string,
    errorFilter: ErrorFilter = false
): CallApiResult<API.SheriffOrderInfo> {

    const location = ut`/nodes/${remoteNodeName}/sheriff/orders/${id}`;
    return yield* callApi<API.SheriffOrderInfo>({
        caller, nodeName, method: "GET", location, schema: "SheriffOrderInfo", errorFilter
    });
}

export function* updateSettings(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, settings: API.SettingInfo[],
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/settings";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: settings, auth, schema: "Result", errorFilter
    });
}

export function* getClientSettings(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, prefix: string | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SettingInfo[]> {

    const location = urlWithParameters(ut`/settings/client`, {prefix});
    return yield* callApi<API.SettingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SettingInfoArray", errorFilter
    });
}

export function* getNodeSettings(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, prefix: string | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SettingInfo[]> {

    const location = urlWithParameters(ut`/settings/node`, {prefix});
    return yield* callApi<API.SettingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SettingInfoArray", errorFilter
    });
}

export function* getNodeSettingsMetadata(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, prefix: string | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SettingMetaInfo[]> {

    const location = urlWithParameters(ut`/settings/node/metadata`, {prefix});
    return yield* callApi<API.SettingMetaInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SettingMetaInfoArray", errorFilter
    });
}

export function* updateNodeSettingsMetadata(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, metadata: API.SettingMetaAttributes[],
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/settings/node/metadata";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: metadata, auth, schema: "Result", errorFilter
    });
}

export function* getSheriffComplaintGroupsSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, after: number | null = null,
    before: number | null = null, limit: number | null = null, status: API.SheriffComplaintStatus | null = null,
    errorFilter: ErrorFilter = false
): CallApiResult<API.SheriffComplaintGroupsSliceInfo> {

    const location = urlWithParameters(ut`/sheriff/complaints/groups`, {after, before, limit, status});
    return yield* callApi<API.SheriffComplaintGroupsSliceInfo>({
        caller, nodeName, method: "GET", location, schema: "SheriffComplaintGroupsSliceInfo", errorFilter
    });
}

export function* getSheriffComplaintGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false
): CallApiResult<API.SheriffComplaintGroupInfo> {

    const location = ut`/sheriff/complaints/groups/${id}`;
    return yield* callApi<API.SheriffComplaintGroupInfo>({
        caller, nodeName, method: "GET", location, schema: "SheriffComplaintGroupInfo", errorFilter
    });
}

export function* getSheriffComplaintsByGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false
): CallApiResult<API.SheriffComplaintInfo[]> {

    const location = ut`/sheriff/complaints/groups/${id}/complaints`;
    return yield* callApi<API.SheriffComplaintInfo[]>({
        caller, nodeName, method: "GET", location, schema: "SheriffComplaintInfoArray", errorFilter
    });
}

export function* updateSheriffComplaintGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    decision: API.SheriffComplaintDecisionText, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SheriffComplaintGroupInfo> {

    const location = ut`/sheriff/complaints/groups/${id}`;
    return yield* callApi<API.SheriffComplaintGroupInfo>({
        caller, nodeName, method: "PUT", location, body: decision, auth, schema: "SheriffComplaintGroupInfo",
        errorFilter
    });
}

export function* createSheriffComplaint(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, complaint: API.SheriffComplaintText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SheriffComplaintInfo> {

    const location = "/sheriff/complaints";
    return yield* callApi<API.SheriffComplaintInfo>({
        caller, nodeName, method: "POST", location, body: complaint, auth, schema: "SheriffComplaintInfo",
        errorFilter
    });
}

export function* createSheriffOrder(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, sheriffOrder: API.SheriffOrderDetails,
    errorFilter: ErrorFilter = false
): CallApiResult<API.Result> {

    const location = "/sheriff/orders";
    return yield* callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: sheriffOrder, schema: "Result", errorFilter
    });
}

export function* getStory(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.StoryInfo> {

    const location = ut`/stories/${id}`;
    return yield* callApi<API.StoryInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "StoryInfo", decodeBodies: true, errorFilter
    });
}

export function* updateStory(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string, story: API.StoryAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.StoryInfo> {

    const location = ut`/stories/${id}`;
    return yield* callApi<API.StoryInfo>({
        caller, nodeName, method: "PUT", location, body: story, auth, schema: "StoryInfo", decodeBodies: true,
        errorFilter
    });
}

export function* deleteStory(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/stories/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* getSubscribers(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string | null = null,
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
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, subscriber: API.SubscriberDescription,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SubscriberInfo> {

    const location = "/people/subscribers";
    return yield* callApi<API.SubscriberInfo>({
        caller, nodeName, method: "POST", location, body: subscriber, auth, schema: "SubscriberInfo",
        errorFilter
    });
}

export function* getSubscriber(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.SubscriberInfo> {

    const location = ut`/people/subscribers/${id}`;
    return yield* callApi<API.SubscriberInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "SubscriberInfo", errorFilter
    });
}

export function* updateSubscriber(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    subscriber: API.SubscriberOverride, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SubscriberInfo> {

    const location = ut`/people/subscribers/${id}`;
    return yield* callApi<API.SubscriberInfo>({
        caller, nodeName, method: "PUT", location, body: subscriber, auth, schema: "SubscriberInfo",
        errorFilter
    });
}

export function* deleteSubscriber(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.ContactInfo> {

    const location = ut`/people/subscribers/${id}`;
    return yield* callApi<API.ContactInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "ContactInfo", errorFilter
    });
}

export function* getSubscriptions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string | null = null,
    type: API.SubscriptionType | null = null, errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.SubscriptionInfo[]> {

    const location = urlWithParameters(ut`/people/subscriptions`, {nodeName: remoteNodeName, type});
    return yield* callApi<API.SubscriptionInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SubscriptionInfoArray", errorFilter
    });
}

export function* createSubscription(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string,
    subscription: API.SubscriptionDescription, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SubscriptionInfo> {

    const location = "/people/subscriptions";
    return yield* callApi<API.SubscriptionInfo>({
        caller, nodeName, method: "POST", location, body: subscription, auth, schema: "SubscriptionInfo",
        errorFilter
    });
}

export function* updateSubscription(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    subscription: API.SubscriptionOverride, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SubscriptionInfo> {

    const location = ut`/people/subscriptions/${id}`;
    return yield* callApi<API.SubscriptionInfo>({
        caller, nodeName, method: "PUT", location, body: subscription, auth, schema: "SubscriptionInfo",
        errorFilter
    });
}

export function* deleteSubscription(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ContactInfo> {

    const location = ut`/people/subscriptions/${id}`;
    return yield* callApi<API.ContactInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "ContactInfo", errorFilter
    });
}

export function* searchSubscriptions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.SubscriptionFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): CallApiResult<API.SubscriptionInfo[]> {

    const location = "/people/subscriptions/search";
    return yield* callApi<API.SubscriptionInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "SubscriptionInfoArray",
        errorFilter
    });
}

export function* getTokens(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.TokenInfo[]> {

    const location = "/tokens";
    return yield* callApi<API.TokenInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "TokenInfoArray", errorFilter
    });
}

export function* createToken(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, token: API.TokenAttributes,
    errorFilter: ErrorFilter = false
): CallApiResult<API.TokenInfo> {

    const location = "/tokens";
    return yield* callApi<API.TokenInfo>({
        caller, nodeName, method: "POST", location, body: token, schema: "TokenInfo", errorFilter
    });
}

export function* getTokenInfo(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.TokenInfo> {

    const location = ut`/tokens/${id}`;
    return yield* callApi<API.TokenInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "TokenInfo", errorFilter
    });
}

export function* updateToken(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string, update: API.TokenUpdate,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.TokenInfo> {

    const location = ut`/tokens/${id}`;
    return yield* callApi<API.TokenInfo>({
        caller, nodeName, method: "PUT", location, body: update, auth, schema: "TokenInfo", errorFilter
    });
}

export function* deleteToken(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/tokens/${id}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* getUserListGeneral(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    errorFilter: ErrorFilter = false
): CallApiResult<API.UserListInfo> {

    const location = ut`/user-lists/${name}`;
    return yield* callApi<API.UserListInfo>({
        caller, nodeName, method: "GET", location, schema: "UserListInfo", errorFilter
    });
}

export function* getUserListSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    after: number | null = null, before: number | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false
): CallApiResult<API.UserListSliceInfo> {

    const location = urlWithParameters(ut`/user-lists/${name}/items`, {after, before, limit});
    return yield* callApi<API.UserListSliceInfo>({
        caller, nodeName, method: "GET", location, schema: "UserListSliceInfo", errorFilter
    });
}

export function* getUserListItem(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string, remoteNodeName: string,
    errorFilter: ErrorFilter = false
): CallApiResult<API.UserListItemInfo> {

    const location = ut`/user-lists/${name}/items/${remoteNodeName}`;
    return yield* callApi<API.UserListItemInfo>({
        caller, nodeName, method: "GET", location, schema: "UserListItemInfo", errorFilter
    });
}

export function* createUserListItem(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    item: API.UserListItemAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.UserListItemInfo> {

    const location = ut`/user-lists/${name}/items`;
    return yield* callApi<API.UserListItemInfo>({
        caller, nodeName, method: "POST", location, body: item, auth, schema: "UserListItemInfo", errorFilter
    });
}

export function* deleteUserListItem(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string, remoteNodeName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/user-lists/${name}/items/${remoteNodeName}`;
    return yield* callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export function* whoAmI(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false
): CallApiResult<API.WhoAmI> {

    const location = "/whoami";
    return yield* callApi<API.WhoAmI>({
        caller, nodeName, method: "GET", location, schema: "WhoAmI", errorFilter
    });
}
