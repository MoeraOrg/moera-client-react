import React from 'react';
import { connect } from 'react-redux';

import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loading, Twemoji } from "ui/control";

const ReactionsChartView = ({itemsRef, onSwitchView, loading, loaded, total, emojis, closeReactionsDialog}) => (
    loaded &&
        <>
            <div className="totals clearfix">
                <div className="topright">
                    {onSwitchView &&
                        <div className="switch-view" title="View as list" onClick={onSwitchView}>
                            <FontAwesomeIcon icon="list"/>
                        </div>
                    }
                    <button type="button" className="close" onClick={closeReactionsDialog}>&times;</button>
                </div>
            </div>
            <div className="items" tabIndex="-1" ref={itemsRef}>
                {total !== 0 &&
                    <div className="item">
                        <div className="all">All</div>
                        <div className="total">{total}</div>
                        <div className="bar"/>
                    </div>
                }
                {emojis
                    .map(t => ({
                        ...t,
                        percent: t.share != null ? t.share * 100 : t.total * 100 / total
                    }))
                    .map(t =>
                        <div className="item" key={t.emoji}>
                            <div className="emoji"><Twemoji code={t.emoji}/></div>
                            <div className="share">{t.percent.toFixed(1)}%</div>
                            {t.total && <div className="total">{t.total}</div>}
                            <div className="bar">
                                <div className="bar-left" style={{width: t.percent.toFixed(1) + "%"}}/>
                                <div className="bar-right"/>
                            </div>
                        </div>
                    )
                }
            </div>
            <Loading active={loading}/>
        </>
);

export default connect(
    state => ({
        ...state.reactionsDialog.totals,
    }),
    { closeReactionsDialog }
)(ReactionsChartView);
