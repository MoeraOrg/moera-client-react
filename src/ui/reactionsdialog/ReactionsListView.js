import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { Loading, NodeName, Twemoji } from "ui/control";
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
                    <div className="emoji"><Twemoji code={r.emoji}/></div>
                    <div className="owner-name">
                        <NodeName name={r.ownerName}/>
                        {" "}
                        <ReactionVerifyButton postingId={postingId} commentId={commentId} ownerName={r.ownerName}/>
                    </div>
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
