import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { feedStatusUpdate } from "state/feeds/actions";
import { getFeedState } from "state/feeds/selectors";
import { useParent } from "ui/hook";
import { Icon, msClose } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import Instants from "ui/instant/Instants";
import { REL_HOME } from "util/rel-node-name";

export default function InstantsPopover() {
    const stories = useSelector((state: ClientState) => getFeedState(state, REL_HOME, "instant").stories);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const {hide} = useParent();

    const onSeeAll = (href: string, performJump: () => void) => {
        hide();
        performJump();
    }

    const onReadAll = () => {
        if (stories.length === 0) {
            return;
        }
        dispatch(feedStatusUpdate(REL_HOME, "instant", null, true, stories[0].moment));
    }

    return (
        <div id="instants">
            <div className="header">
                <Jump nodeName={REL_HOME} href="/instants" className="title" onNear={onSeeAll} onFar={onSeeAll}>
                    {t("instants")}
                </Jump>
                <button className="close" onClick={hide}>
                    <Icon icon={msClose} size={16}/>
                </button>
            </div>
            <div className="content">
                <Instants/>
            </div>
            <div className="footer">
                {stories.length > 0 && <button className="action" onClick={onReadAll}>{t("mark-all-read")}</button>}
            </div>
        </div>
    );
}
