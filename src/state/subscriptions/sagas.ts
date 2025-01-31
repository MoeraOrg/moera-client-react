import { Node, PostingInfo, StoryInfo } from "api";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { getHomeOwnerName, isConnectedToHome } from "state/home/selectors";
import { postingSubscriptionSet } from "state/postings/actions";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import { notNull } from "util/misc";

export async function fillSubscriptions(action: WithContext<ClientAction>, stories: StoryInfo[]): Promise<void> {
    const {connectedToHome, homeOwnerName} = select(state => ({
        connectedToHome: isConnectedToHome(state),
        homeOwnerName: getHomeOwnerName(state)
    }));

    if (!connectedToHome) {
        return;
    }

    const postings = stories
        .map(t => t.posting)
        .filter(notNull)
        .map(posting => ({
            id: posting.id,
            nodeName: posting.receiverName ?? posting.ownerName,
            postingId: posting.receiverPostingId ?? posting.id
        }))
        .filter(t => t.nodeName != null && t.nodeName !== homeOwnerName && t.postingId != null);

    if (postings.length === 0) {
        return;
    }

    const remotePostings = postings.map(t => ({nodeName: t.nodeName!, postingId: t.postingId!}));
    const subscriptions = await Node.searchSubscriptions(
        action, REL_HOME, {type: "posting-comments" as const, postings: remotePostings}
    );
    const subscriptionMap = new Map(subscriptions.map(sr => [`${sr.remoteNodeName} ${sr.remotePostingId}`, sr]));

    for (const t of postings) {
        const key = `${t.nodeName} ${t.postingId}`;
        const subscription = subscriptionMap.get(key);
        if (subscription != null) {
            dispatch(postingSubscriptionSet(t.id, "posting-comments", subscription.id, REL_CURRENT).causedBy(action));
        }
    }
}

export async function fillSubscription(action: WithContext<ClientAction>, posting: PostingInfo): Promise<void> {
    const {connectedToHome, homeOwnerName} = select(state => ({
        connectedToHome: isConnectedToHome(state),
        homeOwnerName: getHomeOwnerName(state)
    }));
    if (!connectedToHome) {
        return;
    }
    const nodeName = posting.receiverName ?? posting.ownerName;
    const postingId = posting.receiverPostingId ?? posting.id;
    if (nodeName == null || nodeName === homeOwnerName || postingId == null) {
        return;
    }
    const remotePostings = [{nodeName, postingId}];
    const subscriptions = await Node.searchSubscriptions(
        action, REL_HOME, {type: "posting-comments" as const, postings: remotePostings}
    );
    for (const subscription of subscriptions) {
        dispatch(postingSubscriptionSet(posting.id, "posting-comments", subscription.id, REL_CURRENT).causedBy(action));
    }
}
