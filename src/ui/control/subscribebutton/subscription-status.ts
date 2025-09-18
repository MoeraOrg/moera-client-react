import { TFunction } from "i18next";
import { tGender } from "i18n";
import { NodeCardState } from "state/nodecards/state";

export interface SubscriptionStatus {
    caption: string | null;
    blocked: boolean;
    blockedBy: boolean;
}

export function getSubscriptionStatus(
    card: NodeCardState | null, homeGender: string | null, t: TFunction
): SubscriptionStatus {
    const subscriber = card?.subscription.subscriber;
    const subscription = card?.subscription.subscription;
    const friendGroups = card?.friendship.groups;
    const remoteFriendGroups = card?.friendship.remoteGroups;
    const blockedList = card?.blocking.blocked;
    const blockedByList = card?.blocking.blockedBy;

    const subscribed = subscription != null;
    const subscribedToMe = subscriber != null;

    const subscriptionCaption = subscribed
        ? (subscribedToMe ? t("mutually-subscribed") : t("subscribed", {"gender": tGender(homeGender)}))
        : (subscribedToMe ? t("subscribed-to-me", {"gender": tGender(subscriber?.contact?.gender)}) : null);

    const friend = friendGroups != null && friendGroups.length > 0;
    const friendOf = remoteFriendGroups != null && remoteFriendGroups.length > 0;
    const friendCaption = friend
        ? (friendOf ? t("mutual-friends") : t("friend"))
        : (friendOf ? t("in-friends") : null)

    const blocked = blockedList != null && blockedList.filter(b => b.blockedOperation !== "instant").length > 0;
    const blockedBy = blockedByList != null && blockedByList.filter(b => b.blockedOperation !== "instant").length > 0;
    const blockedCaption = blocked
        ? t("blocked")
        : (blockedBy ? t("in-blocked") : null)

    const caption = blockedCaption ?? friendCaption ?? subscriptionCaption;
    return {blocked, blockedBy, caption};
}
