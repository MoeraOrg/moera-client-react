import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { AvatarWithPopup, Loading } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import Twemoji from "ui/twemoji/Twemoji";
import ReactionVerifyButton from "ui/reactionsdialog/ReactionVerifyButton";
import TotalsTabs from "ui/reactionsdialog/TotalsTabs";
import {
    getReactionsDialogItems,
    getReactionsDialogRemainingCount,
    isReactionsDialogReactionsLoading
} from "state/reactionsdialog/selectors";

const ReactionsListView = ({postingId, commentId, itemsRef, onSwitchView, remaining, reactionsLoading, reactions,
                            closeReactionsDialog}) => (
    <>
        <div className="totals clearfix">
            <TotalsTabs/>
            <div className="topright">
                <div className="switch-view" title="View as chart" onClick={onSwitchView}>
                    <FontAwesomeIcon icon="chart-bar"/>
                </div>
                <button type="button" className="close" onClick={closeReactionsDialog}>&times;</button>
            </div>
        </div>
        <div className="items" tabIndex="-1" ref={itemsRef}>
            {reactions.map(r =>
                <div className="item" key={r.moment}>
                    <AvatarWithPopup ownerName={r.ownerName} ownerFullName={r.ownerFullName} avatar={r.ownerAvatar}
                                     size={32}/>
                    <div className="owner-name">
                        <NodeName name={r.ownerName} fullName={r.ownerFullName}/>
                        {" "}
                        {r.signature &&
                            <ReactionVerifyButton postingId={postingId} commentId={commentId} ownerName={r.ownerName}/>
                        }
                    </div>
                    <div className="emoji-end"><Twemoji code={r.emoji}/></div>
                </div>
            )}
        </div>
        {remaining > 0 && !reactionsLoading && <div className="more">{remaining} more</div>}
        <Loading active={reactionsLoading}/>
    </>
);

export default connect(
    state => ({
        postingId: state.reactionsDialog.postingId,
        commentId: state.reactionsDialog.commentId,
        remaining: getReactionsDialogRemainingCount(state),
        reactionsLoading: isReactionsDialogReactionsLoading(state),
        reactions: getReactionsDialogItems(state)
    }),
    { closeReactionsDialog }
)(ReactionsListView);
