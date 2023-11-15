import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { Loading } from "ui/control";
import Twemoji from "ui/twemoji/Twemoji";
import { reactionsDialogSelectTab } from "state/reactionsdialog/actions";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

const TotalsTabs = ({loading, loaded, total, emojis, activeTab, reactionsDialogSelectTab}: Props) => {
    const {t} = useTranslation();

    return (
        <>
            {loaded &&
                <div className="total-tabs">
                    <div className={cx("total", {"active": activeTab == null})}
                         onClick={() => reactionsDialogSelectTab(null)}>
                        {t("all")} {total}
                    </div>
                    {emojis.map(rt =>
                        <div key={rt.emoji} className={cx("total", {"active": activeTab === rt.emoji})}
                             onClick={() => reactionsDialogSelectTab(rt.emoji)}>
                            <Twemoji code={rt.emoji}/>{" "}{rt.total}
                        </div>
                    )}
                </div>
            }
            {loading && <Loading/>}
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        ...state.reactionsDialog.totals,
        activeTab: state.reactionsDialog.activeTab
    }),
    { reactionsDialogSelectTab }
);

export default connector(TotalsTabs);
