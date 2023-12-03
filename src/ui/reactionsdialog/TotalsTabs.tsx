import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { Loading } from "ui/control";
import Twemoji from "ui/twemoji/Twemoji";
import { reactionsDialogSelectTab } from "state/reactionsdialog/actions";
import { ClientState } from "state/state";

export default function TotalsTabs() {
    const {loading, loaded, total, emojis} = useSelector((state: ClientState) => state.reactionsDialog.totals);
    const activeTab = useSelector((state: ClientState) => state.reactionsDialog.activeTab);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    return (
        <>
            {loaded &&
                <div className="total-tabs">
                    <div className={cx("total", {"active": activeTab == null})}
                         onClick={() => dispatch(reactionsDialogSelectTab(null))}>
                        {t("all")} {total}
                    </div>
                    {emojis.map(rt =>
                        <div key={rt.emoji} className={cx("total", {"active": activeTab === rt.emoji})}
                             onClick={() => dispatch(reactionsDialogSelectTab(rt.emoji))}>
                            <Twemoji code={rt.emoji}/>{" "}{rt.total}
                        </div>
                    )}
                </div>
            }
            {loading && <Loading/>}
        </>
    );
}
