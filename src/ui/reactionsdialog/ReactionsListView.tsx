import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NodeName as Name } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerGender, isConnectedToHome } from "state/home/selectors";
import { reactionsDialogPastReactionsLoad } from "state/reactionsdialog/actions";
import {
    getReactionsDialogItems,
    getReactionsDialogNodeName,
    getReactionsDialogRemainingCount,
    isReactionsDialogReactionsAllLoaded,
    isReactionsDialogReactionsLoading
} from "state/reactionsdialog/selectors";
import { Avatar, Loading, SubscribeButton } from "ui/control";
import { getSubscriptionStatus, SubscriptionStatus } from "ui/control/subscribebutton/subscription-status";
import { useParent } from "ui/hook";
import { Icon, msFinance } from "ui/material-symbols";
import Twemoji from "ui/twemoji/Twemoji";
import NodeName from "ui/nodename/NodeName";
import Jump from "ui/navigation/Jump";
import TotalsTabs from "ui/reactionsdialog/TotalsTabs";
import ReactionVerifyButton from "ui/reactionsdialog/ReactionVerifyButton";
import "./ReactionsListView.css";

interface Props {
    itemsRef?: React.LegacyRef<HTMLDivElement>;
    onSwitchView?: () => void;
}

export default function ReactionsListView({itemsRef, onSwitchView}: Props) {
    const connectedToHome = useSelector(isConnectedToHome);
    const postingId = useSelector((state: ClientState) => state.reactionsDialog.postingId);
    const commentId = useSelector((state: ClientState) => state.reactionsDialog.commentId);
    const reactionsNodeName = useSelector(getReactionsDialogNodeName);
    const remaining = useSelector(getReactionsDialogRemainingCount);
    const reactionsLoading = useSelector(isReactionsDialogReactionsLoading);
    const reactionsLoaded = useSelector(isReactionsDialogReactionsAllLoaded);
    const reactions = useSelector(getReactionsDialogItems);
    const {hide} = useParent();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const cards = useSelector((state: ClientState) => state.nodeCards.cards);
    const homeGender = useSelector(getHomeOwnerGender);
    const statuses = useMemo<(SubscriptionStatus | null)[]>(() =>
        reactions.map(r => r.ownerName ? getSubscriptionStatus(cards[r.ownerName] ?? null, homeGender, t) : null),
        [cards, homeGender, reactions, t]
    );

    const onJump = (_: string, performJump: () => void) => {
        hide();
        performJump();
    }

    return (
        <>
            <TotalsTabs>
                {onSwitchView &&
                    <button className="switch-view" title={t("view-as-chart")} onClick={onSwitchView}>
                        <Icon icon={msFinance}/>
                    </button>
                }
            </TotalsTabs>
            <div className="items list" tabIndex={-1} ref={itemsRef}>
                {reactions.map((r, i) =>
                    <div className="item" key={r.moment}>
                        <Jump nodeName={r.ownerName!} href="/" onNear={onJump} onFar={onJump}>
                            <Avatar avatar={r.ownerAvatar} ownerName={r.ownerName!} size={48}
                                    nodeName={reactionsNodeName}/>
                        </Jump>
                        <div className="details">
                            <div className="owner-name">
                                <NodeName name={r.ownerName} fullName={r.ownerFullName} avatar={r.ownerAvatar}
                                          avatarNodeName={reactionsNodeName} popup={false} onJump={onJump}/>
                                {r.ownerName != null && r.signature != null && postingId != null &&
                                    <ReactionVerifyButton postingId={postingId} commentId={commentId}
                                                          ownerName={r.ownerName}/>
                                }
                            </div>
                            <div className="status">
                                {connectedToHome ? statuses[i]?.caption ?? "" : Name.shorten(r.ownerName)}
                            </div>
                        </div>
                        <div className="reaction">{r.emoji != null && <Twemoji code={r.emoji}/>}</div>
                        {r.ownerName && connectedToHome ?
                            <SubscribeButton nodeName={r.ownerName} feedName="timeline" buttonOnly/>
                        :
                            <span className="subscribe-button"/>
                        }
                    </div>
                )}
            </div>
            {remaining > 0 && !reactionsLoading &&
                (reactionsLoaded ?
                    <div className="more">
                        {t("more-reactions-hidden", {remaining})}
                    </div>
                :
                    <button className="more" onClick={() => dispatch(reactionsDialogPastReactionsLoad())}>
                        {t("more-reactions", {remaining})}
                    </button>
                )
            }
            {reactionsLoading && <Loading overlay large/>}
        </>
    );
}
