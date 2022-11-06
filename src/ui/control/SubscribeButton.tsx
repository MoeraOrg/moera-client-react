import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { PrincipalValue, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import {
    feedSubscribe,
    feedSubscriberSetVisibility,
    feedSubscriptionSetVisibility,
    feedUnsubscribe
} from "state/feeds/actions";
import { getHomeOwnerGender } from "state/home/selectors";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { isPrincipalIn } from "state/node/selectors";
import { getSettingNode } from "state/settings/selectors";
import { Button, DropdownMenu } from "ui/control";
import { tGender } from "i18n";
import "./SubscribeButton.css";

interface OwnProps {
    small?: boolean | null;
    subscribing: boolean;
    unsubscribing: boolean;
    nodeName: string;
    feedName: string;
    subscriber: SubscriberInfo | null;
    subscription: SubscriptionInfo | null;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function SubscribeButton({small, subscribing, unsubscribing, nodeName, feedName, subscriber, subscription,
                          homeGender, peerHref, subscribersHidden, subscriptionsHidden, subscriberHidden,
                          subscriptionHidden, feedSubscribe, feedUnsubscribe, feedSubscriberSetVisibility,
                          feedSubscriptionSetVisibility}: Props) {
    const {t} = useTranslation();

    const onSubscribe = () => feedSubscribe(nodeName, feedName);

    const onUnsubscribe = () => {
        if (subscription != null) {
            feedUnsubscribe(nodeName, feedName, subscription.id);
        }
    }

    const subscribed = subscription != null;
    const subscribedToMe = subscriber != null;

    const loading = !subscribed ? subscribing : unsubscribing;
    if ((!subscribed && !subscribedToMe) || loading) {
        return (
            <Button variant="outline-primary" size="sm" className="subscribe-button" loading={loading}
                    onClick={onSubscribe}>
                {t("subscribe")}
            </Button>
        );
    }

    const onSubscriptionHide = () => {
        if (subscription?.id != null) {
            feedSubscriptionSetVisibility(subscription.id, false);
        }
    }

    const onSubscriptionShow = () => {
        if (subscription?.id != null) {
            feedSubscriptionSetVisibility(subscription.id, true);
        }
    };

    const onSubscriberHide = () => {
        if (subscriber?.id != null) {
            feedSubscriberSetVisibility(subscriber.id, feedName, false);
        }
    };

    const onSubscriberShow = () => {
        if (subscriber?.id != null) {
            feedSubscriberSetVisibility(subscriber.id, feedName, true);
        }
    };

    const subscriptionHideable = subscribed && !subscriptionsHidden && !subscriptionHidden;
    const subscriptionUnhideable = subscribed && !subscriptionsHidden && subscriptionHidden;
    const subscriberHideable = subscribedToMe && !subscribersHidden && !subscriberHidden;
    const subscriberUnhideable = subscribedToMe && !subscribersHidden && subscriberHidden;
    const caption = !subscribed
        ? t("subscribed-to-me", {"gender": tGender(subscriber?.gender)})
        : (!subscribedToMe ? t("subscribed", {"gender": tGender(homeGender)}) : t("mutually-subscribed"));

    return (
        <DropdownMenu caption={small ? caption : undefined} className="btn btn-sm btn-outline-primary subscribe-button"
                      items={[
            {
                title: t("subscribe-back"),
                href: peerHref,
                onClick: onSubscribe,
                show: !subscribed
            },
            {
                title: t("unsubscribe"),
                href: peerHref,
                onClick: onUnsubscribe,
                show: subscribed
            },
            {
                divider: true
            },
            {
                title: t("hide-my-subscription"),
                href: peerHref,
                onClick: onSubscriptionHide,
                show: subscriptionHideable
            },
            {
                title: t("unhide-my-subscription"),
                href: peerHref,
                onClick: onSubscriptionShow,
                show: !subscriptionHideable && subscriptionUnhideable
            },
            {
                title: t("hide-subscription-to-me"),
                href: peerHref,
                onClick: onSubscriberHide,
                show: subscriberHideable
            },
            {
                title: t("unhide-subscription-to-me"),
                href: peerHref,
                onClick: onSubscriberShow,
                show: !subscriberHideable && subscriberUnhideable
            }
        ]}>
            {small ? <FontAwesomeIcon icon={["far", "bell"]}/> : caption}
            &nbsp;&nbsp;
            <FontAwesomeIcon icon="chevron-down"/>
        </DropdownMenu>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        homeGender: getHomeOwnerGender(state),
        peerHref: getNamingNameNodeUri(state, ownProps.nodeName),
        subscribersHidden: (getSettingNode(state, "subscribers.view") as PrincipalValue ?? "public") === "admin",
        subscriptionsHidden: (getSettingNode(state, "subscriptions.view") as PrincipalValue ?? "public") === "admin",
        subscriberHidden: isPrincipalIn("view", ownProps.subscriber, "unset", "private", {useOperations: "admin"}),
        subscriptionHidden: isPrincipalIn("view", ownProps.subscription, "public", "private")
    }),
    { feedSubscribe, feedUnsubscribe, feedSubscriberSetVisibility, feedSubscriptionSetVisibility }
);

export default connector(SubscribeButton);
