import { select } from 'typed-redux-saga';

import { ClientSettings, NodeApi } from "api";
import { callApi, CallApiResult, decodeBodies } from "api/node/call";
import {
    ActivityReactionInfo,
    AskSubject,
    AsyncOperationCreated,
    AvatarAttributes,
    AvatarInfo,
    AvatarOrdinal,
    BlockedByUserFilter,
    BlockedByUserInfo,
    BlockedInstantAttributes,
    BlockedInstantInfo,
    BlockedUserAttributes,
    BlockedUserFilter,
    BlockedUserInfo,
    BlockedUsersChecksums,
    CommentCreated,
    CommentInfo,
    CommentMassAttributes,
    CommentSourceText,
    CommentsSliceInfo,
    CommentText,
    CommentTotalInfo,
    ContactInfo,
    DomainAvailable,
    DomainInfo,
    DraftInfo,
    DraftText,
    EmailHint,
    Features,
    FeedInfo,
    FeedSliceInfo,
    FeedStatus,
    FriendDescription,
    FriendGroupInfo,
    FriendInfo,
    FriendOfInfo,
    LinkPreviewInfo,
    NodeNameInfo,
    PeopleGeneralInfo,
    PluginInfo,
    PostingInfo,
    PostingSourceText,
    PostingText,
    PrivateMediaFileInfo,
    ProfileAttributes,
    ProfileInfo,
    PublicMediaFileInfo,
    ReactionCreated,
    ReactionDescription,
    ReactionInfo,
    ReactionsSliceInfo,
    ReactionTotalsInfo,
    RegisteredNameSecret,
    RemoteFeed,
    RemotePosting,
    Result,
    SettingInfo,
    SettingMetaInfo,
    SheriffComplainDecisionText,
    SheriffComplainGroupInfo,
    SheriffComplainGroupsSliceInfo,
    SheriffComplainInfo,
    SheriffComplainStatus,
    SheriffComplainText,
    SheriffOrderAttributes,
    SheriffOrderInfo,
    StoryAttributes,
    StoryInfo,
    SubscriberInfo,
    SubscriberOperations,
    SubscriptionInfo,
    SubscriptionOperations,
    SubscriptionType,
    TokenInfo, UserListItemInfo,
    WhoAmI
} from "api/node/api-types";
import { ProgressHandler } from 'api/fetcher';
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { urlWithParameters, ut } from "util/url";
import { toAvatarDescription } from "util/avatar";

export function* createDomain(nodeName: string | null, name: string): CallApiResult<DomainInfo> {
    return yield* callApi({
        nodeName, location: "/domains", method: "POST", body: {name}, schema: NodeApi.DomainInfo,
        errorFilter: ["domain.already-exists", "domainInfo.name.blank", "domainInfo.name.wrong-hostname"]
    });
}

export function* getDomain(nodeName: string | null, name: string): CallApiResult<DomainInfo> {
    return yield* callApi({
        nodeName, location: ut`/domains/${name}`, schema: NodeApi.DomainInfo, errorFilter: ["domain.not-found"]
    });
}

export function* getDomainAvailable(nodeName: string | null, name: string): CallApiResult<DomainAvailable> {
    return yield* callApi({
        nodeName, location: ut`/domains/available?nodeName=${name}`, schema: NodeApi.DomainAvailable
    });
}

export function* createCredentials(nodeName: string | null, login: string, password: string) {
    yield* callApi({
        nodeName, location: "/credentials", method: "POST", body: {login, password}, schema: NodeApi.Result,
        errorFilter: ["credentials.already-created"]
    });
}

export function* putCredentials(nodeName: string | null, token: string | null, oldPassword: string | null,
                                login: string, password: string) {
    yield* callApi({
        nodeName, location: "/credentials", method: "PUT", body: {token, oldPassword, login, password},
        schema: NodeApi.Result,
        errorFilter: ["credentials.wrong-reset-token", "credentials.reset-token-expired", "credentials.login-incorrect"]
    });
}

export function* postCredentialsReset(nodeName: string | null): CallApiResult<EmailHint> {
    return yield* callApi({
        nodeName, location: "/credentials/reset", method: "POST", schema: NodeApi.EmailHint,
        errorFilter: ["credentials.email-not-set"]
    });
}

export function* createToken(nodeName: string | null, login: string, password: string,
                             name: string | null): CallApiResult<TokenInfo> {
    return yield* callApi({
        nodeName, location: "/tokens", method: "POST", body: {login, password, name}, schema: NodeApi.TokenInfo,
        errorFilter: ["credentials.login-incorrect", "credentials.not-created"]
    });
}

export function* putToken(nodeName: string | null, id: string, name: string | null): CallApiResult<TokenInfo> {
    return yield* callApi({
        nodeName, location: ut`/tokens/${id}`, method: "PUT", body: {name}, auth: true, schema: NodeApi.TokenInfo
    });
}

export function* deleteToken(nodeName: string | null, id: string): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/tokens/${id}`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* getTokens(nodeName: string | null): CallApiResult<TokenInfo[]> {
    return yield* callApi({nodeName, location: "/tokens", auth: true, schema: NodeApi.TokenInfoArray});
}

export function* getWhoAmI(nodeName: string | null): CallApiResult<WhoAmI> {
    return yield* callApi({nodeName, location: "/whoami", schema: NodeApi.WhoAmI});
}

export function* getNodeSettings(nodeName: string | null): CallApiResult<SettingInfo[]> {
    return yield* callApi({
        nodeName, location: "/settings/node", auth: true, schema: NodeApi.SettingInfoArray
    });
}

export function* getNodeSettingsMetadata(nodeName: string | null): CallApiResult<SettingMetaInfo[]> {
    return yield* callApi({
        nodeName, location: "/settings/node/metadata", auth: true, schema: NodeApi.SettingMetaInfoArray
    });
}

export function* getClientSettings(nodeName: string | null): CallApiResult<SettingInfo[]> {
    const location = urlWithParameters("/settings/client", {prefix: ClientSettings.PREFIX});
    return yield* callApi({nodeName, location, auth: true, schema: NodeApi.SettingInfoArray});
}

export function* putSettings(nodeName: string | null, settings: SettingInfo[]): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: "/settings", method: "PUT", auth: true, body: settings, schema: NodeApi.Result
    });
}

export function* getProfile(nodeName: string | null, withSource: boolean = false): CallApiResult<ProfileInfo> {
    const include = withSource ? "source" : null;
    const location = urlWithParameters("/profile", {include});
    return yield* callApi({nodeName, location, auth: true, schema: NodeApi.ProfileInfo});
}

export function* putProfile(nodeName: string | null, profile: ProfileAttributes): CallApiResult<ProfileInfo> {
    return yield* callApi({
        nodeName, location: "/profile", method: "PUT", auth: true, body: profile, schema: NodeApi.ProfileInfo
    });
}

export function* getNodeName(nodeName: string | null): CallApiResult<NodeNameInfo> {
    return yield* callApi({nodeName, location: "/node-name", auth: true, schema: NodeApi.NodeNameInfo});
}

export function* registerName(nodeName: string | null, name: string): CallApiResult<RegisteredNameSecret> {
    return yield* callApi({
        nodeName, location: "/node-name", method: "POST", auth: true, body: {name}, schema: NodeApi.RegisteredNameSecret
    });
}

export function* updateNodeName(nodeName: string | null, name: string | null,
                                mnemonic: string[]): CallApiResult<Result> {
    const body = name ? {name, mnemonic} : {mnemonic};
    return yield* callApi({
        nodeName, location: "/node-name", method: "PUT", auth: true, body, schema: NodeApi.Result
    });
}

export function* getFeedGeneral(nodeName: string | null, feedName: string): CallApiResult<FeedInfo> {
    return yield* callApi({nodeName, location: ut`/feeds/${feedName}`, auth: true, schema: NodeApi.FeedInfo});
}

export function* getFeedSlice(nodeName: string | null, feedName: string, after: number | null, before: number | null,
                              limit: number | null): CallApiResult<FeedSliceInfo> {
    const location = urlWithParameters(ut`/feeds/${feedName}/stories`, {after, before, limit});
    return decodeBodies(yield* callApi({nodeName, location, auth: true, schema: NodeApi.FeedSliceInfo}));
}

export function* getFeedStatus(nodeName: string | null, feedName: string): CallApiResult<FeedStatus> {
    return yield* callApi({
        nodeName, location: ut`/feeds/${feedName}/status`, auth: true, schema: NodeApi.FeedStatus
    });
}

export function* putFeedStatus(nodeName: string | null, feedName: string, viewed: boolean | null, read: boolean | null,
                               before: number): CallApiResult<FeedStatus> {
    return yield* callApi({
        nodeName, location: ut`/feeds/${feedName}/status`, method: "PUT", auth: true, body: {viewed, read, before},
        schema: NodeApi.FeedStatus
    });
}

export function* putStory(nodeName: string | null, id: string,
                          storyAttributes: StoryAttributes): CallApiResult<StoryInfo> {
    return decodeBodies(yield* callApi({
        nodeName, location: ut`/stories/${id}`, method: "PUT", auth: true, body: storyAttributes,
        schema: NodeApi.StoryInfo
    }));
}

export function* getPeopleGeneral(nodeName: string | null): CallApiResult<PeopleGeneralInfo> {
    return yield* callApi({nodeName, location: "/people", auth: true, schema: NodeApi.PeopleGeneralInfo});
}

export function* getSubscribers(nodeName: string | null, type: SubscriptionType,
                                remoteNodeName: string | null = null): CallApiResult<SubscriberInfo[]> {
    const location = urlWithParameters("/people/subscribers", {type, nodeName: remoteNodeName});
    return yield* callApi({
        nodeName, location, auth: true, schema: NodeApi.SubscriberInfoArray, errorFilter: ["authentication.required"]
    });
}

export function* putSubscriber(nodeName: string | null, subscriberId: string,
                               operations: SubscriberOperations | null,
                               adminOperations: SubscriberOperations | null): CallApiResult<SubscriberInfo> {
    return yield* callApi({
        nodeName, location: ut`/people/subscribers/${subscriberId}`, method: "PUT", auth: true,
        body: {operations, adminOperations}, schema: NodeApi.SubscriberInfo
    });
}

export function* getSubscriptions(nodeName: string | null, type: SubscriptionType,
                                  remoteNodeName: string | null = null): CallApiResult<SubscriptionInfo[]> {
    const location = urlWithParameters("/people/subscriptions", {type, nodeName: remoteNodeName});
    return yield* callApi({
        nodeName, location, auth: true, schema: NodeApi.SubscriptionInfoArray, errorFilter: ["authentication.required"]
    });
}

export function* postFeedSubscription(nodeName: string | null, remoteNodeName: string,
                                      remoteFeedName: string): CallApiResult<SubscriptionInfo> {
    return yield* callApi({
        nodeName, location: "/people/subscriptions", method: "POST", auth: true,
        body: {type: "feed", feedName: "news", remoteNodeName, remoteFeedName},
        schema: NodeApi.SubscriptionInfo
    });
}

export function* postPostingCommentsSubscription(nodeName: string | null, remoteNodeName: string,
                                                 remotePostingId: string): CallApiResult<SubscriptionInfo> {
    return yield* callApi({
        nodeName, location: "/people/subscriptions", method: "POST", auth: true,
        body: {type: "posting-comments", remoteNodeName, remotePostingId},
        schema: NodeApi.SubscriptionInfo
    });
}

export function* putSubscription(nodeName: string | null, id: string,
                                 operations: SubscriptionOperations): CallApiResult<SubscriptionInfo> {
    return yield* callApi({
        nodeName, location: ut`/people/subscriptions/${id}`, method: "PUT", auth: true, body: {operations},
        schema: NodeApi.SubscriptionInfo
    });
}

export function* deleteSubscription(nodeName: string | null, id: string): CallApiResult<ContactInfo> {
    return yield* callApi({
        nodeName, location: ut`/people/subscriptions/${id}`, method: "DELETE", auth: true, schema: NodeApi.ContactInfo
    });
}

export function* searchSubscriptions(nodeName: string | null, type: string | null,
                                     remoteFeeds: RemoteFeed[] | null,
                                     remotePostings: RemotePosting[] | null): CallApiResult<SubscriptionInfo[]> {
    return yield* callApi({
        nodeName, location: "/people/subscriptions/search", method: "POST", auth: true,
        body: {type, feeds: remoteFeeds, postings: remotePostings}, schema: NodeApi.SubscriptionInfoArray
    });
}

export function* getFriendGroups(nodeName: string | null): CallApiResult<FriendGroupInfo[]> {
    return yield* callApi({
        nodeName, location: "/people/friends/groups", auth: true, schema: NodeApi.FriendGroupInfoArray
    });
}

export function* postFriendGroup(nodeName: string | null, title: string,
                                 viewPrincipal: string): CallApiResult<FriendGroupInfo> {
    return yield* callApi({
        nodeName, location: "/people/friends/groups", method: "POST", auth: true,
        body: {title, operations: {view: viewPrincipal}}, schema: NodeApi.FriendGroupInfo
    });
}

export function* getFriends(nodeName: string | null): CallApiResult<FriendInfo[]> {
    return yield* callApi({
        nodeName, location: "/people/friends", auth: true, schema: NodeApi.FriendInfoArray
    });
}

export function* getFriend(nodeName: string | null, remoteNodeName: string): CallApiResult<FriendInfo> {
    return yield* callApi({
        nodeName, location: ut`/people/friends/${remoteNodeName}`, auth: true, schema: NodeApi.FriendInfo
    });
}

export function* putFriends(nodeName: string | null, friends: FriendDescription[]): CallApiResult<FriendInfo[]> {
    return yield* callApi({
        nodeName, location: "/people/friends", method: "PUT", auth: true, body: friends, schema: NodeApi.FriendInfoArray
    });
}

export function* getFriendOfs(nodeName: string | null): CallApiResult<FriendOfInfo[]> {
    return yield* callApi({
        nodeName, location: "/people/friend-ofs", auth: true, schema: NodeApi.FriendOfInfoArray
    });
}

export function* getFeatures(nodeName: string | null): CallApiResult<Features> {
    return yield* callApi({nodeName, location: "/features", auth: true, schema: NodeApi.Features});
}

export function* getPosting(nodeName: string | null, id: string,
                            withSource: boolean = false): CallApiResult<PostingInfo> {
    const include = withSource ? "source" : null;
    const location = urlWithParameters(ut`/postings/${id}`, {include});
    return decodeBodies(yield* callApi({
        nodeName, location, auth: true, schema: NodeApi.PostingInfo, errorFilter: ["posting.not-found"]
    }));
}

export function* postPosting(nodeName: string | null, postingText: PostingText): CallApiResult<PostingInfo> {
    return decodeBodies(yield* callApi({
        nodeName, location: "/postings", method: "POST", auth: true, body: postingText, schema: NodeApi.PostingInfo
    }));
}

export function* putPosting(nodeName: string | null, id: string, postingText: PostingText): CallApiResult<PostingInfo> {
    return decodeBodies(yield* callApi({
        nodeName, location: ut`/postings/${id}`, method: "PUT", auth: true, body: postingText,
        schema: NodeApi.PostingInfo
    }));
}

export function* putRemotePosting(nodeName: string | null, remoteNodeName: string, id: string,
                                  postingText: PostingSourceText): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/nodes/${remoteNodeName}/postings/${id}`, method: "PUT", auth: true, body: postingText,
        schema: NodeApi.Result
    });
}

export function* deletePosting(nodeName: string | null, id: string): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/postings/${id}`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* getPostingAttached(nodeName: string | null, id: string): CallApiResult<PostingInfo[]> {
    return decodeBodies(yield* callApi({
        nodeName, location: ut`/postings/${id}/attached`, auth: true, schema: NodeApi.PostingInfoArray
    }));
}

export function* remotePostingVerify(nodeName: string | null, remoteNodeName: string,
                                     id: string): CallApiResult<AsyncOperationCreated> {
    return yield* callApi({
        nodeName: ":", location: ut`/nodes/${remoteNodeName}/postings/${id}/verify`, method: "POST", auth: true,
        schema: NodeApi.AsyncOperationCreated
    });
}

export function* postPostingReaction(nodeName: string | null, postingId: string,
                                     negative: boolean, emoji: number): CallApiResult<ReactionCreated> {
    const {ownerName, ownerFullName, ownerGender, avatar} = {
        ownerName: yield* select(getHomeOwnerName),
        ownerFullName: yield* select(getHomeOwnerFullName),
        ownerGender: yield* select(getHomeOwnerGender),
        avatar: yield* select(getHomeOwnerAvatar)
    };
    const body: ReactionDescription = {
        ownerName, ownerFullName, ownerGender, ownerAvatar: toAvatarDescription(avatar), negative, emoji
    };
    return yield* callApi({
        nodeName, location: ut`/postings/${postingId}/reactions`, method: "POST", auth: true, body,
        schema: NodeApi.ReactionCreated
    });
}

export function* getPostingReaction(nodeName: string | null, postingId: string): CallApiResult<ReactionInfo> {
    const ownerName = yield* select(getHomeOwnerName);
    return yield* callApi({
        nodeName, location: ut`/postings/${postingId}/reactions/${ownerName}`, auth: true, schema: NodeApi.ReactionInfo
    });
}

export function* searchPostingReactions(nodeName: string | null, postingIds: string[]): CallApiResult<ReactionInfo[]> {
    const ownerName = yield* select(getHomeOwnerName);
    return yield* callApi({
        nodeName, location: "/postings/reactions/search", method: "POST", auth: true,
        body: {ownerName, postings: postingIds}, schema: NodeApi.ReactionInfoArray
    });
}

export function* deletePostingReaction(nodeName: string | null, postingId: string): CallApiResult<ReactionTotalsInfo> {
    const ownerName = yield* select(getHomeOwnerName);
    return yield* callApi({
        nodeName, location: ut`/postings/${postingId}/reactions/${ownerName}`, method: "DELETE", auth: true,
        schema: NodeApi.ReactionTotalsInfo
    });
}

export function* getPostingReactionTotals(nodeName: string | null,
                                          postingId: string): CallApiResult<ReactionTotalsInfo> {
    return yield* callApi({
        nodeName, location: ut`/postings/${postingId}/reaction-totals`, auth: true, schema: NodeApi.ReactionTotalsInfo
    });
}

export function* searchPostingReactionTotals(nodeName: string | null,
                                             postingIds: string[]): CallApiResult<ReactionTotalsInfo[]> {
    return yield* callApi({
        nodeName, location: "/postings/reaction-totals/search", method: "POST", auth: true,
        body: {postings: postingIds}, schema: NodeApi.ReactionTotalsInfoArray
    });
}

export function* getPostingReactions(nodeName: string | null, postingId: string, negative: boolean | null,
                                     emoji: number | null, before: number | null,
                                     limit: number | null): CallApiResult<ReactionsSliceInfo> {
    const location = urlWithParameters(ut`/postings/${postingId}/reactions`,
        {negative, emoji, before, limit});
    return yield* callApi({nodeName, location, auth: true, schema: NodeApi.ReactionsSliceInfo});
}

export function* postRemotePostingReaction(nodeName: string | null, remoteNodeName: string, postingId: string,
                                           negative: boolean, emoji: number): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions`, method: "POST", auth: true,
        body: {negative, emoji}, schema: NodeApi.Result
    });
}

export function* deleteRemotePostingReaction(nodeName: string | null, remoteNodeName: string,
                                             postingId: string): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions`, method: "DELETE", auth: true,
        schema: NodeApi.Result
    });
}

export function* remotePostingReactionVerify(nodeName: string | null, remoteNodeName: string, postingId: string,
                                             ownerName: string): CallApiResult<AsyncOperationCreated> {
    return yield* callApi({
        nodeName, location: ut`/nodes/${remoteNodeName}/postings/${postingId}/reactions/${ownerName}/verify`,
        method: "POST", auth: true, schema: NodeApi.AsyncOperationCreated
    });
}

export function* getDraftsNewPosting(nodeName: string | null, receiverName: string): CallApiResult<DraftInfo[]> {
    return decodeBodies(yield* callApi({
        nodeName, location: ut`/drafts?draftType=new-posting&nodeName=${receiverName}`, auth: true,
        schema: NodeApi.DraftInfoList
    }));
}

export function* getDraftPostingUpdate(nodeName: string | null, receiverName: string,
                                       receiverPostingId: string): CallApiResult<DraftInfo | null> {
    const list = decodeBodies(yield* callApi({
        nodeName, location: ut`/drafts?draftType=posting-update&nodeName=${receiverName}&postingId=${receiverPostingId}`,
        auth: true, schema: NodeApi.DraftInfoList
    }));
    return list.length > 0 ? list[0] : null;
}

export function* getDraftNewComment(nodeName: string | null, receiverName: string,
                                    receiverPostingId: string): CallApiResult<DraftInfo | null> {
    const list = decodeBodies(yield* callApi({
        nodeName, location: ut`/drafts?draftType=new-comment&nodeName=${receiverName}&postingId=${receiverPostingId}`,
        auth: true, schema: NodeApi.DraftInfoList
    }));
    return list.length > 0 ? list[0] : null;
}

export function* getDraftCommentUpdate(nodeName: string | null, receiverName: string, receiverPostingId: string,
                                       receiverCommentId: string): CallApiResult<DraftInfo | null> {
    const location = ut`/drafts?draftType=comment-update&nodeName=${receiverName}&postingId=${receiverPostingId}`
        + ut`&commentId=${receiverCommentId}`;
    const list = decodeBodies(yield* callApi({nodeName, location, auth: true, schema: NodeApi.DraftInfoList}));
    return list.length > 0 ? list[0] : null;
}

export function* getDraft(nodeName: string | null, id: string): CallApiResult<DraftInfo> {
    return decodeBodies(yield* callApi({
        nodeName, location: ut`/drafts/${id}`, auth: true, schema: NodeApi.DraftInfo, errorFilter: ["draft.not-found"]
    }));
}

export function* postDraft(nodeName: string | null, draftText: DraftText): CallApiResult<DraftInfo> {
    return decodeBodies(yield* callApi({
        nodeName, location: "/drafts", method: "POST", auth: true, body: draftText, schema: NodeApi.DraftInfo
    }));
}

export function* putDraft(nodeName: string | null, id: string, draftText: DraftText): CallApiResult<DraftInfo> {
    return decodeBodies(yield* callApi({
        nodeName, location: ut`/drafts/${id}`, method: "PUT", auth: true, body: draftText, schema: NodeApi.DraftInfo
    }));
}

export function* deleteDraft(nodeName: string | null, id: string): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/drafts/${id}`, method: "DELETE", auth: true, schema: NodeApi.Result,
        errorFilter: ["draft.not-found"]
    });
}

export function* searchActivityReactions(nodeName: string | null,
                                         remotePostings: RemotePosting[]): CallApiResult<ActivityReactionInfo[]> {
    return yield* callApi({
        nodeName, location: "/activity/reactions/search", method: "POST", auth: true, body: {postings: remotePostings},
        schema: NodeApi.ActivityReactionInfoArray
    });
}

export function* getCommentsSlice(nodeName: string | null, postingId: string, after: number | null,
                                  before: number | null, limit: number | null): CallApiResult<CommentsSliceInfo> {
    const location = urlWithParameters(ut`/postings/${postingId}/comments`, {after, before, limit});
    return decodeBodies(yield* callApi({nodeName, location, auth: true, schema: NodeApi.CommentsSliceInfo}));
}

export function* getComment(nodeName: string | null, postingId: string, id: string,
                            withSource: boolean = false): CallApiResult<CommentInfo> {
    const include = withSource ? "source" : null;
    const location = urlWithParameters(ut`/postings/${postingId}/comments/${id}`, {include});
    return decodeBodies(yield* callApi({
        nodeName, location, auth: true, schema: NodeApi.CommentInfo, errorFilter: ["comment.not-found"]
    }));
}

export function* postComment(nodeName: string | null, postingId: string,
                             commentText: CommentText): CallApiResult<CommentCreated> {
    return decodeBodies(yield* callApi({
        nodeName, location: ut`/postings/${postingId}/comments`, method: "POST", auth: true, body: commentText,
        schema: NodeApi.CommentCreated
    }));
}

export function* putComment(nodeName: string | null, postingId: string, id: string,
                            commentText: CommentText): CallApiResult<CommentInfo> {
    return decodeBodies(yield* callApi({
        nodeName, location: ut`/postings/${postingId}/comments/${id}`, method: "PUT", auth: true, body: commentText,
        schema: NodeApi.CommentInfo
    }));
}

export function* putRemoteComment(nodeName: string | null, remoteNodeName: string, postingId: string, id: string,
                                  commentText: CommentSourceText): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${id}`, method: "PUT",
        auth: true, body: commentText, schema: NodeApi.Result
    });
}

export function* putComments(nodeName: string | null, postingId: string,
                             attributes: CommentMassAttributes): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/postings/${postingId}/comments`, method: "PUT", auth: true, body: attributes,
        schema: NodeApi.Result
    });
}

export function* deleteComment(nodeName: string | null, postingId: string,
                               id: string): CallApiResult<CommentTotalInfo> {
    return yield* callApi({
        nodeName, location: ut`/postings/${postingId}/comments/${id}`, method: "DELETE", auth: true,
        schema: NodeApi.CommentTotalInfo
    });
}

export function* deleteRemoteComment(nodeName: string | null, remoteNodeName: string, postingId: string,
                                     id: string): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${id}`, method: "DELETE",
        auth: true, schema: NodeApi.Result
    });
}

export function* remoteCommentVerify(nodeName: string | null, remoteNodeName: string, postingId: string,
                                     id: string): CallApiResult<AsyncOperationCreated> {
    return yield* callApi({
        nodeName: ":", location: ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${id}/verify`,
        method: "POST", auth: true, schema: NodeApi.AsyncOperationCreated
    });
}

export function* postCommentReaction(nodeName: string | null, postingId: string, commentId: string,
                                     negative: boolean, emoji: number): CallApiResult<ReactionCreated> {
    const {ownerName, ownerFullName, ownerGender, avatar} = yield* select(state => ({
        ownerName: getHomeOwnerName(state),
        ownerFullName: getHomeOwnerFullName(state),
        ownerGender: getHomeOwnerGender(state),
        avatar: getHomeOwnerAvatar(state)
    }));
    const body: ReactionDescription = {
        ownerName, ownerFullName, ownerGender, ownerAvatar: toAvatarDescription(avatar), negative, emoji
    };
    return yield* callApi({
        nodeName, location: ut`/postings/${postingId}/comments/${commentId}/reactions`, method: "POST", auth: true,
        body, schema: NodeApi.ReactionCreated
    });
}

export function* getCommentReaction(nodeName: string | null, postingId: string,
                                    commentId: string, ownerName?: string | null): CallApiResult<ReactionInfo> {
    if (ownerName == null) {
        ownerName = yield* select(getHomeOwnerName);
    }
    return yield* callApi({
        nodeName, location: ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`, auth: true,
        schema: NodeApi.ReactionInfo
    });
}

export function* deleteCommentReaction(nodeName: string | null, postingId: string,
                                       commentId: string): CallApiResult<ReactionTotalsInfo> {
    const ownerName = yield* select(getHomeOwnerName);
    return yield* callApi({
        nodeName, location: ut`/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`, method: "DELETE",
        auth: true, schema: NodeApi.ReactionTotalsInfo
    });
}

export function* getCommentReactionTotals(nodeName: string | null, postingId: string,
                                          commentId: string): CallApiResult<ReactionTotalsInfo> {
    return yield* callApi({
        nodeName, location: ut`/postings/${postingId}/comments/${commentId}/reaction-totals`, auth: true,
        schema: NodeApi.ReactionTotalsInfo
    });
}

export function* getCommentReactions(nodeName: string | null, postingId: string, commentId: string,
                                     negative: boolean | null, emoji: number | null, before: number | null,
                                     limit: number | null): CallApiResult<ReactionsSliceInfo> {
    const location = urlWithParameters(ut`/postings/${postingId}/comments/${commentId}/reactions`,
        {negative, emoji, before, limit});
    return yield* callApi({nodeName, location, auth: true, schema: NodeApi.ReactionsSliceInfo});
}

export function* postRemoteCommentReaction(nodeName: string | null, remoteNodeName: string, postingId: string,
                                           commentId: string, negative: boolean, emoji: number): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions`,
        method: "POST", auth: true, body: {negative, emoji}, schema: NodeApi.Result
    });
}

export function* deleteRemoteCommentReaction(nodeName: string | null, remoteNodeName: string, postingId: string,
                                             commentId: string): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions`,
        method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* remoteCommentReactionVerify(nodeName: string | null, remoteNodeName: string,
                                             postingId: string, commentId: string,
                                             ownerName: string): CallApiResult<AsyncOperationCreated> {
    const location = ut`/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions/${ownerName}/verify`;
    return yield* callApi({
        nodeName, location, method: "POST", auth: true, schema: NodeApi.AsyncOperationCreated
    });
}

export function* getContacts(nodeName: string | null, query: string | null,
                             limit: number | null): CallApiResult<ContactInfo[]> {
    const location = urlWithParameters("/people/contacts", {query, limit});
    return yield* callApi({nodeName, location, auth: true, schema: NodeApi.ContactInfoArray});
}

export function* postMediaPublic(nodeName: string | null, file: File,
                                 onProgress?: ProgressHandler): CallApiResult<PublicMediaFileInfo> {
    return yield* callApi({
        nodeName, location: "/media/public", method: "POST", auth: true, body: file, onProgress,
        schema: NodeApi.PublicMediaFileInfo
    });
}

export function* getMediaPrivateInfo(nodeName: string | null, id: string): CallApiResult<PrivateMediaFileInfo> {
    return yield* callApi({
        nodeName, location: ut`/media/private/${id}/info`, auth: true, schema: NodeApi.PrivateMediaFileInfo
    });
}

export function* postMediaPrivate(nodeName: string | null, file: File,
                                  onProgress?: ProgressHandler): CallApiResult<PrivateMediaFileInfo> {
    return yield* callApi({
        nodeName, location: "/media/private", method: "POST", auth: true, body: file, onProgress,
        schema: NodeApi.PrivateMediaFileInfo
    });
}

export function* getAvatars(nodeName: string | null): CallApiResult<AvatarInfo[]> {
    return yield* callApi({nodeName, location: "/avatars", schema: NodeApi.AvatarInfoArray});
}

export function* postAvatar(nodeName: string | null, avatar: AvatarAttributes): CallApiResult<AvatarInfo> {
    return yield* callApi({
        nodeName, location: "/avatars", method: "POST", auth: true, body: avatar, schema: NodeApi.AvatarInfo
    });
}

export function* deleteAvatar(nodeName: string | null, id: string): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/avatars/${id}`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* reorderAvatars(nodeName: string | null, ids: string[]): CallApiResult<AvatarOrdinal[]> {
    return yield* callApi({
        nodeName, location: "/avatars/reorder", method: "POST", auth: true, body: {ids},
        schema: NodeApi.AvatarOrdinalArray
    });
}

export function* proxyMedia(nodeName: string | null, url: string): CallApiResult<Blob> {
    return yield* callApi({nodeName, location: ut`/proxy/media?url=${url}`, auth: true, schema: "blob"});
}

export function* proxyLinkPreview(nodeName: string | null, url: string): CallApiResult<LinkPreviewInfo> {
    return yield* callApi({
        nodeName, location: ut`/proxy/link-preview?url=${url}`, auth: true, schema: NodeApi.LinkPreviewInfo
    });
}

export function* getPlugins(nodeName: string | null): CallApiResult<PluginInfo[]> {
    return yield* callApi({nodeName, location: "/plugins", auth: true, schema: NodeApi.PluginInfoArray});
}

export function* deletePlugin(nodeName: string | null, name: string): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/plugins/${name}`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* askRemoteNode(nodeName: string | null, remoteNodeName: string, subject: AskSubject,
                               friendGroupId: string | null, message: string): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/nodes/${remoteNodeName}/ask`, method: "POST", auth: true,
        body: {subject, friendGroupId, message}, schema: NodeApi.Result
    });
}

export function* postBlockedInstant(nodeName: string | null,
                                    blockedInstant: BlockedInstantAttributes): CallApiResult<BlockedInstantInfo> {
    return yield* callApi({
        nodeName, location: "/blocked-instants", method: "POST", auth: true, body: blockedInstant,
        schema: NodeApi.BlockedInstantInfo
    });
}

export function* deleteBlockedInstant(nodeName: string | null, id: string): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/blocked-instants/${id}`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* postBlockedUser(nodeName: string | null,
                                 blockedUser: BlockedUserAttributes): CallApiResult<BlockedUserInfo> {
    return yield* callApi({
        nodeName, location: "/people/blocked-users", method: "POST", auth: true, body: blockedUser,
        schema: NodeApi.BlockedUserInfo
    });
}

export function* deleteBlockedUser(nodeName: string | null, id: string): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/people/blocked-users/${id}`, method: "DELETE", auth: true, schema: NodeApi.Result,
        errorFilter: ["blocked-user.not-found"]
    });
}

export function* searchBlockedUsers(nodeName: string | null,
                                    filter: BlockedUserFilter): CallApiResult<BlockedUserInfo[]> {
    return yield* callApi({
        nodeName, location: "/people/blocked-users/search", method: "POST", auth: true, body: filter,
        schema: NodeApi.BlockedUserInfoArray
    });
}

export function* getBlockedUsersChecksums(nodeName: string | null): CallApiResult<BlockedUsersChecksums> {
    return yield* callApi({
        nodeName, location: "/people/blocked-users/checksums", auth: true, schema: NodeApi.BlockedUsersChecksums
    });
}

export function* searchBlockedByUsers(nodeName: string | null,
                                      filter: BlockedByUserFilter): CallApiResult<BlockedByUserInfo[]> {
    return yield* callApi({
        nodeName, location: "/people/blocked-by-users/search", method: "POST", auth: true, body: filter,
        schema: NodeApi.BlockedByUserInfoArray
    });
}

export function* postRemoteSheriffOrder(nodeName: string | null, remoteNodeName: string,
                                        sheriffOrder: SheriffOrderAttributes): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/nodes/${remoteNodeName}/sheriff/orders`, method: "POST", auth: true, body: sheriffOrder,
        schema: NodeApi.Result
    });
}

export function* getRemoteSheriffOrder(nodeName: string | null, remoteNodeName: string,
                                       id: string): CallApiResult<SheriffOrderInfo> {
    return yield* callApi({
        nodeName, location: ut`/nodes/${remoteNodeName}/sheriff/orders/${id}`, schema: NodeApi.SheriffOrderInfo
    });
}

export function* postSheriffComplain(nodeName: string | null,
                                     complain: SheriffComplainText): CallApiResult<SheriffComplainInfo> {
    return yield* callApi({
        nodeName, location: "/sheriff/complains", method: "POST", auth: true, body: complain,
        schema: NodeApi.SheriffComplainInfo
    });
}

export function* getSheriffComplainGroupsSlice(
    nodeName: string | null, after: number | null, before: number | null, limit: number | null,
    status: SheriffComplainStatus | null
): CallApiResult<SheriffComplainGroupsSliceInfo> {
    const location = urlWithParameters("/sheriff/complains/groups", {after, before, limit, status});
    return yield* callApi({nodeName, location, auth: true, schema: NodeApi.SheriffComplainGroupsSliceInfo});
}

export function* getSheriffComplainGroup(nodeName: string | null, id: string): CallApiResult<SheriffComplainGroupInfo> {
    return yield* callApi({
        nodeName, location: ut`/sheriff/complains/groups/${id}`, auth: true, schema: NodeApi.SheriffComplainGroupInfo
    });
}

export function* getSheriffComplainsByGroup(nodeName: string | null, id: string): CallApiResult<SheriffComplainInfo[]> {
    return yield* callApi({
        nodeName, location: ut`/sheriff/complains/groups/${id}/complains`, auth: true,
        schema: NodeApi.SheriffComplainInfoArray
    });
}

export function* putSheriffComplainGroup(nodeName: string | null, id: string,
                                         decision: SheriffComplainDecisionText): CallApiResult<SheriffComplainGroupInfo> {
    return yield* callApi({
        nodeName, location: ut`/sheriff/complains/groups/${id}`, method: "PUT", auth: true, body: decision,
        schema: NodeApi.SheriffComplainGroupInfo
    });
}

export function* getUserListItem(nodeName: string | null, listName: string,
                                 name: string): CallApiResult<UserListItemInfo> {
    return yield* callApi({
        nodeName, location: ut`/user-lists/${listName}/items/${name}`, schema: NodeApi.UserListItemInfo,
        errorFilter: ["user-list-item.not-found"]
    });
}

export function* postUserListItem(nodeName: string | null, listName: string,
                                  name: string): CallApiResult<UserListItemInfo> {
    return yield* callApi({
        nodeName, location: ut`/user-lists/${listName}/items`, method: "POST", auth: true, body: {nodeName: name},
        schema: NodeApi.UserListItemInfo
    });
}

export function* deleteUserListItem(nodeName: string | null, listName: string,
                                    name: string): CallApiResult<Result> {
    return yield* callApi({
        nodeName, location: ut`/user-lists/${listName}/items/${name}`, method: "DELETE", auth: true,
        schema: NodeApi.Result
    });
}
