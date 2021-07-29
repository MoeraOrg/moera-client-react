import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ClientState } from "state/state";
import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { Loading } from "ui/control";
import Twemoji from "ui/twemoji/Twemoji";

type Props = {
    itemsRef?: React.LegacyRef<HTMLDivElement>;
    onSwitchView?: () => void;
} & ConnectedProps<typeof connector>;

const ReactionsChartView = ({itemsRef, onSwitchView, loading, loaded, total, emojis, closeReactionsDialog}: Props) => (
    loaded ?
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
            <div className="items" tabIndex={-1} ref={itemsRef}>
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
                        percent: t.share != null ? t.share * 100 : (t.total != null ? t.total * 100 / total : 0)
                    }))
                    .map(t =>
                        <div className="item" key={t.emoji}>
                            <div className="emoji-type"><Twemoji code={t.emoji}/></div>
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
    :
        null
);

const connector = connect(
    (state: ClientState) => ({
        ...state.reactionsDialog.totals,
    }),
    { closeReactionsDialog }
);

export default connector(ReactionsChartView);
