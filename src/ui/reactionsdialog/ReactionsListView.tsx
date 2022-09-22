import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

type Props = {
    itemsRef?: React.LegacyRef<HTMLDivElement>;
    onSwitchView?: () => void;
} & ConnectedProps<typeof connector>;

const ReactionsListView = ({itemsRef, onSwitchView, postingId, commentId, reactionsNodeName, remaining,
                            reactionsLoading, reactionsLoaded, reactions, closeReactionsDialog,
                            reactionsDialogPastReactionsLoad}: Props) => {
    const {t} = useTranslation();

    return (
        <>
            <div className="totals clearfix">
                <TotalsTabs/>
                <div className="topright">
                    <div className="switch-view" title={t("view-as-chart")} onClick={onSwitchView}>
                        <FontAwesomeIcon icon="chart-bar"/>
                    </div>
                    <CloseButton onClick={closeReactionsDialog}/>
                </div>
            </div>
            <div className="items" tabIndex={-1} ref={itemsRef}>
                {reactions.map(r =>
                    <div className="item" key={r.moment}>
                        <AvatarWithPopup ownerName={r.ownerName!} ownerFullName={r.ownerFullName} avatar={r.ownerAvatar}
                                         nodeName={reactionsNodeName ?? undefined} size={32}/>
                        <div className="owner-name">
                            <NodeName name={r.ownerName} fullName={r.ownerFullName} avatar={r.ownerAvatar}
                                      avatarNodeName={reactionsNodeName ?? undefined}/>
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
                    <button className="more" onClick={reactionsDialogPastReactionsLoad}>
                        {t("more-reactions", {remaining})}
                    </button>
                )
            }
            <Loading active={reactionsLoading}/>
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        postingId: state.reactionsDialog.postingId,
        commentId: state.reactionsDialog.commentId,
        reactionsNodeName: getReactionsDialogNodeName(state),
        remaining: getReactionsDialogRemainingCount(state),
        reactionsLoading: isReactionsDialogReactionsLoading(state),
        reactionsLoaded: isReactionsDialogReactionsAllLoaded(state),
        reactions: getReactionsDialogItems(state)
    }),
    { closeReactionsDialog, reactionsDialogPastReactionsLoad }
);

export default connector(ReactionsListView);
