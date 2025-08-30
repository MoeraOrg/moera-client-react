import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { feedStatusUpdate } from "state/feeds/actions";
import { getFeedState } from "state/feeds/selectors";
import { usePopover } from "ui/control";
import { Icon, msClose } from "ui/material-symbols";
import Instants from "ui/instant/Instants";
import { REL_HOME } from "util/rel-node-name";
import { BUILD_NUMBER } from "build-number";

interface Props {
    instantBorder: number;
}

export default function InstantsPopover({instantBorder}: Props) {
    const stories = useSelector((state: ClientState) => getFeedState(state, REL_HOME, "instant").stories);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const {hide} = usePopover();

    const onReadAll = () => {
        if (stories.length === 0) {
            return;
        }
        dispatch(feedStatusUpdate(REL_HOME, "instant", null, true, stories[0].moment));
    }

    return (
        <div id="instants">
            <div className="header">
                <div className="title">{t("instants")}</div>
                <button className="close" onClick={hide}>
                    <Icon icon={msClose} size={16}/>
                </button>
            </div>
            <div className="content">
                <Instants instantBorder={instantBorder}/>
            </div>
            <div className="footer">
                <div className="build-number">rev {BUILD_NUMBER}</div>
                {stories.length > 0 && <button className="action" onClick={onReadAll}>{t("mark-all-read")}</button>}
            </div>
        </div>
    );
}
