import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { Loading } from "ui/control";
import Twemoji from "ui/twemoji/Twemoji";
import { reactionsDialogSelectTab } from "state/reactionsdialog/actions";

const TotalsTabs = ({loading, loaded, total, emojis, activeTab, reactionsDialogSelectTab}) => (
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

export default connect(
    state => ({
        ...state.reactionsDialog.totals,
        activeTab: state.reactionsDialog.activeTab
    }),
    { reactionsDialogSelectTab }
)(TotalsTabs);
