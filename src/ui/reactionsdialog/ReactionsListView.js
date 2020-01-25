import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { closeReactionsDialog, reactionsDialogSelectTab } from "state/reactionsdialog/actions";
import { Loading, NodeName, Twemoji } from "ui/control";
import ReactionVerifyButton from "ui/reactionsdialog/ReactionVerifyButton";
import {
    getReactionsDialogItems,
    getReactionsDialogRemainingCount,
    isReactionsDialogReactionsLoading
} from "state/reactionsdialog/selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TotalsTabsImpl = ({loading, loaded, total, emojis, activeTab, reactionsDialogSelectTab}) => (
    <>
        {loaded &&
        <div className="total-tabs">
            <div className={cx("total", {"active": activeTab == null})}
                 onClick={() => reactionsDialogSelectTab(null)}>
                All {total}
            </div>
            {emojis.map(rt =>
                <div key={rt.emoji} className={cx("total", {"active": activeTab === rt.emoji})}
                     onClick={() => reactionsDialogSelectTab(rt.emoji)}>
                    <Twemoji code={rt.emoji}/>{" "}{rt.total}
                </div>
            )}
        </div>
        }
        <Loading active={loading}/>
    </>
);

const TotalsTabs = connect(
    state => ({
        ...state.reactionsDialog.totals,
        activeTab: state.reactionsDialog.activeTab
    }),
    { reactionsDialogSelectTab }
)(TotalsTabsImpl);

const ReactionsListView = ({postingId, itemsRef, onSwitchView, remaining, reactionsLoading, reactions,
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
                        <ReactionVerifyButton postingId={postingId} ownerName={r.ownerName}/>
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
        remaining: getReactionsDialogRemainingCount(state),
        reactionsLoading: isReactionsDialogReactionsLoading(state),
        reactions: getReactionsDialogItems(state)
    }),
    { closeReactionsDialog }
)(ReactionsListView);
