import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { closeReactionsDialog, reactionsDialogPastReactionsLoad } from "state/reactionsdialog/actions";
import {
    getReactionsDialogItems,
    getReactionsDialogNodeName,
    getReactionsDialogRemainingCount,
    isReactionsDialogReactionsAllLoaded,
    isReactionsDialogReactionsLoading
} from "state/reactionsdialog/selectors";
import { AvatarWithPopup, CloseButton, Loading } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import Twemoji from "ui/twemoji/Twemoji";
import ReactionVerifyButton from "ui/reactionsdialog/ReactionVerifyButton";
import TotalsTabs from "ui/reactionsdialog/TotalsTabs";

interface Props {
    itemsRef?: React.LegacyRef<HTMLDivElement>;
    onSwitchView?: () => void;
}

export default function ReactionsListView({itemsRef, onSwitchView}: Props) {
    const postingId = useSelector((state: ClientState) => state.reactionsDialog.postingId);
    const commentId = useSelector((state: ClientState) => state.reactionsDialog.commentId);
    const reactionsNodeName = useSelector(getReactionsDialogNodeName);
    const remaining = useSelector(getReactionsDialogRemainingCount);
    const reactionsLoading = useSelector(isReactionsDialogReactionsLoading);
    const reactionsLoaded = useSelector(isReactionsDialogReactionsAllLoaded);
    const reactions = useSelector(getReactionsDialogItems);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    return (
        <>
            <div className="totals clearfix">
                <TotalsTabs/>
                <div className="topright">
                    <div className="switch-view" title={t("view-as-chart")} onClick={onSwitchView}>
                        <FontAwesomeIcon icon={faChartBar}/>
                    </div>
                    <CloseButton onClick={() => dispatch(closeReactionsDialog())}/>
                </div>
            </div>
            <div className="items" tabIndex={-1} ref={itemsRef}>
                {reactions.map(r =>
                    <div className="item" key={r.moment}>
                        <AvatarWithPopup ownerName={r.ownerName!} ownerFullName={r.ownerFullName} avatar={r.ownerAvatar}
                                         nodeName={reactionsNodeName} size={32}/>
                        <div className="owner-name">
                            <NodeName name={r.ownerName} fullName={r.ownerFullName} avatar={r.ownerAvatar}
                                      avatarNodeName={reactionsNodeName}/>
                            {" "}
                            {r.ownerName != null && r.signature != null && postingId != null &&
                                <ReactionVerifyButton postingId={postingId} commentId={commentId}
                                                      ownerName={r.ownerName}/>
                            }
                        </div>
                        <div className="emoji-end">{r.emoji != null && <Twemoji code={r.emoji}/>}</div>
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
            {reactionsLoading && <Loading/>}
        </>
    );
}
