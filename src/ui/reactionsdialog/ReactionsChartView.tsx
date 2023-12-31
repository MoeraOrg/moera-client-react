import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { CloseButton, Loading } from "ui/control";
import Twemoji from "ui/twemoji/Twemoji";

interface Props {
    itemsRef?: React.LegacyRef<HTMLDivElement>;
    onSwitchView?: () => void;
}

export default function ReactionsChartView({itemsRef, onSwitchView}: Props) {
    const {loading, loaded, total, emojis} = useSelector((state: ClientState) => state.reactionsDialog.totals);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (!loaded) {
        return null;
    }

    return (
        <>
            <div className="totals clearfix">
                <div className="topright">
                    {onSwitchView &&
                        <div className="switch-view" title={t("view-as-list")} onClick={onSwitchView}>
                            <FontAwesomeIcon icon={faList}/>
                        </div>
                    }
                    <CloseButton onClick={() => dispatch(closeReactionsDialog())}/>
                </div>
            </div>
            <div className="items" tabIndex={-1} ref={itemsRef}>
                {total !== 0 &&
                    <div className="item">
                        <div className="all">{t("all")}</div>
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
            {loading && <Loading/>}
        </>
    );
}
