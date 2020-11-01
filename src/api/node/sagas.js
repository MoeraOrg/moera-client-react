import { call, select } from 'redux-saga/effects';

import { ClientSettings, NodeApi } from "api";
import { callApi } from "api/node/call";
import { getHomeOwnerName } from "state/home/selectors";
import { urlWithParameters } from "util/misc";

export function* createDomain(nodeName, name) {
    yield call(callApi, {nodeName, location: "/domains", method: "POST", body: {name}, schema: NodeApi.DomainInfo,
        errorFilter: ["domain.already-exists", "domainInfo.name.blank", "domainInfo.name.wrong-hostname"]});
}

export function* createCredentials(nodeName, login, password) {
    yield call(callApi, {
        nodeName,
        location: "/credentials",
        method: "POST",
        body: {
            login,
            password
        },
        schema: NodeApi.Result,
        errorFilter: ["credentials.already-created"]
    });
}

export function* createToken(nodeName, login, password) {
    return yield call(callApi, {
        nodeName,
        location: "/tokens",
        method: "POST",
        body: {
            login,
            password
        },
        schema: NodeApi.TokenCreated,
        errorFilter: ["credentials.login-incorrect", "credentials.not-created"]
    });
}

export function* getCartes(nodeName, auth = true) {
    return yield call(callApi, {nodeName, location: "/cartes", auth, schema: NodeApi.CarteSet,
        errorFilter: ["node-name-not-set"]});
}

export function* getWhoAmI(nodeName) {
    return yield call(callApi, {nodeName, location: "/whoami", schema: NodeApi.WhoAmI});
}

export function* getNodeSettings(nodeName) {
    return yield call(callApi, {
        nodeName, location: "/settings/node", auth: true, schema: NodeApi.SettingInfoArray
    });
}

export function* getNodeSettingsMetadata(nodeName) {
    return yield call(callApi, {
        nodeName, location: "/settings/node/metadata", auth: true, schema: NodeApi.SettingMetaInfoArray
    });
}

export function* getClientSettings(nodeName) {
    const location = urlWithParameters("/settings/client", {prefix: ClientSettings.PREFIX});
    return yield call(callApi, {nodeName, location, auth: true, schema: NodeApi.SettingInfoArray});
}

export function* putSettings(nodeName, settings) {
    return yield call(callApi, {
        nodeName, location: "/settings", method: "PUT", auth: true, body: settings, schema: NodeApi.Result
    });
}

export function* getProfile(nodeName) {
    return yield call(callApi, {nodeName, location: "/profile", auth: true, schema: NodeApi.ProfileInfo});
}

export function* putProfile(nodeName, profile) {
    return yield call(callApi, {
        nodeName, location: "/profile", method: "PUT", auth: true, body: profile, schema: NodeApi.ProfileInfo
    });
}

export function* getNodeName(nodeName) {
    return yield call(callApi, {nodeName, location: "/node-name", auth: true, schema: NodeApi.NodeNameInfo});
}

export function* registerName(nodeName, name) {
    return yield call(callApi, {
        nodeName, location: "/node-name", method: "POST", auth: true, body: {name}, schema: NodeApi.RegisteredNameSecret
    });
}

export function* updateNodeName(nodeName, name, mnemonic) {
    const body = name ? {name, mnemonic} : {mnemonic};
    return yield call(callApi, {
        nodeName, location: "/node-name", method: "PUT", auth: true, body, schema: NodeApi.Result
    });
}

export function* getFeedGeneral(nodeName, feedName) {
    feedName = encodeURIComponent(feedName);
    return yield call(callApi, {nodeName, location: `/feeds/${feedName}`, auth: true, schema: NodeApi.FeedInfo});
}

export function* getFeedSlice(nodeName, feedName, after, before, limit) {
    feedName = encodeURIComponent(feedName);
    const location = urlWithParameters(`/feeds/${feedName}/stories`, {after, before, limit});
    return yield call(callApi, {nodeName, location, auth: true, schema: NodeApi.FeedSliceInfo, withBodies: true});
}

export function* getFeedStatus(nodeName, feedName) {
    feedName = encodeURIComponent(feedName);
    return yield call(callApi, {
        nodeName, location: `/feeds/${feedName}/status`, auth: true, schema: NodeApi.FeedStatus
    });
}

export function* putFeedStatus(nodeName, feedName, viewed, read, before) {
    feedName = encodeURIComponent(feedName);
    return yield call(callApi, {
        nodeName, location: `/feeds/${feedName}/status`, method: "PUT", auth: true, body: {viewed, read, before},
        schema: NodeApi.FeedStatus
    });
}

export function* putStory(nodeName, id, storyAttributes) {
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/stories/${id}`, method: "PUT", auth: true, body: storyAttributes,
        schema: NodeApi.StoryInfo, withBodies: true
    });
}

export function* getPeopleGeneral(nodeName) {
    return yield call(callApi, {nodeName, location: "/people", schema: NodeApi.PeopleGeneralInfo});
}

export function* getSubscribers(nodeName, type) {
    type = encodeURIComponent(type);
    return yield call(callApi, {
        nodeName, location: `/people/subscribers?type=${type}`, schema: NodeApi.SubscriberInfoArray
    });
}

export function* postFeedSubscriber(nodeName, feedName) {
    return yield call(callApi, {
        nodeName, location: "/people/subscribers", method: "POST", auth: true, body: {type: "feed", feedName},
        schema: NodeApi.SubscriberInfo
    });
}

export function* postPostingCommentsSubscriber(nodeName, postingId) {
    return yield call(callApi, {
        nodeName, location: "/people/subscribers", method: "POST", auth: true,
        body: {type: "posting-comments", postingId}, schema: NodeApi.SubscriberInfo
    });
}

export function* deleteSubscriber(nodeName, subscriberId) {
    subscriberId = encodeURIComponent(subscriberId);
    return yield call(callApi, {
        nodeName, location: `/people/subscribers/${subscriberId}`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* getSubscriptions(nodeName, type) {
    type = encodeURIComponent(type);
    return yield call(callApi, {
        nodeName, location: `/people/subscriptions?type=${type}`, schema: NodeApi.SubscriptionInfoArray
    });
}

export function* postFeedSubscription(nodeName, remoteSubscriberId, remoteNodeName, remoteFeedName) {
    return yield call(callApi, {
        nodeName, location: "/people/subscriptions", method: "POST", auth: true,
        body: {type: "feed", feedName: "news", remoteSubscriberId, remoteNodeName, remoteFeedName},
        schema: NodeApi.SubscriptionInfo
    });
}

export function* postPostingCommentsSubscription(nodeName, remoteSubscriberId, remoteNodeName, remotePostingId) {
    return yield call(callApi, {
        nodeName, location: "/people/subscriptions", method: "POST", auth: true,
        body: {type: "posting-comments", remoteSubscriberId, remoteNodeName, remotePostingId},
        schema: NodeApi.SubscriptionInfo
    });
}

export function* deleteSubscription(nodeName, remoteSubscriberId, remoteNodeName) {
    const location = urlWithParameters("/people/subscriptions",
        {nodeName: remoteNodeName, subscriberId: remoteSubscriberId});
    return yield call(callApi, {nodeName, location, method: "DELETE", auth: true, schema: NodeApi.Result});
}

export function* postSubscriptionsSearch(nodeName, remotePostings) {
    return yield call(callApi, {
        nodeName, location: "/people/subscriptions/search", method: "POST", auth: true,
        body: {postings: remotePostings}, schema: NodeApi.SubscriptionInfoArray
    });
}

export function* getPostingFeatures(nodeName) {
    return yield call(callApi, {nodeName, location: "/postings/features", schema: NodeApi.PostingFeatures});
}

export function* getPosting(nodeName, id, withSource = false) {
    const include = withSource ? "source" : null;
    id = encodeURIComponent(id);
    const location = urlWithParameters(`/postings/${id}`, {include});
    return yield call(callApi, {
        nodeName, location, auth: true, schema: NodeApi.PostingInfo, withBodies: true,
        errorFilter: ["posting.not-found"]
    });
}

export function* postPosting(nodeName, postingText) {
    return yield call(callApi, {
        nodeName, location: "/postings", method: "POST", auth: true, body: postingText, schema: NodeApi.PostingInfo,
        withBodies: true
    });
}

export function* putPosting(nodeName, id, postingText) {
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/postings/${id}`, method: "PUT", auth: true, body: postingText,
        schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* deletePosting(nodeName, id) {
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/postings/${id}`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* remotePostingVerify(nodeName, remoteNodeName, id) {
    remoteNodeName = encodeURIComponent(remoteNodeName);
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName: ":", location: `/nodes/${remoteNodeName}/postings/${id}/verify`, method: "POST", auth: true,
        schema: NodeApi.AsyncOperationCreated
    });
}

export function* postPostingReaction(nodeName, postingId, negative, emoji) {
    const ownerName = yield select(getHomeOwnerName);
    const body = {ownerName, negative, emoji};
    postingId = encodeURIComponent(postingId);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/reactions`, method: "POST", auth: true, body,
        schema: NodeApi.ReactionCreated
    });
}

export function* getPostingReaction(nodeName, postingId) {
    const ownerName = encodeURIComponent(yield select(getHomeOwnerName));
    postingId = encodeURIComponent(postingId);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/reactions/${ownerName}`, auth: true, schema: NodeApi.ReactionInfo
    });
}

export function* deletePostingReaction(nodeName, postingId) {
    const ownerName = encodeURIComponent(yield select(getHomeOwnerName));
    postingId = encodeURIComponent(postingId);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/reactions/${ownerName}`, method: "DELETE", auth: true,
        schema: NodeApi.ReactionTotalsInfo
    });
}

export function* getPostingReactionTotals(nodeName, postingId) {
    postingId = encodeURIComponent(postingId);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/reaction-totals`, auth: true, schema: NodeApi.ReactionTotalsInfo
    });
}

export function* getPostingReactions(nodeName, postingId, negative, emoji, before, limit) {
    postingId = encodeURIComponent(postingId);
    const location = urlWithParameters(`/postings/${postingId}/reactions`,
        {negative, emoji, before, limit});
    return yield call(callApi, {nodeName, location, auth: true, schema: NodeApi.ReactionsSliceInfo});
}

export function* postRemotePostingReaction(nodeName, remoteNodeName, postingId, negative, emoji) {
    remoteNodeName = encodeURIComponent(remoteNodeName);
    postingId = encodeURIComponent(postingId);
    return yield call(callApi, {
        nodeName, location: `/nodes/${remoteNodeName}/postings/${postingId}/reactions`, method: "POST", auth: true,
        body: {negative, emoji}, schema: NodeApi.Result
    });
}

export function* deleteRemotePostingReaction(nodeName, remoteNodeName, postingId) {
    remoteNodeName = encodeURIComponent(remoteNodeName);
    postingId = encodeURIComponent(postingId);
    return yield call(callApi, {
        nodeName, location: `/nodes/${remoteNodeName}/postings/${postingId}/reactions`, method: "DELETE", auth: true,
        schema: NodeApi.Result
    });
}

export function* remotePostingReactionVerify(nodeName, remoteNodeName, postingId, ownerName) {
    remoteNodeName = encodeURIComponent(remoteNodeName);
    postingId = encodeURIComponent(postingId);
    ownerName = encodeURIComponent(ownerName);
    return yield call(callApi, {
        nodeName, location: `/nodes/${remoteNodeName}/postings/${postingId}/reactions/${ownerName}/verify`,
        method: "POST", auth: true, schema: NodeApi.AsyncOperationCreated
    });
}

export function* getDraftPostings(nodeName) {
    return yield call(callApi, {
        nodeName, location: "/draft-postings", auth: true, schema: NodeApi.PostingInfoList
    });
}

export function* getDraftPosting(nodeName, id) {
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/draft-postings/${id}`, auth: true, schema: NodeApi.PostingInfo, withBodies: true,
        errorFilter: ["posting.not-found"]
    });
}

export function* postDraftPosting(nodeName, postingText) {
    return yield call(callApi, {
        nodeName, location: "/draft-postings", method: "POST", auth: true, body: postingText,
        schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* putDraftPosting(nodeName, id, postingText) {
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/draft-postings/${id}`, method: "PUT", auth: true, body: postingText,
        schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* deleteDraftPosting(nodeName, id) {
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/draft-postings/${id}`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* getPostingDraftRevision(nodeName, id) {
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/postings/${id}/revisions/draft`, auth: true, schema: NodeApi.PostingInfo,
        withBodies: true, errorFilter: ["posting.not-found"]
    });
}

export function* putPostingDraftRevision(nodeName, id, postingText) {
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/postings/${id}/revisions/draft`, method: "PUT", auth: true, body: postingText,
        schema: NodeApi.PostingInfo, withBodies: true
    });
}

export function* deletePostingDraftRevision(nodeName, id) {
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/postings/${id}/revisions/draft`, method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* postActivityReactionsSearch(nodeName, remotePostings) {
    return yield call(callApi, {
        nodeName, location: "/activity/reactions/search", method: "POST", auth: true, body: {postings: remotePostings},
        schema: NodeApi.ActivityReactionInfoArray
    });
}

export function* getCommentsSlice(nodeName, postingId, after, before, limit) {
    postingId = encodeURIComponent(postingId);
    const location = urlWithParameters(`/postings/${postingId}/comments`, {after, before, limit});
    return yield call(callApi, {
        nodeName, location, auth: true, schema: NodeApi.CommentsSliceInfo, withBodies: true
    });
}

export function* getComment(nodeName, postingId, id, withSource = false) {
    const include = withSource ? "source" : null;
    postingId = encodeURIComponent(postingId);
    id = encodeURIComponent(id);
    const location = urlWithParameters(`/postings/${postingId}/comments/${id}`, {include});
    return yield call(callApi, {
        nodeName, location, auth: true, schema: NodeApi.CommentInfo, withBodies: true,
        errorFilter: ["comment.not-found"]
    });
}

export function* postComment(nodeName, postingId, commentText) {
    postingId = encodeURIComponent(postingId);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/comments`, method: "POST", auth: true, body: commentText,
        schema: NodeApi.CommentCreated, withBodies: true
    });
}

export function* putComment(nodeName, postingId, id, commentText) {
    postingId = encodeURIComponent(postingId);
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/comments/${id}`, method: "PUT", auth: true, body: commentText,
        schema: NodeApi.CommentInfo, withBodies: true
    });
}

export function* putRemoteComment(nodeName, remoteNodeName, postingId, id, commentText) {
    remoteNodeName = encodeURIComponent(remoteNodeName);
    postingId = encodeURIComponent(postingId);
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/nodes/${remoteNodeName}/postings/${postingId}/comments/${id}`, method: "PUT", auth: true,
        body: commentText, schema: NodeApi.Result
    });
}

export function* deleteComment(nodeName, postingId, id) {
    postingId = encodeURIComponent(postingId);
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/comments/${id}`, method: "DELETE", auth: true,
        schema: NodeApi.CommentTotalInfo
    });
}

export function* deleteRemoteComment(nodeName, remoteNodeName, postingId, id) {
    postingId = encodeURIComponent(postingId);
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName, location: `/nodes/${remoteNodeName}/postings/${postingId}/comments/${id}`, method: "DELETE",
        auth: true, schema: NodeApi.Result
    });
}

export function* remoteCommentVerify(nodeName, remoteNodeName, postingId, id) {
    remoteNodeName = encodeURIComponent(remoteNodeName);
    postingId = encodeURIComponent(postingId);
    id = encodeURIComponent(id);
    return yield call(callApi, {
        nodeName: ":", location: `/nodes/${remoteNodeName}/postings/${postingId}/comments/${id}/verify`, method: "POST",
        auth: true, schema: NodeApi.AsyncOperationCreated
    });
}

export function* postCommentReaction(nodeName, postingId, commentId, negative, emoji) {
    const ownerName = yield select(getHomeOwnerName);
    const body = {ownerName, negative, emoji};
    postingId = encodeURIComponent(postingId);
    commentId = encodeURIComponent(commentId);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/comments/${commentId}/reactions`, method: "POST", auth: true, body,
        schema: NodeApi.ReactionCreated
    });
}

export function* getCommentReaction(nodeName, postingId, commentId) {
    const ownerName = encodeURIComponent(yield select(getHomeOwnerName));
    postingId = encodeURIComponent(postingId);
    commentId = encodeURIComponent(commentId);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`, auth: true,
        schema: NodeApi.ReactionInfo
    });
}

export function* deleteCommentReaction(nodeName, postingId, commentId) {
    const ownerName = encodeURIComponent(yield select(getHomeOwnerName));
    postingId = encodeURIComponent(postingId);
    commentId = encodeURIComponent(commentId);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/comments/${commentId}/reactions/${ownerName}`, method: "DELETE",
        auth: true, schema: NodeApi.ReactionTotalsInfo
    });
}

export function* getCommentReactionTotals(nodeName, postingId, commentId) {
    postingId = encodeURIComponent(postingId);
    commentId = encodeURIComponent(commentId);
    return yield call(callApi, {
        nodeName, location: `/postings/${postingId}/comments/${commentId}/reaction-totals`, auth: true,
        schema: NodeApi.ReactionTotalsInfo
    });
}

export function* getCommentReactions(nodeName, postingId, commentId, negative, emoji, before, limit) {
    postingId = encodeURIComponent(postingId);
    commentId = encodeURIComponent(commentId);
    const location = urlWithParameters(`/postings/${postingId}/comments/${commentId}/reactions`,
        {negative, emoji, before, limit});
    return yield call(callApi, {nodeName, location, auth: true, schema: NodeApi.ReactionsSliceInfo});
}

export function* postRemoteCommentReaction(nodeName, remoteNodeName, postingId, commentId, negative, emoji) {
    remoteNodeName = encodeURIComponent(remoteNodeName);
    postingId = encodeURIComponent(postingId);
    commentId = encodeURIComponent(commentId);
    return yield call(callApi, {
        nodeName, location: `/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions`,
        method: "POST", auth: true, body: {negative, emoji}, schema: NodeApi.Result
    });
}

export function* deleteRemoteCommentReaction(nodeName, remoteNodeName, postingId, commentId) {
    remoteNodeName = encodeURIComponent(remoteNodeName);
    postingId = encodeURIComponent(postingId);
    commentId = encodeURIComponent(commentId);
    return yield call(callApi, {
        nodeName, location: `/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions`,
        method: "DELETE", auth: true, schema: NodeApi.Result
    });
}

export function* remoteCommentReactionVerify(nodeName, remoteNodeName, postingId, commentId, ownerName) {
    remoteNodeName = encodeURIComponent(remoteNodeName);
    postingId = encodeURIComponent(postingId);
    commentId = encodeURIComponent(commentId);
    ownerName = encodeURIComponent(ownerName);
    const location = `/nodes/${remoteNodeName}/postings/${postingId}/comments/${commentId}/reactions/${ownerName}/verify`;
    return yield call(callApi, {
        nodeName, location, method: "POST", auth: true, schema: NodeApi.AsyncOperationCreated
    });
}
