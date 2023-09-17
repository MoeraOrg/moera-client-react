// This file is generated

import * as NodeApiSchema from "api/node/api-schemas"
import { callApi, CallApiResult, decodeBodies, ErrorFilter } from "api/node/call";
import * as API from "api/node/api-types";
import { ProgressHandler } from 'api/fetcher';
import { urlWithParameters, ut } from "util/url";
import { commaSeparatedFlags } from "util/misc";

export function* searchActivityReactions(
    nodeName: string | null, filter: API.ActivityReactionFilter, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.ActivityReactionInfo[]> {

    const location = "/activity/reactions/search";
    return yield* callApi({
        nodeName, method: "GET", location, body: filter, auth, schema: NodeApiSchema.ActivityReactionInfoArray,
        errorFilter
    });
}

export function* getRemotePostingVerificationStatus(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.RemotePostingVerificationInfo> {

    const location = ut`/async-operations/remote-posting-verification/${id}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.RemotePostingVerificationInfo,
        errorFilter
    });
}

export function* getRemoteReactionVerificationStatus(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.RemoteReactionVerificationInfo> {

    const location = ut`/async-operations/remote-reaction-verification/${id}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.RemoteReactionVerificationInfo,
        errorFilter
    });
}

export function* getAvatars(
    nodeName: string | null, errorFilter: ErrorFilter = false
): CallApiResult<API.AvatarInfo[]> {

    const location = "/avatars";
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.AvatarInfoArray, errorFilter
    });
}

export function* createAvatar(
    nodeName: string | null, avatar: API.AvatarAttributes, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.AvatarInfo> {

    const location = "/avatars";
    return yield* callApi({
        nodeName, method: "POST", location, body: avatar, auth, schema: NodeApiSchema.AvatarInfo, errorFilter
    });
}

export function* getAvatar(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false
): CallApiResult<API.AvatarInfo> {

    const location = ut`/avatars/${id}`;
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.AvatarInfo, errorFilter
    });
}

export function* deleteAvatar(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/avatars/${id}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* reorderAvatars(
    nodeName: string | null, order: API.AvatarsOrdered, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AvatarOrdinal[]> {

    const location = "/avatars/reorder";
    return yield* callApi({
        nodeName, method: "POST", location, body: order, auth, schema: NodeApiSchema.AvatarOrdinalArray,
        errorFilter
    });
}

export function* blockInstant(
    nodeName: string | null, instant: API.BlockedInstantAttributes, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.BlockedInstantInfo> {

    const location = "/blocked-instants";
    return yield* callApi({
        nodeName, method: "POST", location, body: instant, auth, schema: NodeApiSchema.BlockedInstantInfo,
        errorFilter
    });
}

export function* getBlockedInstant(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.BlockedInstantInfo> {

    const location = ut`/blocked-instants/${id}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.BlockedInstantInfo, errorFilter
    });
}

export function* unblockInstant(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/blocked-instants/${id}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* searchBlockedInstants(
    nodeName: string | null, filter: API.BlockedInstantFilter, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.BlockedInstantInfo[]> {

    const location = "/blocked-instants/search";
    return yield* callApi({
        nodeName, method: "POST", location, body: filter, auth, schema: NodeApiSchema.BlockedInstantInfoArray,
        errorFilter
    });
}

export function* blockUser(
    nodeName: string | null, user: API.BlockedUserAttributes, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.BlockedUserInfo> {

    const location = "/people/blocked-users";
    return yield* callApi({
        nodeName, method: "POST", location, body: user, auth, schema: NodeApiSchema.BlockedUserInfo,
        errorFilter
    });
}

export function* getBlockedUser(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.BlockedUserInfo> {

    const location = ut`/people/blocked-users/${id}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.BlockedUserInfo, errorFilter
    });
}

export function* unblockUser(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/people/blocked-users/${id}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* searchBlockedUsers(
    nodeName: string | null, filter: API.BlockedUserFilter, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.BlockedUserInfo[]> {

    const location = "/people/blocked-users/search";
    return yield* callApi({
        nodeName, method: "POST", location, body: filter, auth, schema: NodeApiSchema.BlockedUserInfoArray,
        errorFilter
    });
}

export function* getBlockedUsersChecksums(
    nodeName: string | null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.BlockedUsersChecksums> {

    const location = "/people/blocked-users/checksums";
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.BlockedUsersChecksums, errorFilter
    });
}

export function* getBlockedByUser(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.BlockedByUserInfo> {

    const location = ut`/people/blocked-by-users/${id}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.BlockedByUserInfo, errorFilter
    });
}

export function* searchBlockedByUsers(
    nodeName: string | null, filter: API.BlockedByUserFilter, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.BlockedByUserInfo[]> {

    const location = "/people/blocked-by-users/search";
    return yield* callApi({
        nodeName, method: "POST", location, body: filter, auth, schema: NodeApiSchema.BlockedByUserInfoArray,
        errorFilter
    });
}

export function* getCartes(
    nodeName: string | null, limit: number | null = null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.CarteSet> {

    const location = urlWithParameters(ut`/cartes`, {limit});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.CarteSet, errorFilter
    });
}

export function* getCommentsSlice(
    nodeName: string | null, postingId: string, before: number | null = null, after: number | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.CommentsSliceInfo> {

    const location = urlWithParameters(ut`/postings/${postingId}/comments`, {before, after, limit});
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.CommentsSliceInfo, errorFilter
    }));
}

export function* createComment(
    nodeName: string | null, postingId: string, comment: API.CommentText, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.CommentCreated> {

    const location = ut`/postings/${postingId}/comments`;
    return decodeBodies(yield* callApi({
        nodeName, method: "POST", location, body: comment, auth, schema: NodeApiSchema.CommentCreated,
        errorFilter
    }));
}

export function* getComment(
    nodeName: string | null, postingId: string, commentId: string, withSource: boolean = false,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.CommentInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters(ut`/postings/${postingId}/comments/${commentId}`, {include});
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.CommentInfo, errorFilter
    }));
}

export function* updateAllComments(
    nodeName: string | null, postingId: string, attributes: API.CommentMassAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/postings/${postingId}/comments`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: attributes, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* updateComment(
    nodeName: string | null, postingId: string, commentId: string, comment: API.CommentText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.CommentInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}`;
    return decodeBodies(yield* callApi({
        nodeName, method: "PUT", location, body: comment, auth, schema: NodeApiSchema.CommentInfo, errorFilter
    }));
}

export function* deleteComment(
    nodeName: string | null, postingId: string, commentId: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.CommentTotalInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.CommentTotalInfo, errorFilter
    });
}

export function* getPostingsAttachedToComment(
    nodeName: string | null, postingId: string, commentId: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PostingInfo[]> {

    const location = ut`/postings/${postingId}/comments/${commentId}/attached`;
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PostingInfoArray, errorFilter
    }));
}

export function* getCommentRevisions(
    nodeName: string | null, postingId: string, commentId: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.CommentRevisionInfo[]> {

    const location = ut`/postings/${postingId}/comments/${commentId}/revisions`;
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.CommentRevisionInfoArray, errorFilter
    }));
}

export function* getCommentRevision(
    nodeName: string | null, postingId: string, commentId: string, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.CommentRevisionInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/revisions/${id}`;
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.CommentRevisionInfo, errorFilter
    }));
}

export function* createCommentReaction(
    nodeName: string | null, postingId: string, commentId: string, reaction: API.ReactionDescription,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ReactionCreated> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions`;
    return yield* callApi({
        nodeName, method: "POST", location, body: reaction, auth, schema: NodeApiSchema.ReactionCreated,
        errorFilter
    });
}

export function* updateCommentReaction(
    nodeName: string | null, postingId: string, commentId: string, ownerName: string, reaction: API.ReactionOverride,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: reaction, auth, schema: NodeApiSchema.ReactionInfo,
        errorFilter
    });
}

export function* getCommentReactionsSlice(
    nodeName: string | null, postingId: string, commentId: string, negative: boolean | null = null,
    emoji: number | null = null, before: number | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ReactionsSliceInfo> {

    const location = urlWithParameters(
        ut`/postings/${postingId}/comments/${commentId}/reactions`,
        {negative, emoji, before, limit}
    );
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.ReactionsSliceInfo, errorFilter
    });
}

export function* getCommentReaction(
    nodeName: string | null, postingId: string, commentId: string, ownerName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.ReactionInfo, errorFilter
    });
}

export function* deleteAllCommentReactions(
    nodeName: string | null, postingId: string, commentId: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* deleteCommentReaction(
    nodeName: string | null, postingId: string, commentId: string, ownerName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.ReactionTotalsInfo, errorFilter
    });
}

export function* getCommentReactionTotals(
    nodeName: string | null, postingId: string, commentId: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/comments/${commentId}/reaction-totals`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.ReactionTotalsInfo, errorFilter
    });
}

export function* getContacts(
    nodeName: string | null, query: string | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ContactInfo[]> {

    const location = urlWithParameters(ut`/people/contacts`, {query, limit});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.ContactInfoArray, errorFilter
    });
}

export function* checkCredentials(
    nodeName: string | null, errorFilter: ErrorFilter = false
): CallApiResult<API.CredentialsCreated> {

    const location = "/credentials";
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.CredentialsCreated, errorFilter
    });
}

export function* createCredentials(
    nodeName: string | null, credentials: API.Credentials, errorFilter: ErrorFilter = false
): CallApiResult<API.Result> {

    const location = "/credentials";
    return yield* callApi({
        nodeName, method: "POST", location, body: credentials, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* updateCredentials(
    nodeName: string | null, credentials: API.CredentialsChange, errorFilter: ErrorFilter = false
): CallApiResult<API.Result> {

    const location = "/credentials";
    return yield* callApi({
        nodeName, method: "PUT", location, body: credentials, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* deleteCredentials(
    nodeName: string | null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/credentials";
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* resetCredentials(
    nodeName: string | null, errorFilter: ErrorFilter = false
): CallApiResult<API.EmailHint> {

    const location = "/credentials/reset";
    return yield* callApi({
        nodeName, method: "POST", location, schema: NodeApiSchema.EmailHint, errorFilter
    });
}

export function* getDeletedPostings(
    nodeName: string | null, page: number | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingInfo[]> {

    const location = urlWithParameters(ut`/deleted-postings`, {page, limit});
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PostingInfoArray, errorFilter
    }));
}

export function* getDeletedPosting(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingInfo> {

    const location = ut`/deleted-postings/${id}`;
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PostingInfo, errorFilter
    }));
}

export function* restoreDeletedPosting(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingInfo> {

    const location = ut`/deleted-postings/${id}/restore`;
    return decodeBodies(yield* callApi({
        nodeName, method: "POST", location, auth, schema: NodeApiSchema.PostingInfo, errorFilter
    }));
}

export function* getDeletePostingRevisions(
    nodeName: string | null, postingId: string, limit: number | null = null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PostingRevisionInfo[]> {

    const location = urlWithParameters(ut`/deleted-postings/${postingId}/revisions`, {limit});
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PostingRevisionInfoArray, errorFilter
    }));
}

export function* getDeletedPostingRevision(
    nodeName: string | null, postingId: string, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PostingRevisionInfo> {

    const location = ut`/deleted-postings/${postingId}/revisions/${id}`;
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PostingRevisionInfo, errorFilter
    }));
}

export function* restoreDeletedPostingRevision(
    nodeName: string | null, postingId: string, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PostingRevisionInfo> {

    const location = ut`/postings/${postingId}/revisions/${id}/restore`;
    return decodeBodies(yield* callApi({
        nodeName, method: "POST", location, auth, schema: NodeApiSchema.PostingRevisionInfo, errorFilter
    }));
}

export function* getDomains(
    nodeName: string | null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DomainInfo[]> {

    const location = "/domains";
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.DomainInfoArray, errorFilter
    });
}

export function* getDomain(
    nodeName: string | null, name: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DomainInfo> {

    const location = ut`/domains/${name}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.DomainInfo, errorFilter
    });
}

export function* createDomain(
    nodeName: string | null, domain: API.DomainAttributes, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.DomainInfo> {

    const location = "/domains";
    return yield* callApi({
        nodeName, method: "POST", location, body: domain, auth, schema: NodeApiSchema.DomainInfo, errorFilter
    });
}

export function* updateDomain(
    nodeName: string | null, name: string, domain: API.DomainAttributes, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.DomainInfo> {

    const location = ut`/domains/${name}`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: domain, auth, schema: NodeApiSchema.DomainInfo, errorFilter
    });
}

export function* deleteDomain(
    nodeName: string | null, name: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/domains/${name}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* isDomainAvailable(
    nodeName: string | null, remoteNodeName: string, errorFilter: ErrorFilter = false
): CallApiResult<API.DomainAvailable> {

    const location = urlWithParameters(ut`/domains/available`, {nodeName: remoteNodeName});
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.DomainAvailable, errorFilter
    });
}

export function* getDrafts(
    nodeName: string | null, draftType: string, remoteNodeName: string, postingId: string | null = null,
    commentId: string | null = null, page: number | null = null, limit: number | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DraftInfo[]> {

    const location = urlWithParameters(
        ut`/drafts`,
        {draftType, nodeName: remoteNodeName, postingId, commentId, page, limit}
    );
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.DraftInfoArray, errorFilter
    }));
}

export function* createDraft(
    nodeName: string | null, draft: API.DraftText, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DraftInfo> {

    const location = "/drafts";
    return decodeBodies(yield* callApi({
        nodeName, method: "POST", location, body: draft, auth, schema: NodeApiSchema.DraftInfo, errorFilter
    }));
}

export function* getDraft(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DraftInfo> {

    const location = ut`/drafts/${id}`;
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.DraftInfo, errorFilter
    }));
}

export function* updateDraft(
    nodeName: string | null, id: string, draft: API.DraftText, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.DraftInfo> {

    const location = ut`/drafts/${id}`;
    return decodeBodies(yield* callApi({
        nodeName, method: "PUT", location, body: draft, auth, schema: NodeApiSchema.DraftInfo, errorFilter
    }));
}

export function* deleteDraft(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/draft/${id}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* getFeatures(
    nodeName: string | null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Features> {

    const location = "/features";
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.Features, errorFilter
    });
}

export function* getFeeds(
    nodeName: string | null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FeedInfo[]> {

    const location = "/feeds";
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.FeedInfoArray, errorFilter
    });
}

export function* getFeedGeneral(
    nodeName: string | null, feedName: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FeedInfo> {

    const location = ut`/feeds/${feedName}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.FeedInfo, errorFilter
    });
}

export function* getFeedStatus(
    nodeName: string | null, feedName: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FeedStatus> {

    const location = ut`/feeds/${feedName}/status`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.FeedStatus, errorFilter
    });
}

export function* updateFeedStatus(
    nodeName: string | null, feedName: string, change: API.FeedStatusChange, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.FeedStatus> {

    const location = ut`/feeds/${feedName}/status`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: change, auth, schema: NodeApiSchema.FeedStatus, errorFilter
    });
}

export function* getFeedSlice(
    nodeName: string | null, feedName: string, before: number | null = null, after: number | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FeedSliceInfo> {

    const location = urlWithParameters(ut`/feeds/${feedName}/stories`, {before, after, limit});
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.FeedSliceInfo, errorFilter
    }));
}

export function* getFriendGroups(
    nodeName: string | null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FriendGroupInfo[]> {

    const location = "/people/friends/groups";
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.FriendGroupInfoArray, errorFilter
    });
}

export function* getFriendGroup(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FriendGroupInfo> {

    const location = ut`/people/friends/groups/${id}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.FriendGroupInfo, errorFilter
    });
}

export function* createFriendGroup(
    nodeName: string | null, friendGroup: API.FriendGroupDescription, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.FriendGroupInfo> {

    const location = "/people/friends/groups";
    return yield* callApi({
        nodeName, method: "POST", location, body: friendGroup, auth, schema: NodeApiSchema.FriendGroupInfo,
        errorFilter
    });
}

export function* updateFriendGroup(
    nodeName: string | null, id: string, friendGroup: API.FriendGroupDescription, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.FriendGroupInfo> {

    const location = ut`/people/friends/groups/${id}`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: friendGroup, auth, schema: NodeApiSchema.FriendGroupInfo,
        errorFilter
    });
}

export function* deleteFriendGroup(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/people/friends/groups/${id}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* getFriends(
    nodeName: string | null, groupId: string | null = null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.FriendInfo[]> {

    const location = urlWithParameters(ut`/people/friends`, {groupId});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.FriendInfoArray, errorFilter
    });
}

export function* getFriend(
    nodeName: string | null, name: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FriendInfo> {

    const location = ut`/people/friends/${name}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.FriendInfo, errorFilter
    });
}

export function* updateFriends(
    nodeName: string | null, friends: API.FriendDescription[], errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.FriendInfo[]> {

    const location = "/people/friends";
    return yield* callApi({
        nodeName, method: "PUT", location, body: friends, auth, schema: NodeApiSchema.FriendInfoArray,
        errorFilter
    });
}

export function* getFriendOfs(
    nodeName: string | null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FriendOfInfo[]> {

    const location = "/people/friend-ofs";
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.FriendOfInfoArray, errorFilter
    });
}

export function* getFriendOf(
    nodeName: string | null, name: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FriendOfInfo> {

    const location = ut`/people/friend-ofs/${name}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.FriendOfInfo, errorFilter
    });
}

export function* uploadPrivateMedia(
    nodeName: string | null, file: File, onProgress?: ProgressHandler, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PrivateMediaFileInfo> {

    const location = "/media/private";
    return yield* callApi({
        nodeName, method: "POST", location, body: file, onProgress, auth,
        schema: NodeApiSchema.PrivateMediaFileInfo, errorFilter
    });
}

export function* getPrivateMedia(
    nodeName: string | null, id: string, width: number | null = null, download: boolean | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<Blob> {

    const location = urlWithParameters(ut`/media/private/${id}/data`, {width, download});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: "blob", errorFilter
    });
}

export function* getPrivateMediaInfo(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PrivateMediaFileInfo> {

    const location = ut`/media/private/${id}/info`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PrivateMediaFileInfo, errorFilter
    });
}

export function* getPrivateMediaParentEntry(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.EntryInfo[]> {

    const location = ut`/media/private/${id}/parent`;
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.EntryInfoArray, errorFilter
    }));
}

export function* uploadPublicMedia(
    nodeName: string | null, file: File, onProgress?: ProgressHandler, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PublicMediaFileInfo> {

    const location = "/media/public";
    return yield* callApi({
        nodeName, method: "POST", location, body: file, onProgress, auth,
        schema: NodeApiSchema.PublicMediaFileInfo, errorFilter
    });
}

export function* getPublicMedia(
    nodeName: string | null, id: string, width: number | null = null, download: boolean | null = null,
    errorFilter: ErrorFilter = false
): CallApiResult<Blob> {

    const location = urlWithParameters(ut`/media/public/${id}/data`, {width, download});
    return yield* callApi({
        nodeName, method: "GET", location, schema: "blob", errorFilter
    });
}

export function* getPublicMediaInfo(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false
): CallApiResult<API.PublicMediaFileInfo> {

    const location = ut`/media/public/${id}/info`;
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.PublicMediaFileInfo, errorFilter
    });
}

export function* getNodeName(
    nodeName: string | null, errorFilter: ErrorFilter = false
): CallApiResult<API.NodeNameInfo> {

    const location = "/node-name";
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.NodeNameInfo, errorFilter
    });
}

export function* createNodeName(
    nodeName: string | null, nameToRegister: API.NameToRegister, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.RegisteredNameSecret> {

    const location = "/node-name";
    return yield* callApi({
        nodeName, method: "POST", location, body: nameToRegister, auth,
        schema: NodeApiSchema.RegisteredNameSecret, errorFilter
    });
}

export function* updateNodeName(
    nodeName: string | null, secret: API.RegisteredNameSecret, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/node-name";
    return yield* callApi({
        nodeName, method: "PUT", location, body: secret, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* deleteNodeName(
    nodeName: string | null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/node-name";
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* sendNotification(
    nodeName: string | null, packet: API.NotificationPacket, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/notifications";
    return yield* callApi({
        nodeName, method: "POST", location, body: packet, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* getPeopleGeneral(
    nodeName: string | null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PeopleGeneralInfo> {

    const location = "/people";
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PeopleGeneralInfo, errorFilter
    });
}

export function* registerPlugin(
    nodeName: string | null, plugin: API.PluginDescription, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PluginInfo> {

    const location = "/plugins";
    return yield* callApi({
        nodeName, method: "POST", location, body: plugin, auth, schema: NodeApiSchema.PluginInfo, errorFilter
    });
}

export function* getPlugins(
    nodeName: string | null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PluginInfo[]> {

    const location = "/plugins";
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PluginInfoArray, errorFilter
    });
}

export function* getPlugin(
    nodeName: string | null, pluginName: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PluginInfo> {

    const location = ut`/plugins/${pluginName}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PluginInfo, errorFilter
    });
}

export function* unregisterPlugin(
    nodeName: string | null, pluginName: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/plugins/${pluginName}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* createPosting(
    nodeName: string | null, posting: API.PostingText, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingInfo> {

    const location = "/postings";
    return decodeBodies(yield* callApi({
        nodeName, method: "POST", location, body: posting, auth, schema: NodeApiSchema.PostingInfo, errorFilter
    }));
}

export function* updatePosting(
    nodeName: string | null, id: string, posting: API.PostingText, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PostingInfo> {

    const location = ut`/postings/${id}`;
    return decodeBodies(yield* callApi({
        nodeName, method: "PUT", location, body: posting, auth, schema: NodeApiSchema.PostingInfo, errorFilter
    }));
}

export function* getPosting(
    nodeName: string | null, id: string, withSource: boolean = false, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PostingInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters(ut`/postings/${id}`, {include});
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PostingInfo, errorFilter
    }));
}

export function* deletePosting(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/postings/${id}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* getPostingsAttachedToPosting(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PostingInfo[]> {

    const location = ut`/postings/${id}/attached`;
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PostingInfoArray, errorFilter
    }));
}

export function* getPostingRevisions(
    nodeName: string | null, postingId: string, limit: number | null = null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PostingRevisionInfo[]> {

    const location = urlWithParameters(ut`/postings/${postingId}/revisions`, {limit});
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PostingRevisionInfoArray, errorFilter
    }));
}

export function* getPostingRevision(
    nodeName: string | null, postingId: string, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PostingRevisionInfo> {

    const location = ut`/postings/${postingId}/revisions/${id}`;
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PostingRevisionInfo, errorFilter
    }));
}

export function* restorePostingRevision(
    nodeName: string | null, postingId: string, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.PostingRevisionInfo> {

    const location = ut`/postings/${postingId}/revisions/${id}/restore`;
    return decodeBodies(yield* callApi({
        nodeName, method: "POST", location, auth, schema: NodeApiSchema.PostingRevisionInfo, errorFilter
    }));
}

export function* createPostingReaction(
    nodeName: string | null, postingId: string, reaction: API.ReactionDescription, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.ReactionCreated> {

    const location = ut`/postings/${postingId}/reactions`;
    return yield* callApi({
        nodeName, method: "POST", location, body: reaction, auth, schema: NodeApiSchema.ReactionCreated,
        errorFilter
    });
}

export function* getPostingReactionsSlice(
    nodeName: string | null, postingId: string, negative: boolean | null = null, emoji: number | null = null,
    before: number | null = null, limit: number | null = null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.ReactionsSliceInfo> {

    const location = urlWithParameters(
        ut`/postings/${postingId}/reactions`,
        {negative, emoji, before, limit}
    );
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.ReactionsSliceInfo, errorFilter
    });
}

export function* updatePostingReaction(
    nodeName: string | null, postingId: string, ownerName: string, reaction: API.ReactionOverride,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/reactions/${ownerName}`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: reaction, auth, schema: NodeApiSchema.ReactionInfo,
        errorFilter
    });
}

export function* getPostingReaction(
    nodeName: string | null, postingId: string, ownerName: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.ReactionInfo> {

    const location = ut`/postings/${postingId}/reactions/${ownerName}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.ReactionInfo, errorFilter
    });
}

export function* deleteAllPostingReactions(
    nodeName: string | null, postingId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/postings/${postingId}/reactions`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* deletePostingReaction(
    nodeName: string | null, postingId: string, ownerName: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/reactions/${ownerName}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.ReactionTotalsInfo, errorFilter
    });
}

export function* searchPostingReactions(
    nodeName: string | null, filter: API.ReactionsFilter, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.ReactionInfo[]> {

    const location = "/postings/reactions/search";
    return yield* callApi({
        nodeName, method: "POST", location, body: filter, auth, schema: NodeApiSchema.ReactionInfoArray,
        errorFilter
    });
}

export function* getPostingReactionTotals(
    nodeName: string | null, postingId: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ReactionTotalsInfo> {

    const location = ut`/postings/${postingId}/reaction-totals`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.ReactionTotalsInfo, errorFilter
    });
}

export function* searchPostingReactionTotals(
    nodeName: string | null, filter: API.ReactionTotalsFilter, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.ReactionTotalsInfo[]> {

    const location = "/postings/reaction-totals/search";
    return yield* callApi({
        nodeName, method: "POST", location, body: filter, auth, schema: NodeApiSchema.ReactionTotalsInfoArray,
        errorFilter
    });
}

export function* getProfile(
    nodeName: string | null, withSource: boolean = false, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.ProfileInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters(ut`/profile`, {include});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.ProfileInfo, errorFilter
    });
}

export function* updateProfile(
    nodeName: string | null, profile: API.ProfileAttributes, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.ProfileInfo> {

    const location = "/profile";
    return yield* callApi({
        nodeName, method: "PUT", location, body: profile, auth, schema: NodeApiSchema.ProfileInfo, errorFilter
    });
}

export function* proxyMedia(
    nodeName: string | null, url: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<Blob> {

    const location = urlWithParameters(ut`/proxy/media`, {url});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: "blob", errorFilter
    });
}

export function* proxyLinkPreview(
    nodeName: string | null, url: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.LinkPreviewInfo> {

    const location = urlWithParameters(ut`/proxy/link-preview`, {url});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.LinkPreviewInfo, errorFilter
    });
}

export function* askRemoteNode(
    nodeName: string | null, remoteNodeName: string, details: API.AskDescription, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/ask`;
    return yield* callApi({
        nodeName, method: "POST", location, body: details, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* createRemoteComment(
    nodeName: string | null, remoteNodeName: string, postingId: string, comment: API.CommentSourceText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments`;
    return yield* callApi({
        nodeName, method: "POST", location, body: comment, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* updateRemoteComment(
    nodeName: string | null, remoteNodeName: string, postingId: string, commentId: string,
    comment: API.CommentSourceText, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: comment, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* deleteRemoteComment(
    nodeName: string | null, remoteNodeName: string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* verifyRemoteComment(
    nodeName: string | null, remoteNodeName: string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/verify`;
    return yield* callApi({
        nodeName, method: "POST", location, auth, schema: NodeApiSchema.AsyncOperationCreated, errorFilter
    });
}

export function* createRemoteCommentReaction(
    nodeName: string | null, remoteNodeName: string, postingId: string, commentId: string,
    reaction: API.ReactionAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions`;
    return yield* callApi({
        nodeName, method: "POST", location, body: reaction, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* deleteRemoteCommentReaction(
    nodeName: string | null, remoteNodeName: string, postingId: string, commentId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* verifyRemoteCommentReaction(
    nodeName: string | null, remoteNodeName: string, postingId: string, commentId: string, ownerName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions/${ownerName}/verify`;
    return yield* callApi({
        nodeName, method: "POST", location, auth, schema: NodeApiSchema.AsyncOperationCreated, errorFilter
    });
}

export function* createRemotePosting(
    nodeName: string | null, remoteNodeName: string, posting: API.PostingSourceText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings`;
    return yield* callApi({
        nodeName, method: "POST", location, body: posting, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* updateRemotePosting(
    nodeName: string | null, remoteNodeName: string, postingId: string, posting: API.PostingSourceText,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: posting, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* deleteRemotePosting(
    nodeName: string | null, remoteNodeName: string, postingId: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* verifyRemotePosting(
    nodeName: string | null, remoteNodeName: string, id: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${id}/verify`;
    return yield* callApi({
        nodeName, method: "POST", location, auth, schema: NodeApiSchema.AsyncOperationCreated, errorFilter
    });
}

export function* verifyRemotePostingRevision(
    nodeName: string | null, remoteNodeName: string, id: string, revisionId: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${id}/revisions/${revisionId}/verify`;
    return yield* callApi({
        nodeName, method: "POST", location, auth, schema: NodeApiSchema.AsyncOperationCreated, errorFilter
    });
}

export function* createRemotePostingReaction(
    nodeName: string | null, remoteNodeName: string, postingId: string, reaction: API.ReactionAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions`;
    return yield* callApi({
        nodeName, method: "POST", location, body: reaction, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* deleteRemotePostingReaction(
    nodeName: string | null, remoteNodeName: string, postingId: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* verifyRemotePostingReaction(
    nodeName: string | null, remoteNodeName: string, postingId: string, ownerName: string,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.AsyncOperationCreated> {

    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions/${ownerName}/verify`;
    return yield* callApi({
        nodeName, method: "POST", location, auth, schema: NodeApiSchema.AsyncOperationCreated, errorFilter
    });
}

export function* createRemoteSheriffOrder(
    nodeName: string | null, remoteNodeName: string, sheriffOrder: API.SheriffOrderAttributes,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/nodes/${remoteNodeName}/sheriff/orders`;
    return yield* callApi({
        nodeName, method: "POST", location, body: sheriffOrder, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* getRemoteSheriffOrder(
    nodeName: string | null, remoteNodeName: string, id: string, errorFilter: ErrorFilter = false
): CallApiResult<API.SheriffOrderInfo> {

    const location = ut`/nodes/${remoteNodeName}/sheriff/orders/${id}`;
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.SheriffOrderInfo, errorFilter
    });
}

export function* updateSettings(
    nodeName: string | null, settings: API.SettingInfo[], errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/settings";
    return yield* callApi({
        nodeName, method: "PUT", location, body: settings, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* getClientSettings(
    nodeName: string | null, prefix: string | null = null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.SettingInfo[]> {

    const location = urlWithParameters(ut`/settings/client`, {prefix});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.SettingInfoArray, errorFilter
    });
}

export function* getNodeSettings(
    nodeName: string | null, prefix: string | null = null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.SettingInfo[]> {

    const location = urlWithParameters(ut`/settings/node`, {prefix});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.SettingInfoArray, errorFilter
    });
}

export function* getNodeSettingsMetadata(
    nodeName: string | null, prefix: string | null = null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.SettingMetaInfo[]> {

    const location = urlWithParameters(ut`/settings/node/metadata`, {prefix});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.SettingMetaInfoArray, errorFilter
    });
}

export function* updateNodeSettingsMetadata(
    nodeName: string | null, metadata: API.SettingMetaAttributes[], errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/settings/node/metadata";
    return yield* callApi({
        nodeName, method: "PUT", location, body: metadata, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* getSheriffComplaintGroupsSlice(
    nodeName: string | null, before: number | null = null, after: number | null = null, limit: number | null = null,
    status: string | null = null, errorFilter: ErrorFilter = false
): CallApiResult<API.SheriffComplainGroupsSliceInfo> {

    const location = urlWithParameters(ut`/sheriff/complains/groups`, {before, after, limit, status});
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.SheriffComplainGroupsSliceInfo, errorFilter
    });
}

export function* getSheriffComplaintGroup(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false
): CallApiResult<API.SheriffComplainGroupInfo> {

    const location = ut`/sheriff/complains/groups/${id}`;
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.SheriffComplainGroupInfo, errorFilter
    });
}

export function* getSheriffComplaintsByGroup(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false
): CallApiResult<API.SheriffComplainInfo[]> {

    const location = ut`/sheriff/complains/groups/${id}/complains`;
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.SheriffComplainInfoArray, errorFilter
    });
}

export function* updateSheriffComplaintGroup(
    nodeName: string | null, id: string, decision: API.SheriffComplainDecisionText, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.SheriffComplainGroupInfo> {

    const location = ut`/sheriff/complains/groups/${id}`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: decision, auth, schema: NodeApiSchema.SheriffComplainGroupInfo,
        errorFilter
    });
}

export function* createSheriffComplaint(
    nodeName: string | null, complaint: API.SheriffComplainText, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.SheriffComplainInfo> {

    const location = "/sheriff/complains";
    return yield* callApi({
        nodeName, method: "POST", location, body: complaint, auth, schema: NodeApiSchema.SheriffComplainInfo,
        errorFilter
    });
}

export function* createSheriffOrder(
    nodeName: string | null, sheriffOrder: API.SheriffOrderDetails, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/sheriff/orders";
    return yield* callApi({
        nodeName, method: "POST", location, body: sheriffOrder, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* getStory(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.StoryInfo> {

    const location = ut`/stories/${id}`;
    return decodeBodies(yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.StoryInfo, errorFilter
    }));
}

export function* updateStory(
    nodeName: string | null, id: string, story: API.StoryAttributes, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.StoryInfo> {

    const location = ut`/stories/${id}`;
    return decodeBodies(yield* callApi({
        nodeName, method: "PUT", location, body: story, auth, schema: NodeApiSchema.StoryInfo, errorFilter
    }));
}

export function* getSubscribers(
    nodeName: string | null, remoteNodeName: string | null = null, type: string | null = null,
    feedName: string | null = null, entryId: string | null = null, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.SubscriberInfo[]> {

    const location = urlWithParameters(
        ut`/people/subscribers`,
        {nodeName: remoteNodeName, type, feedName, entryId}
    );
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.SubscriberInfoArray, errorFilter
    });
}

export function* createSubscriber(
    nodeName: string | null, subscriber: API.SubscriberDescription, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.SubscriberInfo> {

    const location = "/people/subscribers";
    return yield* callApi({
        nodeName, method: "POST", location, body: subscriber, auth, schema: NodeApiSchema.SubscriberInfo,
        errorFilter
    });
}

export function* getSubscriber(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SubscriberInfo> {

    const location = ut`/people/subscribers/${id}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.SubscriberInfo, errorFilter
    });
}

export function* updateSubscriber(
    nodeName: string | null, id: string, subscriber: API.SubscriberOverride, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.SubscriberInfo> {

    const location = ut`/people/subscribers/${id}`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: subscriber, auth, schema: NodeApiSchema.SubscriberInfo,
        errorFilter
    });
}

export function* deleteSubscriber(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ContactInfo> {

    const location = ut`/people/subscribers/${id}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.ContactInfo, errorFilter
    });
}

export function* getSubscriptions(
    nodeName: string | null, remoteNodeName: string | null = null, type: string | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SubscriptionInfo[]> {

    const location = urlWithParameters(ut`/people/subscriptions`, {nodeName: remoteNodeName, type});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.SubscriptionInfoArray, errorFilter
    });
}

export function* createSubscription(
    nodeName: string | null, subscription: API.SubscriptionDescription, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.SubscriptionInfo> {

    const location = "/people/subscriptions";
    return yield* callApi({
        nodeName, method: "POST", location, body: subscription, auth, schema: NodeApiSchema.SubscriptionInfo,
        errorFilter
    });
}

export function* updateSubscription(
    nodeName: string | null, id: string, subscription: API.SubscriptionOverride, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.SubscriptionInfo> {

    const location = ut`/people/subscriptions/${id}`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: subscription, auth, schema: NodeApiSchema.SubscriptionInfo,
        errorFilter
    });
}

export function* deleteSubscription(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ContactInfo> {

    const location = ut`/people/subscriptions/${id}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.ContactInfo, errorFilter
    });
}

export function* searchSubscriptions(
    nodeName: string | null, filter: API.SubscriptionFilter, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.SubscriptionInfo[]> {

    const location = "/people/subscriptions/search";
    return yield* callApi({
        nodeName, method: "GET", location, body: filter, auth, schema: NodeApiSchema.SubscriptionInfoArray,
        errorFilter
    });
}

export function* getTokens(
    nodeName: string | null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.TokenInfo[]> {

    const location = "/tokens";
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.TokenInfoArray, errorFilter
    });
}

export function* createToken(
    nodeName: string | null, token: API.TokenAttributes, errorFilter: ErrorFilter = false
): CallApiResult<API.TokenInfo> {

    const location = "/tokens";
    return yield* callApi({
        nodeName, method: "POST", location, body: token, schema: NodeApiSchema.TokenInfo, errorFilter
    });
}

export function* getTokenInfo(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.TokenInfo> {

    const location = ut`/tokens/${id}`;
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.TokenInfo, errorFilter
    });
}

export function* updateToken(
    nodeName: string | null, id: string, token: API.TokenName, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.TokenInfo> {

    const location = ut`/tokens/${id}`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: token, auth, schema: NodeApiSchema.TokenInfo, errorFilter
    });
}

export function* deleteToken(
    nodeName: string | null, id: string, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/tokens/${id}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* getUserListGeneral(
    nodeName: string | null, name: string, errorFilter: ErrorFilter = false
): CallApiResult<API.UserListInfo> {

    const location = ut`/user-lists/${name}`;
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.UserListInfo, errorFilter
    });
}

export function* getUserListSlice(
    nodeName: string | null, name: string, before: number | null = null, after: number | null = null,
    limit: number | null = null, errorFilter: ErrorFilter = false
): CallApiResult<API.UserListSliceInfo> {

    const location = urlWithParameters(ut`/user-lists/${name}/items`, {before, after, limit});
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.UserListSliceInfo, errorFilter
    });
}

export function* getUserListItem(
    nodeName: string | null, name: string, remoteNodeName: string, errorFilter: ErrorFilter = false
): CallApiResult<API.UserListItemInfo> {

    const location = ut`/user-lists/${name}/items/${remoteNodeName}`;
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.UserListItemInfo, errorFilter
    });
}

export function* createUserListItem(
    nodeName: string | null, name: string, item: API.UserListItemAttributes, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.UserListItemInfo> {

    const location = ut`/user-lists/${name}/items`;
    return yield* callApi({
        nodeName, method: "POST", location, body: item, auth, schema: NodeApiSchema.UserListItemInfo,
        errorFilter
    });
}

export function* deleteUserListItem(
    nodeName: string | null, name: string, remoteNodeName: string, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.Result> {

    const location = ut`/user-lists/${name}/items/${remoteNodeName}`;
    return yield* callApi({
        nodeName, method: "DELETE", location, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* whoAmI(
    nodeName: string | null, errorFilter: ErrorFilter = false
): CallApiResult<API.WhoAmI> {

    const location = "/whoami";
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.WhoAmI, errorFilter
    });
}
