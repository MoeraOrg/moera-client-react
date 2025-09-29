import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { feedSubscribe } from "state/feeds/actions";
import { openBlockingDetailsDialog } from "state/blockingdetailsdialog/actions";
import { Button, DropdownMenu, MenuButton } from "ui/control";
import { MenuItem } from "ui/control/dropdownmenu/dropdown-menu-types";
import { getSubscriptionStatus } from "ui/control/subscribebutton/subscription-status";
import SubscribeButtonMenu from "ui/control/subscribebutton/SubscribeButtonMenu";
import { useParent } from "ui/hook";
import "./SubscribeButton.css";

interface Props {
    nodeName: string;
    feedName: string;
    onDialogOpened?: () => void;
    addon?: MenuItem[];
    buttonOnly?: boolean;
}

export function SubscribeButton({nodeName, feedName, onDialogOpened, addon, buttonOnly}: Props) {
    const card = useSelector((state: ClientState) => getNodeCard(state, nodeName));
    const homeOwnerName = useSelector(getHomeOwnerName);
    const homeGender = useSelector(getHomeOwnerGender);
    const {t} = useTranslation();

    const loaded = card?.subscription.loaded && card?.friendship.loaded && card?.blocking.loaded;
    const {caption, blocked, blockedBy} = getSubscriptionStatus(card, homeGender, t);

    const {overlayId: parentOverlayId} = useParent();
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
                    <SubscribeButtonMenu nodeName={nodeName} feedName={feedName} addon={addon}/>
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
