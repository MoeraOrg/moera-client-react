// This file is generated

import { callApi, ErrorFilter } from "api/node/call";
import * as API from "api/node/api-types";
import { ProgressHandler } from 'api/fetcher';
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { RelNodeName } from "util/rel-node-name";
import { urlWithParameters, ut } from "util/url";
import { commaSeparatedFlags } from "util/misc";

export async function searchActivityReactions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.ActivityReactionFilter,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.ActivityReactionInfo[]> {

    const location = "/activity/reactions/search";
    return callApi<API.ActivityReactionInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "ActivityReactionInfoArray",
        errorFilter
    });
}

export async function getSearchHistory(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, prefix: string | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.SearchHistoryInfo[]> {

    const location = urlWithParameters(ut`/activity/search`, {prefix, limit});
    return callApi<API.SearchHistoryInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SearchHistoryInfoArray", errorFilter
    });
}

export async function saveToSearchHistory(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, historyText: API.SearchHistoryText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.SearchHistoryInfo> {

    const location = "/activity/search";
    return callApi<API.SearchHistoryInfo>({
        caller, nodeName, method: "POST", location, body: historyText, auth, schema: "SearchHistoryInfo",
        errorFilter
    });
}

export async function deleteFromSearchHistory(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, query: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = urlWithParameters(ut`/activity/search`, {query});
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function getRemoteSheriffOrdersSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, after: number | null = null,
    before: number | null = null, limit: number | null = null, errorFilter: ErrorFilter = false
): Promise<API.SheriffOrdersSliceInfo> {

    const location = urlWithParameters(ut`/activity/sheriff/orders`, {after, before, limit});
    return callApi<API.SheriffOrdersSliceInfo>({
        caller, nodeName, method: "GET", location, schema: "SheriffOrdersSliceInfo", errorFilter
    });
}

export async function getRemotePostingVerificationStatus(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.RemotePostingVerificationInfo> {

    const location = ut`/async-operations/remote-posting-verification/${id}`;
    return callApi<API.RemotePostingVerificationInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "RemotePostingVerificationInfo", errorFilter
    });
}

export async function getRemoteReactionVerificationStatus(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.RemoteReactionVerificationInfo> {

    const location = ut`/async-operations/remote-reaction-verification/${id}`;
    return callApi<API.RemoteReactionVerificationInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "RemoteReactionVerificationInfo", errorFilter
    });
}

export async function getAvatars(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false
): Promise<API.AvatarInfo[]> {

    const location = "/avatars";
    return callApi<API.AvatarInfo[]>({
        caller, nodeName, method: "GET", location, schema: "AvatarInfoArray", errorFilter
    });
}

export async function createAvatar(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, avatar: API.AvatarAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.AvatarInfo> {

    const location = "/avatars";
    return callApi<API.AvatarInfo>({
        caller, nodeName, method: "POST", location, body: avatar, auth, schema: "AvatarInfo", errorFilter
    });
}

export async function getAvatar(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false
): Promise<API.AvatarInfo> {

    const location = ut`/avatars/${id}`;
    return callApi<API.AvatarInfo>({
        caller, nodeName, method: "GET", location, schema: "AvatarInfo", errorFilter
    });
}

export async function deleteAvatar(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/avatars/${id}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function reorderAvatars(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, order: API.AvatarsOrdered,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.AvatarOrdinal[]> {

    const location = "/avatars/reorder";
    return callApi<API.AvatarOrdinal[]>({
        caller, nodeName, method: "POST", location, body: order, auth, schema: "AvatarOrdinalArray",
        errorFilter
    });
}

export async function blockInstant(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, instant: API.BlockedInstantAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.BlockedInstantInfo> {

    const location = "/blocked-instants";
    return callApi<API.BlockedInstantInfo>({
        caller, nodeName, method: "POST", location, body: instant, auth, schema: "BlockedInstantInfo",
        errorFilter
    });
}

export async function getBlockedInstant(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.BlockedInstantInfo> {

    const location = ut`/blocked-instants/${id}`;
    return callApi<API.BlockedInstantInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "BlockedInstantInfo", errorFilter
    });
}

export async function unblockInstant(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/blocked-instants/${id}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function searchBlockedInstants(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.BlockedInstantFilter,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.BlockedInstantInfo[]> {

    const location = "/blocked-instants/search";
    return callApi<API.BlockedInstantInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "BlockedInstantInfoArray",
        errorFilter
    });
}

export async function blockUser(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, user: API.BlockedUserAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.BlockedUserInfo> {

    const location = "/people/blocked-users";
    return callApi<API.BlockedUserInfo>({
        caller, nodeName, method: "POST", location, body: user, auth, schema: "BlockedUserInfo", errorFilter
    });
}

export async function getBlockedUser(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.BlockedUserInfo> {

    const location = ut`/people/blocked-users/${id}`;
    return callApi<API.BlockedUserInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "BlockedUserInfo", errorFilter
    });
}

export async function unblockUser(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/people/blocked-users/${id}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function searchBlockedUsers(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.BlockedUserFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.BlockedUserInfo[]> {

    const location = "/people/blocked-users/search";
    return callApi<API.BlockedUserInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "BlockedUserInfoArray",
        errorFilter
    });
}

export async function getBlockedUsersChecksums(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.BlockedUsersChecksums> {

    const location = "/people/blocked-users/checksums";
    return callApi<API.BlockedUsersChecksums>({
        caller, nodeName, method: "GET", location, auth, schema: "BlockedUsersChecksums", errorFilter
    });
}

export async function getBlockedByUser(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.BlockedByUserInfo> {

    const location = ut`/people/blocked-by-users/${id}`;
    return callApi<API.BlockedByUserInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "BlockedByUserInfo", errorFilter
    });
}

export async function searchBlockedByUsers(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.BlockedByUserFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.BlockedByUserInfo[]> {

    const location = "/people/blocked-by-users/search";
    return callApi<API.BlockedByUserInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "BlockedByUserInfoArray",
        errorFilter
    });
}

export async function createCartes(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, attributes: API.CarteAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.CarteSet> {

    const location = "/cartes";
    return callApi<API.CarteSet>({
        caller, nodeName, method: "POST", location, body: attributes, auth, schema: "CarteSet", errorFilter
    });
}

export async function verifyCarte(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, clientCarte: API.ClientCarte,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.CarteVerificationInfo> {

    const location = "/cartes/verify";
    return callApi<API.CarteVerificationInfo>({
        caller, nodeName, method: "POST", location, body: clientCarte, auth, schema: "CarteVerificationInfo",
        errorFilter
    });
}

export async function getCommentsSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    after: number | null = null, before: number | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.CommentsSliceInfo> {

    const location = urlWithParameters(ut`/postings/${postingId}/comments`, {after, before, limit});
    return callApi<API.CommentsSliceInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "CommentsSliceInfo", decodeBodies: true,
        errorFilter
    });
}

export async function createComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    comment: API.CommentText, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.CommentCreated> {

    const location = ut`/postings/${postingId}/comments`;
    return callApi<API.CommentCreated>({
        caller, nodeName, method: "POST", location, body: comment, auth, schema: "CommentCreated",
        decodeBodies: true, errorFilter
    });
}

export async function getComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    withSource: boolean = false, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.CommentInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters(ut`/postings/${postingId}/comments/${commentId}`, {include});
    return callApi<API.CommentInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "CommentInfo", decodeBodies: true, errorFilter
    });
}

export async function updateAllComments(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    attributes: API.CommentMassAttributes, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.Result> {

    const location = ut`/postings/${postingId}/comments`;
    return callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: attributes, auth, schema: "Result", errorFilter
    });
}

export async function updateComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    comment: API.CommentText, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.CommentInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}`;
    return callApi<API.CommentInfo>({
        caller, nodeName, method: "PUT", location, body: comment, auth, schema: "CommentInfo",
        decodeBodies: true, errorFilter
    });
}

export async function deleteComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.CommentTotalInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}`;
    return callApi<API.CommentTotalInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "CommentTotalInfo", errorFilter
    });
}

export async function getPostingsAttachedToComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.PostingInfo[]> {

    const location = ut`/postings/${postingId}/comments/${commentId}/attached`;
    return callApi<API.PostingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfoArray", decodeBodies: true,
        errorFilter
    });
}

export async function getCommentRevisions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.CommentRevisionInfo[]> {

    const location = ut`/postings/${postingId}/comments/${commentId}/revisions`;
    return callApi<API.CommentRevisionInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "CommentRevisionInfoArray", decodeBodies: true,
        errorFilter
    });
}

export async function getCommentRevision(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    id: string, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.CommentRevisionInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/revisions/${id}`;
    return callApi<API.CommentRevisionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "CommentRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export async function createCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    reaction: API.ReactionDescription, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionCreated> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions`;
    return callApi<API.ReactionCreated>({
        caller, nodeName, method: "POST", location, body: reaction, auth, schema: "ReactionCreated",
        errorFilter
    });
}

export async function updateCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    ownerName: string, reaction: API.ReactionOverride, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`;
    return callApi<API.ReactionInfo>({
        caller, nodeName, method: "PUT", location, body: reaction, auth, schema: "ReactionInfo", errorFilter
    });
}

export async function getCommentReactionsSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    negative: boolean | null = null, emoji: number | null = null, before: number | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionsSliceInfo> {

    const location = urlWithParameters(
        ut`/postings/${postingId}/comments/${commentId}/reactions`,
        {negative, emoji, before, limit}
    );
    return callApi<API.ReactionsSliceInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionsSliceInfo", errorFilter
    });
}

export async function getCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    ownerName: string, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`;
    return callApi<API.ReactionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionInfo", errorFilter
    });
}

export async function deleteAllCommentReactions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function deleteCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    ownerName: string, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`;
    return callApi<API.ReactionTotalsInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "ReactionTotalsInfo", errorFilter
    });
}

export async function getCommentReactionTotals(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reaction-totals`;
    return callApi<API.ReactionTotalsInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionTotalsInfo", errorFilter
    });
}

export async function getContacts(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, query: string | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.ContactInfo[]> {

    const location = urlWithParameters(ut`/people/contacts`, {query, limit});
    return callApi<API.ContactInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "ContactInfoArray", errorFilter
    });
}

export async function checkCredentials(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false
): Promise<API.CredentialsCreated> {

    const location = "/credentials";
    return callApi<API.CredentialsCreated>({
        caller, nodeName, method: "GET", location, schema: "CredentialsCreated", errorFilter
    });
}

export async function createCredentials(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, credentials: API.Credentials,
    errorFilter: ErrorFilter = false
): Promise<API.Result> {

    const location = "/credentials";
    return callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: credentials, schema: "Result", errorFilter
    });
}

export async function updateCredentials(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, credentials: API.CredentialsChange,
    errorFilter: ErrorFilter = false
): Promise<API.Result> {

    const location = "/credentials";
    return callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: credentials, schema: "Result", errorFilter
    });
}

export async function deleteCredentials(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.Result> {

    const location = "/credentials";
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function resetCredentials(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false
): Promise<API.EmailHint> {

    const location = "/credentials/reset";
    return callApi<API.EmailHint>({
        caller, nodeName, method: "POST", location, schema: "EmailHint", errorFilter
    });
}

export async function getDeletedPostings(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, page: number | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.PostingInfo[]> {

    const location = urlWithParameters(ut`/deleted-postings`, {page, limit});
    return callApi<API.PostingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfoArray", decodeBodies: true,
        errorFilter
    });
}

export async function getDeletedPosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.PostingInfo> {

    const location = ut`/deleted-postings/${id}`;
    return callApi<API.PostingInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfo", decodeBodies: true, errorFilter
    });
}

export async function restoreDeletedPosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.PostingInfo> {

    const location = ut`/deleted-postings/${id}/restore`;
    return callApi<API.PostingInfo>({
        caller, nodeName, method: "POST", location, auth, schema: "PostingInfo", decodeBodies: true,
        errorFilter
    });
}

export async function getDeletePostingRevisions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.PostingRevisionInfo[]> {

    const location = urlWithParameters(ut`/deleted-postings/${postingId}/revisions`, {limit});
    return callApi<API.PostingRevisionInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingRevisionInfoArray", decodeBodies: true,
        errorFilter
    });
}

export async function getDeletedPostingRevision(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.PostingRevisionInfo> {

    const location = ut`/deleted-postings/${postingId}/revisions/${id}`;
    return callApi<API.PostingRevisionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export async function restoreDeletedPostingRevision(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.PostingRevisionInfo> {

    const location = ut`/postings/${postingId}/revisions/${id}/restore`;
    return callApi<API.PostingRevisionInfo>({
        caller, nodeName, method: "POST", location, auth, schema: "PostingRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export async function getDomains(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.DomainInfo[]> {

    const location = "/domains";
    return callApi<API.DomainInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "DomainInfoArray", errorFilter
    });
}

export async function getDomain(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.DomainInfo> {

    const location = ut`/domains/${name}`;
    return callApi<API.DomainInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "DomainInfo", errorFilter
    });
}

export async function createDomain(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, domain: API.DomainAttributes,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.DomainInfo> {

    const location = "/domains";
    return callApi<API.DomainInfo>({
        caller, nodeName, method: "POST", location, body: domain, auth, schema: "DomainInfo", errorFilter
    });
}

export async function updateDomain(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    domain: API.DomainAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.DomainInfo> {

    const location = ut`/domains/${name}`;
    return callApi<API.DomainInfo>({
        caller, nodeName, method: "PUT", location, body: domain, auth, schema: "DomainInfo", errorFilter
    });
}

export async function deleteDomain(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/domains/${name}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function isDomainAvailable(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    errorFilter: ErrorFilter = false
): Promise<API.DomainAvailable> {

    const location = urlWithParameters(ut`/domains/available`, {nodeName: remoteNodeName});
    return callApi<API.DomainAvailable>({
        caller, nodeName, method: "GET", location, schema: "DomainAvailable", errorFilter
    });
}

export async function getDrafts(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, draftType: API.DraftType,
    remoteNodeName: string, postingId: string | null = null, commentId: string | null = null, page: number | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.DraftInfo[]> {

    const location = urlWithParameters(
        ut`/drafts`,
        {draftType, nodeName: remoteNodeName, postingId, commentId, page, limit}
    );
    return callApi<API.DraftInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "DraftInfoArray", decodeBodies: true,
        errorFilter
    });
}

export async function createDraft(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, draft: API.DraftText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.DraftInfo> {

    const location = "/drafts";
    return callApi<API.DraftInfo>({
        caller, nodeName, method: "POST", location, body: draft, auth, schema: "DraftInfo", decodeBodies: true,
        errorFilter
    });
}

export async function getDraft(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.DraftInfo> {

    const location = ut`/drafts/${id}`;
    return callApi<API.DraftInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "DraftInfo", decodeBodies: true, errorFilter
    });
}

export async function updateDraft(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string, draft: API.DraftText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.DraftInfo> {

    const location = ut`/drafts/${id}`;
    return callApi<API.DraftInfo>({
        caller, nodeName, method: "PUT", location, body: draft, auth, schema: "DraftInfo", decodeBodies: true,
        errorFilter
    });
}

export async function deleteDraft(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/drafts/${id}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function getFeatures(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): Promise<API.Features> {

    const location = "/features";
    return callApi<API.Features>({
        caller, nodeName, method: "GET", location, auth, schema: "Features", errorFilter
    });
}

export async function getFeeds(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): Promise<API.FeedInfo[]> {

    const location = "/feeds";
    return callApi<API.FeedInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "FeedInfoArray", errorFilter
    });
}

export async function getFeedGeneral(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, feedName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.FeedInfo> {

    const location = ut`/feeds/${feedName}`;
    return callApi<API.FeedInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FeedInfo", errorFilter
    });
}

export async function getFeedStatus(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, feedName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.FeedStatus> {

    const location = ut`/feeds/${feedName}/status`;
    return callApi<API.FeedStatus>({
        caller, nodeName, method: "GET", location, auth, schema: "FeedStatus", errorFilter
    });
}

export async function updateFeedStatus(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, feedName: string,
    change: API.FeedStatusChange, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.FeedStatus> {

    const location = ut`/feeds/${feedName}/status`;
    return callApi<API.FeedStatus>({
        caller, nodeName, method: "PUT", location, body: change, auth, schema: "FeedStatus", errorFilter
    });
}

export async function getFeedSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, feedName: string,
    after: number | null = null, before: number | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.FeedSliceInfo> {

    const location = urlWithParameters(ut`/feeds/${feedName}/stories`, {after, before, limit});
    return callApi<API.FeedSliceInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FeedSliceInfo", decodeBodies: true,
        errorFilter
    });
}

export async function getFriendGroups(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): Promise<API.FriendGroupInfo[]> {

    const location = "/people/friends/groups";
    return callApi<API.FriendGroupInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendGroupInfoArray", errorFilter
    });
}

export async function getFriendGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.FriendGroupInfo> {

    const location = ut`/people/friends/groups/${id}`;
    return callApi<API.FriendGroupInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendGroupInfo", errorFilter
    });
}

export async function createFriendGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string,
    friendGroup: API.FriendGroupDescription, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.FriendGroupInfo> {

    const location = "/people/friends/groups";
    return callApi<API.FriendGroupInfo>({
        caller, nodeName, method: "POST", location, body: friendGroup, auth, schema: "FriendGroupInfo",
        errorFilter
    });
}

export async function updateFriendGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    friendGroup: API.FriendGroupDescription, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.FriendGroupInfo> {

    const location = ut`/people/friends/groups/${id}`;
    return callApi<API.FriendGroupInfo>({
        caller, nodeName, method: "PUT", location, body: friendGroup, auth, schema: "FriendGroupInfo",
        errorFilter
    });
}

export async function deleteFriendGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/people/friends/groups/${id}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function getFriends(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, groupId: string | null = null,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.FriendInfo[]> {

    const location = urlWithParameters(ut`/people/friends`, {groupId});
    return callApi<API.FriendInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendInfoArray", errorFilter
    });
}

export async function getFriend(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.FriendInfo> {

    const location = ut`/people/friends/${name}`;
    return callApi<API.FriendInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendInfo", errorFilter
    });
}

export async function updateFriends(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, friends: API.FriendDescription[],
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.FriendInfo[]> {

    const location = "/people/friends";
    return callApi<API.FriendInfo[]>({
        caller, nodeName, method: "PUT", location, body: friends, auth, schema: "FriendInfoArray", errorFilter
    });
}

export async function getFriendOfs(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): Promise<API.FriendOfInfo[]> {

    const location = "/people/friend-ofs";
    return callApi<API.FriendOfInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendOfInfoArray", errorFilter
    });
}

export async function getFriendOf(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.FriendOfInfo> {

    const location = ut`/people/friend-ofs/${name}`;
    return callApi<API.FriendOfInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "FriendOfInfo", errorFilter
    });
}

export async function getAllGrants(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.GrantInfo[]> {

    const location = "/grants";
    return callApi<API.GrantInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "GrantInfoArray", errorFilter
    });
}

export async function getGrant(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.GrantInfo> {

    const location = ut`/grants/${remoteNodeName}`;
    return callApi<API.GrantInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "GrantInfo", errorFilter
    });
}

export async function grantOrRevoke(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    change: API.GrantChange, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.GrantInfo> {

    const location = ut`/grants/${remoteNodeName}`;
    return callApi<API.GrantInfo>({
        caller, nodeName, method: "PUT", location, body: change, auth, schema: "GrantInfo", errorFilter
    });
}

export async function revokeAll(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/grants/${remoteNodeName}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function uploadAdminMedia(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, file: File,
    onProgress?: ProgressHandler, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.PrivateMediaFileInfo> {

    const location = "/media/private";
    return callApi<API.PrivateMediaFileInfo>({
        caller, nodeName, method: "POST", location, body: file, onProgress, auth, schema: "PrivateMediaFileInfo",
        errorFilter
    });
}

export async function uploadPrivateMedia(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, clientName: string, file: File,
    onProgress?: ProgressHandler, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.PrivateMediaFileInfo> {

    const location = ut`/media/private/${clientName}`;
    return callApi<API.PrivateMediaFileInfo>({
        caller, nodeName, method: "POST", location, body: file, onProgress, auth, schema: "PrivateMediaFileInfo",
        errorFilter
    });
}

export async function getPrivateMedia(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    width: number | null = null, download: boolean | null = null, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): Promise<Blob> {

    const location = urlWithParameters(ut`/media/private/${id}/data`, {width, download});
    return callApi<Blob>({
        caller, nodeName, method: "GET", location, auth, schema: "blob", errorFilter
    });
}

export async function getPrivateMediaInfo(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.PrivateMediaFileInfo> {

    const location = ut`/media/private/${id}/info`;
    return callApi<API.PrivateMediaFileInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PrivateMediaFileInfo", errorFilter
    });
}

export async function getPrivateMediaParentEntry(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.EntryInfo[]> {

    const location = ut`/media/private/${id}/parent`;
    return callApi<API.EntryInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "EntryInfoArray", decodeBodies: true,
        errorFilter
    });
}

export async function uploadPublicMedia(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, file: File,
    onProgress?: ProgressHandler, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.PublicMediaFileInfo> {

    const location = "/media/public";
    return callApi<API.PublicMediaFileInfo>({
        caller, nodeName, method: "POST", location, body: file, onProgress, auth, schema: "PublicMediaFileInfo",
        errorFilter
    });
}

export async function getPublicMedia(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    width: number | null = null, download: boolean | null = null, errorFilter: ErrorFilter = false
): Promise<Blob> {

    const location = urlWithParameters(ut`/media/public/${id}/data`, {width, download});
    return callApi<Blob>({
        caller, nodeName, method: "GET", location, schema: "blob", errorFilter
    });
}

export async function getPublicMediaInfo(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false
): Promise<API.PublicMediaFileInfo> {

    const location = ut`/media/public/${id}/info`;
    return callApi<API.PublicMediaFileInfo>({
        caller, nodeName, method: "GET", location, schema: "PublicMediaFileInfo", errorFilter
    });
}

export async function getNodeName(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): Promise<API.NodeNameInfo> {

    const location = "/node-name";
    return callApi<API.NodeNameInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "NodeNameInfo", errorFilter
    });
}

export async function createNodeName(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, nameToRegister: API.NameToRegister,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.RegisteredNameSecret> {

    const location = "/node-name";
    return callApi<API.RegisteredNameSecret>({
        caller, nodeName, method: "POST", location, body: nameToRegister, auth, schema: "RegisteredNameSecret",
        errorFilter
    });
}

export async function updateNodeName(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, secret: API.RegisteredNameSecret,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = "/node-name";
    return callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: secret, auth, schema: "Result", errorFilter
    });
}

export async function deleteNodeName(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.Result> {

    const location = "/node-name";
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function getStoredMnemonic(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.KeyMnemonic> {

    const location = "/node-name/mnemonic";
    return callApi<API.KeyMnemonic>({
        caller, nodeName, method: "GET", location, auth, schema: "KeyMnemonic", errorFilter
    });
}

export async function storeMnemonic(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, mnemonic: API.KeyMnemonic,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = "/node-name/mnemonic";
    return callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: mnemonic, auth, schema: "Result", errorFilter
    });
}

export async function deleteStoredMnemonic(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.Result> {

    const location = "/node-name/mnemonic";
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function sendNotification(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, packet: API.NotificationPacket,
    errorFilter: ErrorFilter = false
): Promise<API.Result> {

    const location = "/notifications";
    return callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: packet, schema: "Result", errorFilter
    });
}

export async function getPeopleGeneral(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): Promise<API.PeopleGeneralInfo> {

    const location = "/people";
    return callApi<API.PeopleGeneralInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PeopleGeneralInfo", errorFilter
    });
}

export async function registerPlugin(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, plugin: API.PluginDescription,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.PluginInfo> {

    const location = "/plugins";
    return callApi<API.PluginInfo>({
        caller, nodeName, method: "POST", location, body: plugin, auth, schema: "PluginInfo", errorFilter
    });
}

export async function getPlugins(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): Promise<API.PluginInfo[]> {

    const location = "/plugins";
    return callApi<API.PluginInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PluginInfoArray", errorFilter
    });
}

export async function getPlugin(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, pluginName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.PluginInfo> {

    const location = ut`/plugins/${pluginName}`;
    return callApi<API.PluginInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PluginInfo", errorFilter
    });
}

export async function unregisterPlugin(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, pluginName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/plugins/${pluginName}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function createPosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, posting: API.PostingText,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.PostingInfo> {

    const location = "/postings";
    return callApi<API.PostingInfo>({
        caller, nodeName, method: "POST", location, body: posting, auth, schema: "PostingInfo",
        decodeBodies: true, errorFilter
    });
}

export async function updatePosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string, posting: API.PostingText,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.PostingInfo> {

    const location = ut`/postings/${id}`;
    return callApi<API.PostingInfo>({
        caller, nodeName, method: "PUT", location, body: posting, auth, schema: "PostingInfo",
        decodeBodies: true, errorFilter
    });
}

export async function getPosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    withSource: boolean = false, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.PostingInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters(ut`/postings/${id}`, {include});
    return callApi<API.PostingInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfo", decodeBodies: true, errorFilter
    });
}

export async function deletePosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.Result> {

    const location = ut`/postings/${id}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function getPostingsAttachedToPosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.PostingInfo[]> {

    const location = ut`/postings/${id}/attached`;
    return callApi<API.PostingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingInfoArray", decodeBodies: true,
        errorFilter
    });
}

export async function getPostingRevisions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.PostingRevisionInfo[]> {

    const location = urlWithParameters(ut`/postings/${postingId}/revisions`, {limit});
    return callApi<API.PostingRevisionInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingRevisionInfoArray", decodeBodies: true,
        errorFilter
    });
}

export async function getPostingRevision(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.PostingRevisionInfo> {

    const location = ut`/postings/${postingId}/revisions/${id}`;
    return callApi<API.PostingRevisionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "PostingRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export async function restorePostingRevision(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.PostingRevisionInfo> {

    const location = ut`/postings/${postingId}/revisions/${id}/restore`;
    return callApi<API.PostingRevisionInfo>({
        caller, nodeName, method: "POST", location, auth, schema: "PostingRevisionInfo", decodeBodies: true,
        errorFilter
    });
}

export async function createPostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    reaction: API.ReactionDescription, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionCreated> {

    const location = ut`/postings/${postingId}/reactions`;
    return callApi<API.ReactionCreated>({
        caller, nodeName, method: "POST", location, body: reaction, auth, schema: "ReactionCreated",
        errorFilter
    });
}

export async function getPostingReactionsSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    negative: boolean | null = null, emoji: number | null = null, before: number | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionsSliceInfo> {

    const location = urlWithParameters(
        ut`/postings/${postingId}/reactions`,
        {negative, emoji, before, limit}
    );
    return callApi<API.ReactionsSliceInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionsSliceInfo", errorFilter
    });
}

export async function updatePostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, ownerName: string,
    reaction: API.ReactionOverride, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/reactions/${ownerName}`;
    return callApi<API.ReactionInfo>({
        caller, nodeName, method: "PUT", location, body: reaction, auth, schema: "ReactionInfo", errorFilter
    });
}

export async function getPostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, ownerName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/reactions/${ownerName}`;
    return callApi<API.ReactionInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionInfo", errorFilter
    });
}

export async function deleteAllPostingReactions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.Result> {

    const location = ut`/postings/${postingId}/reactions`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function deletePostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string, ownerName: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/reactions/${ownerName}`;
    return callApi<API.ReactionTotalsInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "ReactionTotalsInfo", errorFilter
    });
}

export async function searchPostingReactions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.ReactionsFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionInfo[]> {

    const location = "/postings/reactions/search";
    return callApi<API.ReactionInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "ReactionInfoArray",
        errorFilter
    });
}

export async function getPostingReactionTotals(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, postingId: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/reaction-totals`;
    return callApi<API.ReactionTotalsInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ReactionTotalsInfo", errorFilter
    });
}

export async function searchPostingReactionTotals(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.ReactionTotalsFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ReactionTotalsInfo[]> {

    const location = "/postings/reaction-totals/search";
    return callApi<API.ReactionTotalsInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "ReactionTotalsInfoArray",
        errorFilter
    });
}

export async function getProfile(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, withSource: boolean = false,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ProfileInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters(ut`/profile`, {include});
    return callApi<API.ProfileInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "ProfileInfo", errorFilter
    });
}

export async function updateProfile(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, profile: API.ProfileAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.ProfileInfo> {

    const location = "/profile";
    return callApi<API.ProfileInfo>({
        caller, nodeName, method: "PUT", location, body: profile, auth, schema: "ProfileInfo", errorFilter
    });
}

export async function getDeleteNodeRequestStatus(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.DeleteNodeStatus> {

    const location = "/provider/delete-node";
    return callApi<API.DeleteNodeStatus>({
        caller, nodeName, method: "GET", location, auth, schema: "DeleteNodeStatus", errorFilter
    });
}

export async function sendDeleteNodeRequest(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, deleteNodeText: API.DeleteNodeText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.DeleteNodeStatus> {

    const location = "/provider/delete-node";
    return callApi<API.DeleteNodeStatus>({
        caller, nodeName, method: "POST", location, body: deleteNodeText, auth, schema: "DeleteNodeStatus",
        errorFilter
    });
}

export async function cancelDeleteNodeRequest(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.DeleteNodeStatus> {

    const location = "/provider/delete-node";
    return callApi<API.DeleteNodeStatus>({
        caller, nodeName, method: "DELETE", location, auth, schema: "DeleteNodeStatus", errorFilter
    });
}

export async function proxyMedia(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, url: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<Blob> {

    const location = urlWithParameters(ut`/proxy/media`, {url});
    return callApi<Blob>({
        caller, nodeName, method: "GET", location, auth, schema: "blob", errorFilter
    });
}

export async function proxyLinkPreview(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, url: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.LinkPreviewInfo> {

    const location = urlWithParameters(ut`/proxy/link-preview`, {url});
    return callApi<API.LinkPreviewInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "LinkPreviewInfo", errorFilter
    });
}

export async function registerAtPushRelay(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string,
    attributes: API.PushRelayClientAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = "/push-relay";
    return callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: attributes, auth, schema: "Result", errorFilter
    });
}

export async function askRemoteNode(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    details: API.AskDescription, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/ask`;
    return callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: details, auth, schema: "Result", errorFilter
    });
}

export async function createRemoteComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, comment: API.CommentSourceText, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments`;
    return callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: comment, auth, schema: "Result", errorFilter
    });
}

export async function updateRemoteComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, commentId: string, comment: API.CommentSourceText, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}`;
    return callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: comment, auth, schema: "Result", errorFilter
    });
}

export async function deleteRemoteComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, commentId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function verifyRemoteComment(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, commentId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/verify`;
    return callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export async function createRemoteCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, commentId: string, reaction: API.ReactionAttributes, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions`;
    return callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: reaction, auth, schema: "Result", errorFilter
    });
}

export async function deleteRemoteCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, commentId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function verifyRemoteCommentReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, commentId: string, ownerName: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions/${ownerName}/verify`;
    return callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export async function createRemotePosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    posting: API.PostingSourceText, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings`;
    return callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: posting, auth, schema: "Result", errorFilter
    });
}

export async function updateRemotePosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, posting: API.PostingSourceText, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}`;
    return callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: posting, auth, schema: "Result", errorFilter
    });
}

export async function deleteRemotePosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function verifyRemotePosting(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${id}/verify`;
    return callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export async function verifyRemotePostingRevision(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string, id: string,
    revisionId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${id}/revisions/${revisionId}/verify`;
    return callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export async function createRemotePostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, reaction: API.ReactionAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions`;
    return callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: reaction, auth, schema: "Result", errorFilter
    });
}

export async function deleteRemotePostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function verifyRemotePostingReaction(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    postingId: string, ownerName: string, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions/${ownerName}/verify`;
    return callApi<API.AsyncOperationCreated>({
        caller, nodeName, method: "POST", location, auth, schema: "AsyncOperationCreated", errorFilter
    });
}

export async function createRemoteSheriffOrder(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string,
    sheriffOrder: API.SheriffOrderAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/sheriff/orders`;
    return callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: sheriffOrder, auth, schema: "Result", errorFilter
    });
}

export async function getRemoteSheriffOrder(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string, id: string,
    errorFilter: ErrorFilter = false
): Promise<API.SheriffOrderInfo> {

    const location = ut`/nodes/${remoteNodeName}/sheriff/orders/${id}`;
    return callApi<API.SheriffOrderInfo>({
        caller, nodeName, method: "GET", location, schema: "SheriffOrderInfo", errorFilter
    });
}

export async function searchNodes(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.SearchNodeFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.SearchNodePageInfo> {

    const location = "/search/nodes";
    return callApi<API.SearchNodePageInfo>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "SearchNodePageInfo",
        errorFilter
    });
}

export async function searchNodeSuggestions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, query: string | null = null,
    sheriff: string | null = null, limit: number | null = null, errorFilter: ErrorFilter = false,
    auth: boolean | string = true
): Promise<API.SearchNodeInfo[]> {

    const location = urlWithParameters(ut`/search/nodes/suggestions`, {query, sheriff, limit});
    return callApi<API.SearchNodeInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SearchNodeInfoArray", errorFilter
    });
}

export async function searchEntriesByHashtag(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.SearchHashtagFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.SearchHashtagSliceInfo> {

    const location = "/search/entries/by-hashtag";
    return callApi<API.SearchHashtagSliceInfo>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "SearchHashtagSliceInfo",
        decodeBodies: true, errorFilter
    });
}

export async function searchEntriesByText(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.SearchTextFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.SearchTextPageInfo> {

    const location = "/search/entries/by-text";
    return callApi<API.SearchTextPageInfo>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "SearchTextPageInfo",
        decodeBodies: true, errorFilter
    });
}

export async function updateSettings(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, settings: API.SettingInfo[],
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = "/settings";
    return callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: settings, auth, schema: "Result", errorFilter
    });
}

export async function getClientSettings(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, prefix: string | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.SettingInfo[]> {

    const location = urlWithParameters(ut`/settings/client`, {prefix});
    return callApi<API.SettingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SettingInfoArray", errorFilter
    });
}

export async function getNodeSettings(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, prefix: string | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.SettingInfo[]> {

    const location = urlWithParameters(ut`/settings/node`, {prefix});
    return callApi<API.SettingInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SettingInfoArray", errorFilter
    });
}

export async function getNodeSettingsMetadata(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, prefix: string | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.SettingMetaInfo[]> {

    const location = urlWithParameters(ut`/settings/node/metadata`, {prefix});
    return callApi<API.SettingMetaInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SettingMetaInfoArray", errorFilter
    });
}

export async function updateNodeSettingsMetadata(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, metadata: API.SettingMetaAttributes[],
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = "/settings/node/metadata";
    return callApi<API.Result>({
        caller, nodeName, method: "PUT", location, body: metadata, auth, schema: "Result", errorFilter
    });
}

export async function getSheriffComplaintGroupsSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, after: number | null = null,
    before: number | null = null, limit: number | null = null, status: API.SheriffComplaintStatus | null = null,
    errorFilter: ErrorFilter = false
): Promise<API.SheriffComplaintGroupsSliceInfo> {

    const location = urlWithParameters(ut`/sheriff/complaints/groups`, {after, before, limit, status});
    return callApi<API.SheriffComplaintGroupsSliceInfo>({
        caller, nodeName, method: "GET", location, schema: "SheriffComplaintGroupsSliceInfo", errorFilter
    });
}

export async function getSheriffComplaintGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false
): Promise<API.SheriffComplaintGroupInfo> {

    const location = ut`/sheriff/complaints/groups/${id}`;
    return callApi<API.SheriffComplaintGroupInfo>({
        caller, nodeName, method: "GET", location, schema: "SheriffComplaintGroupInfo", errorFilter
    });
}

export async function getSheriffComplaintsByGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false
): Promise<API.SheriffComplaintInfo[]> {

    const location = ut`/sheriff/complaints/groups/${id}/complaints`;
    return callApi<API.SheriffComplaintInfo[]>({
        caller, nodeName, method: "GET", location, schema: "SheriffComplaintInfoArray", errorFilter
    });
}

export async function updateSheriffComplaintGroup(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    decision: API.SheriffComplaintDecisionText, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.SheriffComplaintGroupInfo> {

    const location = ut`/sheriff/complaints/groups/${id}`;
    return callApi<API.SheriffComplaintGroupInfo>({
        caller, nodeName, method: "PUT", location, body: decision, auth, schema: "SheriffComplaintGroupInfo",
        errorFilter
    });
}

export async function createSheriffComplaint(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, complaint: API.SheriffComplaintText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.SheriffComplaintInfo> {

    const location = "/sheriff/complaints";
    return callApi<API.SheriffComplaintInfo>({
        caller, nodeName, method: "POST", location, body: complaint, auth, schema: "SheriffComplaintInfo",
        errorFilter
    });
}

export async function createSheriffOrder(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, sheriffOrder: API.SheriffOrderDetails,
    errorFilter: ErrorFilter = false
): Promise<API.Result> {

    const location = "/sheriff/orders";
    return callApi<API.Result>({
        caller, nodeName, method: "POST", location, body: sheriffOrder, schema: "Result", errorFilter
    });
}

export async function getStory(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.StoryInfo> {

    const location = ut`/stories/${id}`;
    return callApi<API.StoryInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "StoryInfo", decodeBodies: true, errorFilter
    });
}

export async function updateStory(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string, story: API.StoryAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.StoryInfo> {

    const location = ut`/stories/${id}`;
    return callApi<API.StoryInfo>({
        caller, nodeName, method: "PUT", location, body: story, auth, schema: "StoryInfo", decodeBodies: true,
        errorFilter
    });
}

export async function deleteStory(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/stories/${id}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function getSubscribers(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string | null = null,
    type: API.SubscriptionType | null = null, feedName: string | null = null, entryId: string | null = null,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.SubscriberInfo[]> {

    const location = urlWithParameters(
        ut`/people/subscribers`,
        {nodeName: remoteNodeName, type, feedName, entryId}
    );
    return callApi<API.SubscriberInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SubscriberInfoArray", errorFilter
    });
}

export async function createSubscriber(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, subscriber: API.SubscriberDescription,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.SubscriberInfo> {

    const location = "/people/subscribers";
    return callApi<API.SubscriberInfo>({
        caller, nodeName, method: "POST", location, body: subscriber, auth, schema: "SubscriberInfo",
        errorFilter
    });
}

export async function getSubscriber(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.SubscriberInfo> {

    const location = ut`/people/subscribers/${id}`;
    return callApi<API.SubscriberInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "SubscriberInfo", errorFilter
    });
}

export async function updateSubscriber(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    subscriber: API.SubscriberOverride, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.SubscriberInfo> {

    const location = ut`/people/subscribers/${id}`;
    return callApi<API.SubscriberInfo>({
        caller, nodeName, method: "PUT", location, body: subscriber, auth, schema: "SubscriberInfo",
        errorFilter
    });
}

export async function deleteSubscriber(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.ContactInfo> {

    const location = ut`/people/subscribers/${id}`;
    return callApi<API.ContactInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "ContactInfo", errorFilter
    });
}

export async function getSubscriptions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, remoteNodeName: string | null = null,
    type: API.SubscriptionType | null = null, errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.SubscriptionInfo[]> {

    const location = urlWithParameters(ut`/people/subscriptions`, {nodeName: remoteNodeName, type});
    return callApi<API.SubscriptionInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "SubscriptionInfoArray", errorFilter
    });
}

export async function createSubscription(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string,
    subscription: API.SubscriptionDescription, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.SubscriptionInfo> {

    const location = "/people/subscriptions";
    return callApi<API.SubscriptionInfo>({
        caller, nodeName, method: "POST", location, body: subscription, auth, schema: "SubscriptionInfo",
        errorFilter
    });
}

export async function updateSubscription(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    subscription: API.SubscriptionOverride, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.SubscriptionInfo> {

    const location = ut`/people/subscriptions/${id}`;
    return callApi<API.SubscriptionInfo>({
        caller, nodeName, method: "PUT", location, body: subscription, auth, schema: "SubscriptionInfo",
        errorFilter
    });
}

export async function deleteSubscription(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.ContactInfo> {

    const location = ut`/people/subscriptions/${id}`;
    return callApi<API.ContactInfo>({
        caller, nodeName, method: "DELETE", location, auth, schema: "ContactInfo", errorFilter
    });
}

export async function searchSubscriptions(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, filter: API.SubscriptionFilter,
    errorFilter: ErrorFilter = false, auth: boolean | string = true
): Promise<API.SubscriptionInfo[]> {

    const location = "/people/subscriptions/search";
    return callApi<API.SubscriptionInfo[]>({
        caller, nodeName, method: "POST", location, body: filter, auth, schema: "SubscriptionInfoArray",
        errorFilter
    });
}

export async function getTokens(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): Promise<API.TokenInfo[]> {

    const location = "/tokens";
    return callApi<API.TokenInfo[]>({
        caller, nodeName, method: "GET", location, auth, schema: "TokenInfoArray", errorFilter
    });
}

export async function createToken(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, token: API.TokenAttributes,
    errorFilter: ErrorFilter = false
): Promise<API.TokenInfo> {

    const location = "/tokens";
    return callApi<API.TokenInfo>({
        caller, nodeName, method: "POST", location, body: token, schema: "TokenInfo", errorFilter
    });
}

export async function getTokenInfo(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.TokenInfo> {

    const location = ut`/tokens/${id}`;
    return callApi<API.TokenInfo>({
        caller, nodeName, method: "GET", location, auth, schema: "TokenInfo", errorFilter
    });
}

export async function updateToken(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string, update: API.TokenUpdate,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.TokenInfo> {

    const location = ut`/tokens/${id}`;
    return callApi<API.TokenInfo>({
        caller, nodeName, method: "PUT", location, body: update, auth, schema: "TokenInfo", errorFilter
    });
}

export async function deleteToken(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, id: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/tokens/${id}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function getUserListGeneral(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    errorFilter: ErrorFilter = false
): Promise<API.UserListInfo> {

    const location = ut`/user-lists/${name}`;
    return callApi<API.UserListInfo>({
        caller, nodeName, method: "GET", location, schema: "UserListInfo", errorFilter
    });
}

export async function getUserListSlice(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    after: number | null = null, before: number | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false
): Promise<API.UserListSliceInfo> {

    const location = urlWithParameters(ut`/user-lists/${name}/items`, {after, before, limit});
    return callApi<API.UserListSliceInfo>({
        caller, nodeName, method: "GET", location, schema: "UserListSliceInfo", errorFilter
    });
}

export async function getUserListItem(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string, remoteNodeName: string,
    errorFilter: ErrorFilter = false
): Promise<API.UserListItemInfo> {

    const location = ut`/user-lists/${name}/items/${remoteNodeName}`;
    return callApi<API.UserListItemInfo>({
        caller, nodeName, method: "GET", location, schema: "UserListItemInfo", errorFilter
    });
}

export async function createUserListItem(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string,
    item: API.UserListItemAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.UserListItemInfo> {

    const location = ut`/user-lists/${name}/items`;
    return callApi<API.UserListItemInfo>({
        caller, nodeName, method: "POST", location, body: item, auth, schema: "UserListItemInfo", errorFilter
    });
}

export async function deleteUserListItem(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, name: string, remoteNodeName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): Promise<API.Result> {

    const location = ut`/user-lists/${name}/items/${remoteNodeName}`;
    return callApi<API.Result>({
        caller, nodeName, method: "DELETE", location, auth, schema: "Result", errorFilter
    });
}

export async function whoAmI(
    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string, errorFilter: ErrorFilter = false
): Promise<API.WhoAmI> {

    const location = "/whoami";
    return callApi<API.WhoAmI>({
        caller, nodeName, method: "GET", location, schema: "WhoAmI", errorFilter
    });
}
