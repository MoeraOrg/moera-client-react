import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getHomeOwnerGender } from "state/home/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { feedSubscribe } from "state/feeds/actions";
import { Button, DropdownMenu, useModalDialog, usePopover } from "ui/control";
import SubscribeButtonMenu from "ui/control/subscribebutton/SubscribeButtonMenu";
import MenuButton from "ui/control/dropdownmenu/MenuButton";
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

    const subscriptionCaption = subscribed
        ? (subscribedToMe ? t("mutually-subscribed") : t("subscribed", {"gender": tGender(homeGender)}))
        : (subscribedToMe ? t("subscribed-to-me", {"gender": tGender(subscriber?.contact?.gender)}) : null);

    const friend = friendGroups != null && friendGroups.length > 0;
    const friendOf = remoteFriendGroups != null && remoteFriendGroups.length > 0;
    const friendCaption = friend
        ? (friendOf ? t("mutual-friends") : t("friend"))
        : (friendOf ? t("in-friends") : null)

    const blocked = blockedList != null && blockedList.length > 0;
    const blockedBy = blockedByList != null && blockedByList.length > 0;
    const blockedCaption = blocked
        ? t("blocked")
        : (blockedBy ? t("in-blocked") : null)

    const caption = blockedCaption ?? friendCaption ?? subscriptionCaption;

    const {overlayId: dialogOverlayId} = useModalDialog();
    const {overlayId: popoverOverlayId} = usePopover();
    const parentOverlayId = popoverOverlayId ?? dialogOverlayId;
    const dispatch = useDispatch();

    const onSubscribe = () => dispatch(feedSubscribe(nodeName, feedName));

    return (
        <span className="subscribe-button">
            {caption ?
                <span className={cx("status", {blocked: blocked || blockedBy})}>{caption}</span>
            :
                <Button variant="primary" className="status" onClick={onSubscribe}>{t("subscribe")}</Button>
            }
            <DropdownMenu
                className="btn btn-sm"
                content={
                    <SubscribeButtonMenu nodeName={nodeName} feedName={feedName}/>
                }
                parentOverlayId={parentOverlayId}
                onDialogOpened={onDialogOpened}
            >
                <MenuButton active/>
            </DropdownMenu>
        </span>
    );
}
