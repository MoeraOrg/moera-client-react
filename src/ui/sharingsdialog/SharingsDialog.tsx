import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NodeName as Name, SharingInfo } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerGender, isConnectedToHome } from "state/home/selectors";
import { closeSharingsDialog, sharingsDialogPastSharingsLoad } from "state/sharingsdialog/actions";
import {
    getSharingsDialogNodeName,
    getSharingsDialogRemainingCount,
    isSharingsDialogAllLoaded
} from "state/sharingsdialog/selectors";
import { useDispatcher } from "ui/hook";
import { Avatar, ModalDialog, SubscribeButton } from "ui/control";
import { getSubscriptionStatus } from "ui/control/subscribebutton/subscription-status";
import NodeName from "ui/nodename/NodeName";
import Jump from "ui/navigation/Jump";
import { ut } from "util/url";
import "./SharingsDialog.css";

export default function SharingsDialog() {
    const connectedToHome = useSelector(isConnectedToHome);
    const {
        nodeName, postingId, loading, loaded, after, items
    } = useSelector((state: ClientState) => state.sharingsDialog);
    const sharingsNodeName = useSelector(getSharingsDialogNodeName);
    const remaining = useSelector(getSharingsDialogRemainingCount);
    const allLoaded = useSelector(isSharingsDialogAllLoaded);
    const cards = useSelector((state: ClientState) => state.nodeCards.cards);
    const homeGender = useSelector(getHomeOwnerGender);
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    const statuses = useMemo(() =>
        items.map(item => getSubscriptionStatus(cards[item.remoteNodeName] ?? null, homeGender, t)),
        [cards, homeGender, items, t]
    );

    const onClose = () => dispatch(closeSharingsDialog());

    const onJump = (_: string, performJump: () => void) => {
        onClose();
        performJump();
    }

    const onLoadMore = () => {
        if (postingId != null) {
            dispatch(sharingsDialogPastSharingsLoad(nodeName, postingId, after));
        }
    }

    return (
        <ModalDialog title={t("sharings")} className="sharings-dialog" loading={loading} onClose={onClose} expand>
            <div className="modal-body">
                <div className="items list">
                    {items.map((sharing, i) =>
                        <div className="item" key={sharing.id}>
                            <Jump nodeName={sharing.remoteNodeName} href={sharingHref(sharing)}
                                  onNear={onJump} onFar={onJump}>
                                <Avatar avatar={sharing.remoteAvatar} ownerName={sharing.remoteNodeName} size={48}
                                        nodeName={sharingsNodeName}/>
                            </Jump>
                            <Jump nodeName={sharing.remoteNodeName} href={sharingHref(sharing)} className="details"
                                  onNear={onJump} onFar={onJump}>
                                <div className="owner-name">
                                    <NodeName name={sharing.remoteNodeName} fullName={sharing.remoteFullName}
                                              sourceUri={sharing.remoteSourceUri} avatar={sharing.remoteAvatar}
                                              avatarNodeName={sharingsNodeName} popup={false} linked={false}/>
                                </div>
                                <div className="status">
                                    {connectedToHome
                                        ? statuses[i]?.caption ?? ""
                                        : Name.shorten(sharing.remoteNodeName)
                                    }
                                </div>
                            </Jump>
                            {connectedToHome ?
                                <SubscribeButton nodeName={sharing.remoteNodeName} feedName="timeline" buttonOnly/>
                            :
                                <span className="subscribe-button"/>
                            }
                        </div>
                    )}
                    {loaded && items.length === 0 && <div className="modal-empty">{t("no-sharings")}</div>}
                </div>
                {!loading &&
                    (allLoaded ?
                        remaining > 0 && <div className="more">{t("more-sharings-hidden", {remaining})}</div>
                    :
                        <button type="button" className="more" onClick={onLoadMore}>
                            {remaining > 0 ? t("more-sharings", {remaining}) : t("load-more")}
                        </button>
                    )
                }
            </div>
        </ModalDialog>
    );
}

function sharingHref(sharing: SharingInfo): string {
    return ut`/?before=${sharing.remoteStoryMoment}`;
}
