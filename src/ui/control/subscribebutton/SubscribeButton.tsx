import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { feedSubscribe } from "state/feeds/actions";
import { openBlockingDetailsDialog } from "state/blockingdetailsdialog/actions";
import { Button, DropdownMenu, MenuButton, useModalDialog, usePopover } from "ui/control";
import { getSubscriptionStatus } from "ui/control/subscribebutton/subscription-status";
import SubscribeButtonMenu from "ui/control/subscribebutton/SubscribeButtonMenu";
import "./SubscribeButton.css";

interface Props {
    nodeName: string;
    feedName: string;
    onDialogOpened?: () => void;
    sharing?: boolean;
    buttonOnly?: boolean;
}

export function SubscribeButton({nodeName, feedName, onDialogOpened, sharing, buttonOnly}: Props) {
    const card = useSelector((state: ClientState) => getNodeCard(state, nodeName));
    const homeOwnerName = useSelector(getHomeOwnerName);
    const homeGender = useSelector(getHomeOwnerGender);
    const {t} = useTranslation();

    const loaded = card?.subscription.loaded && card?.friendship.loaded && card?.blocking.loaded;
    const {caption, blocked, blockedBy} = getSubscriptionStatus(card, homeGender, t);

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
            {loaded && !buttonOnly &&
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
                    <SubscribeButtonMenu nodeName={nodeName} feedName={feedName} sharing={sharing}/>
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
