import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getHomeOwnerGender } from "state/home/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { DropdownMenu } from "ui/control";
import SubscribeButtonMenu from "ui/control/subscribebutton/SubscribeButtonMenu";
import { tGender } from "i18n";
import "./SubscribeButton.css";

interface Props {
    small?: boolean | null;
    nodeName: string;
    feedName: string;
    onDialogOpened?: () => void;
}

export function SubscribeButton({small, nodeName, feedName, onDialogOpened}: Props) {
    const card = useSelector((state: ClientState) => getNodeCard(state, nodeName));
    const homeGender = useSelector(getHomeOwnerGender);

    const subscriber = card?.subscription.subscriber;
    const subscription = card?.subscription.subscription;
    const friendGroups = card?.friendship.groups;
    const remoteFriendGroups = card?.friendship.remoteGroups;
    const blockedList = card?.blocking.blocked;
    const blockedByList = card?.blocking.blockedBy;

    const subscribed = subscription != null;
    const subscribedToMe = subscriber != null;

    const {t} = useTranslation();

    const subscriptionIcon: IconProp | null = subscribed
        ? (subscribedToMe ? "arrow-right-arrow-left" : "eye")
        : (subscribedToMe ? "arrows-to-eye" : null)
    const subscriptionCaption = subscribed
        ? (subscribedToMe ? t("mutually-subscribed") : t("subscribed", {"gender": tGender(homeGender)}))
        : (subscribedToMe ? t("subscribed-to-me", {"gender": tGender(subscriber?.contact?.gender)}) : null);

    const friend = friendGroups != null && friendGroups.length > 0;
    const friendOf = remoteFriendGroups != null && remoteFriendGroups.length > 0;
    const friendIcon: IconProp | null = friend
        ? (friendOf ? "people-arrows" : "person")
        : (friendOf ? "person-walking-arrow-right" : null)
    const friendCaption = friend
        ? (friendOf ? t("mutual-friends") : t("friend"))
        : (friendOf ? t("in-friends") : null)

    const blocked = blockedList != null && blockedList.length > 0;
    const blockedBy = blockedByList != null && blockedByList.length > 0;
    const blockedIcon: IconProp | null = blocked
        ? "ban"
        : (blockedBy ? "handcuffs" : null)
    const blockedCaption = blocked
        ? t("blocked")
        : (blockedBy ? t("in-blocked") : null)

    return (
        <DropdownMenu className={cx(
            ["btn", "btn-sm", "subscribe-button"],
            {"btn-outline-primary": !blocked && !blockedBy, "btn-outline-danger": blocked || blockedBy}
        )} content={
            <SubscribeButtonMenu nodeName={nodeName} feedName={feedName}/>
        } onDialogOpened={onDialogOpened}>
            {small ?
                <FontAwesomeIcon icon={blockedIcon ?? friendIcon ?? subscriptionIcon ?? ["far", "bell"]}/>
            :
                blockedCaption ?? friendCaption ?? subscriptionCaption ?? t("subscribe")
            }
            &nbsp;&nbsp;
            <FontAwesomeIcon icon="chevron-down"/>
        </DropdownMenu>
    );
}
