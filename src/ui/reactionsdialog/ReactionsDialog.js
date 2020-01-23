import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { Loading, ModalDialog, NodeName, Twemoji } from "ui/control";
import { closeReactionsDialog, reactionsDialogSelectTab } from "state/reactionsdialog/actions";
import {
    getReactionsDialogItems,
    getReactionsDialogRemainingCount,
    isReactionsDialogReactionsLoading
} from "state/reactionsdialog/selectors";
import "./ReactionsDialog.css";
import ReactionVerifyButton from "ui/reactionsdialog/ReactionVerifyButton";

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

class ReactionsDialog extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (((!prevProps.show && this.props.show) || prevProps.activeTab !== this.props.activeTab) && this.itemsNode) {
            this.itemsNode.focus();
        }
    }

    render() {
        const {show, postingId, remaining, reactionsLoading, reactions, closeReactionsDialog} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog onClose={closeReactionsDialog}>
                <div className="reactions-dialog modal-body">
                    <div className="totals clearfix">
                        <TotalsTabs/>
                        <button type="button" className="close" onClick={closeReactionsDialog}>&times;</button>
                    </div>
                    <div className="items" tabIndex="-1" ref={dom => {this.itemsNode = dom}}>
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
                </div>
            </ModalDialog>
        );
    }

}

export default connect(
    state => ({
        show: state.reactionsDialog.show,
        postingId: state.reactionsDialog.postingId,
        activeTab: state.reactionsDialog.activeTab,
        remaining: getReactionsDialogRemainingCount(state),
        reactionsLoading: isReactionsDialogReactionsLoading(state),
        reactions: getReactionsDialogItems(state)
    }),
    { closeReactionsDialog }
)(ReactionsDialog);
