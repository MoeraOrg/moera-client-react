import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Loading } from "ui/control";
import { Icon, msListAlt } from "ui/material-symbols";
import Twemoji from "ui/twemoji/Twemoji";
import TotalsTabs from "ui/reactionsdialog/TotalsTabs";
import "./ReactionsChartView.css";

interface Props {
    itemsRef?: React.LegacyRef<HTMLDivElement>;
    onSwitchView?: () => void;
}

export default function ReactionsChartView({itemsRef, onSwitchView}: Props) {
    const {loading, loaded, total, emojis} = useSelector((state: ClientState) => state.reactionsDialog.totals);
    const {t} = useTranslation();

    if (!loaded) {
        return null;
    }

    return (
        <>
            <TotalsTabs hidden>
                {onSwitchView &&
                    <button className="switch-view" title={t("view-as-list")} onClick={onSwitchView}>
                        <Icon icon={msListAlt}/>
                    </button>
                }
            </TotalsTabs>
            <div className="items chart" tabIndex={-1} ref={itemsRef}>
                {total !== 0 &&
                    <div className="caption">
                        <div className="all">{t("total")}</div>
                        <div className="total">{total}</div>
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
            {loading && <Loading overlay large/>}
        </>
    );
}
