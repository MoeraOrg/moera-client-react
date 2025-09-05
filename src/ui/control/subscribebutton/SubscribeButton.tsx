import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { feedSubscribe } from "state/feeds/actions";
import { openBlockingDetailsDialog } from "state/blockingdetailsdialog/actions";
import { Button, DropdownMenu, MenuButton, useModalDialog, usePopover } from "ui/control";
import SubscribeButtonMenu from "ui/control/subscribebutton/SubscribeButtonMenu";
import { tGender } from "i18n";
import "./SubscribeButton.css";

interface Props {
    nodeName: string;
    feedName: string;
    onDialogOpened?: () => void;
}

export function SubscribeButton({nodeName, feedName, onDialogOpened}: Props) {
    const card = useSelector((state: ClientState) => getNodeCard(state, nodeName));
    const homeOwnerName = useSelector(getHomeOwnerName);
    const homeGender = useSelector(getHomeOwnerGender);

    const loaded = card?.subscription.loaded && card?.friendship.loaded && card?.blocking.loaded;
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

    const blocked = blockedList != null && blockedList.filter(b => b.blockedOperation !== "instant").length > 0;
    const blockedBy = blockedByList != null && blockedByList.filter(b => b.blockedOperation !== "instant").length > 0;
    const blockedCaption = blocked
        ? t("blocked")
        : (blockedBy ? t("in-blocked") : null)

    const caption = blockedCaption ?? friendCaption ?? subscriptionCaption;

    const {overlayId: dialogOverlayId} = useModalDialog();
    const {overlayId: popoverOverlayId} = usePopover();
    const parentOverlayId = popoverOverlayId ?? dialogOverlayId;
    const dispatch = useDispatch();

    if (nodeName === homeOwnerName) {
        return null;
    }

    const onSubscribe = () => dispatch(feedSubscribe(nodeName, feedName));

    const onBlockingDetails = () => {
        if (homeOwnerName != null) {
            dispatch(openBlockingDetailsDialog(homeOwnerName, nodeName, null, null, !blocked && blockedBy));
        }
    }

    return (
        <span className="subscribe-button">
            {loaded &&
                (caption ?
                    (blocked || blockedBy ?
                        <button className="status blocked" onClick={onBlockingDetails}>{caption}</button>
                    :
                        <span className="status">{caption}</span>
                    )
                :
                    <Button variant="primary" className="status" onClick={onSubscribe}>{t("subscribe")}</Button>
                )
            }
            <DropdownMenu
                className="btn btn-sm"
                content={
                    <SubscribeButtonMenu nodeName={nodeName} feedName={feedName}/>
                }
                parentOverlayId={parentOverlayId}
                menuContainer={document.getElementById("modal-root")}
                onDialogOpened={onDialogOpened}
            >
                <MenuButton active/>
            </DropdownMenu>
        </span>
    );
}
