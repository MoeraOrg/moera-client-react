import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getFeedState } from "state/feeds/selectors";
import { feedPastSliceLoad, feedStatusUpdate } from "state/feeds/actions";
import { usePopover } from "ui/control";
import InstantStory from "ui/instant/InstantStory";
import InstantsSentinel from "ui/instant/InstantsSentinel";
import { REL_HOME } from "util/rel-node-name";
import { BUILD_NUMBER } from "build-number";
import "./Instants.css";

interface Props {
    instantBorder: number;
}

export default function Instants({instantBorder}: Props) {
    const loadingPast = useSelector((state: ClientState) => getFeedState(state, REL_HOME, "instant").loadingPast);
    const after = useSelector((state: ClientState) => getFeedState(state, REL_HOME, "instant").after);
    const stories = useSelector((state: ClientState) => getFeedState(state, REL_HOME, "instant").stories);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const pastIntersecting = useRef<boolean>(true);

    const {hide} = usePopover();

    const loadPast = () => {
        if (loadingPast || after <= Number.MIN_SAFE_INTEGER) {
            return;
        }
        dispatch(feedPastSliceLoad(REL_HOME, "instant"));
    }

    const onSentinelPast = (intersecting: boolean) => {
        pastIntersecting.current = intersecting;
        if (pastIntersecting.current) {
            loadPast();
        }
    }

    const onReadAll = () => {
        if (stories == null || stories.length === 0) {
            return;
        }
        dispatch(feedStatusUpdate(REL_HOME, "instant", null, true, stories[0].moment));
    }

    return (
        <div id="instants">
            <div className="header">
                <div className="title">{t("instants")}</div>
                <div className="action" onClick={onReadAll}>{t("mark-all-read")}</div>
            </div>
            <div className="content">
                {stories.map(story =>
                    <InstantStory key={story.moment} story={story} hide={hide}
                                  lastNew={story.moment === instantBorder}/>
                )}
                <InstantsSentinel loading={loadingPast} title={t("load-more")} margin="0px 0px 100px 0px"
                              visible={after > Number.MIN_SAFE_INTEGER} onSentinel={onSentinelPast} onClick={loadPast}/>
            </div>
            <div className="footer">
                <div className="build-number">rev {BUILD_NUMBER}</div>
            </div>
        </div>
    );
}
