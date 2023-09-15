// This file is generated

import * as NodeApiSchema from "api/node/api-schemas"
import { callApi, CallApiResult, decodeBodies, ErrorFilter } from "api/node/call";
import * as API from "api/node/api-types";
import { ProgressHandler } from 'api/fetcher';
import { urlWithParameters, ut } from "util/url";
import { commaSeparatedFlags } from "util/misc";

export function* getCartes(
    nodeName: string | null, limit: number | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.CarteSet> {

    const location = urlWithParameters("/cartes", {limit});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.CarteSet, errorFilter
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

export function* resetCredentials(
    nodeName: string | null, errorFilter: ErrorFilter = false
): CallApiResult<API.EmailHint> {

    const location = "/credentials/reset";
    return yield* callApi({
        nodeName, method: "POST", location, schema: NodeApiSchema.EmailHint, errorFilter
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
    nodeName: string | null, domain: API.DomainAttributes, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.DomainInfo> {

    const location = "/domains";
    return yield* callApi({
        nodeName, method: "POST", location, body: domain, auth, schema: NodeApiSchema.DomainInfo, errorFilter
    });
}

export function* getDomainAvailable(
    nodeName: string | null, remoteNodeName: string, errorFilter: ErrorFilter = false
): CallApiResult<API.DomainAvailable> {

    const location = "/domains/available";
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.DomainAvailable, errorFilter
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
        nodeName, method: "POST", location, body: friendGroup, auth, schema: NodeApiSchema.FriendGroupInfo, errorFilter
    });
}

export function* updateFriendGroup(
    nodeName: string | null, id: string, friendGroup: API.FriendGroupDescription, errorFilter: ErrorFilter = false,
    auth: true | string = true
): CallApiResult<API.FriendGroupInfo> {

    const location = ut`/people/friends/groups/${id}`;
    return yield* callApi({
        nodeName, method: "PUT", location, body: friendGroup, auth, schema: NodeApiSchema.FriendGroupInfo, errorFilter
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
    nodeName: string | null, groupId: string | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.FriendInfo[]> {

    const location = urlWithParameters("/people/friends", {groupId});
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
        nodeName, method: "PUT", location, body: friends, auth, schema: NodeApiSchema.FriendInfoArray, errorFilter
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
        nodeName, method: "POST", location, body: nameToRegister, auth, schema: NodeApiSchema.RegisteredNameSecret,
        errorFilter
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

export function* getPeopleGeneral(
    nodeName: string | null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.PeopleGeneralInfo> {

    const location = "/people";
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.PeopleGeneralInfo, errorFilter
    });
}

export function* getProfile(
    nodeName: string | null, withSource: boolean = false, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.ProfileInfo> {

    const include = commaSeparatedFlags({"source": withSource});
    const location = urlWithParameters("/profile", {include});
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

export function* updateSettings(
    nodeName: string | null, settings: API.SettingInfo[], errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.Result> {

    const location = "/settings";
    return yield* callApi({
        nodeName, method: "PUT", location, body: settings, auth, schema: NodeApiSchema.Result, errorFilter
    });
}

export function* getClientSettings(
    nodeName: string | null, prefix: string | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SettingInfo[]> {

    const location = urlWithParameters("/settings/client", {prefix});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.SettingInfoArray, errorFilter
    });
}

export function* getNodeSettings(
    nodeName: string | null, prefix: string | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SettingInfo[]> {

    const location = urlWithParameters("/settings/node", {prefix});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.SettingInfoArray, errorFilter
    });
}

export function* getNodeSettingsMetadata(
    nodeName: string | null, prefix: string | null = null, errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SettingMetaInfo[]> {

    const location = urlWithParameters("/settings/node/metadata", {prefix});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.SettingMetaInfoArray, errorFilter
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

    const location = urlWithParameters("/people/subscribers", {nodeName: remoteNodeName, type, feedName, entryId});
    return yield* callApi({
        nodeName, method: "GET", location, auth, schema: NodeApiSchema.SubscriberInfoArray, errorFilter
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
        nodeName, method: "PUT", location, body: subscriber, auth, schema: NodeApiSchema.SubscriberInfo, errorFilter
    });
}

export function* getSubscriptions(
    nodeName: string | null, remoteNodeName: string | null = null, type: string | null = null,
    errorFilter: ErrorFilter = false, auth: true | string = true
): CallApiResult<API.SubscriptionInfo[]> {

    const location = urlWithParameters("/people/subscriptions", {nodeName: remoteNodeName, type});
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
        nodeName, method: "GET", location, body: filter, auth, schema: NodeApiSchema.SubscriptionInfoArray, errorFilter
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

export function* whoAmI(
    nodeName: string | null, errorFilter: ErrorFilter = false
): CallApiResult<API.WhoAmI> {

    const location = "/whoami";
    return yield* callApi({
        nodeName, method: "GET", location, schema: NodeApiSchema.WhoAmI, errorFilter
    });
}
