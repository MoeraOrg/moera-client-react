import React, { useEffect, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getFeedState } from "state/feeds/selectors";
import { feedPastSliceLoad, feedStatusUpdate } from "state/feeds/actions";
import { bodyScrollUpdate, swipeRefreshUpdate } from "state/navigation/actions";
import InstantStory from "ui/instant/InstantStory";
import InstantsSentinel from "ui/instant/InstantsSentinel";
import { BUILD_NUMBER } from "build-number";
import "./Instants.css";

type Props = {
    hide: () => void;
    instantBorder: number;
} & ConnectedProps<typeof connector>;

function Instants({hide, instantBorder, loadingPast, after, stories, feedPastSliceLoad, feedStatusUpdate,
                   swipeRefreshUpdate, bodyScrollUpdate}: Props) {
    const {t} = useTranslation();

    const pastIntersecting = useRef<boolean>(true);

    useEffect(() => {
        window.closeLightDialog = hide;
        if (window.Android) {
            swipeRefreshUpdate();
        }
        bodyScrollUpdate();

        return () => {
            window.closeLightDialog = null;
            if (window.Android) {
                swipeRefreshUpdate();
            }
            bodyScrollUpdate();
        }
    }, [hide, swipeRefreshUpdate, bodyScrollUpdate]);

    const loadPast = () => {
        if (loadingPast || after <= Number.MIN_SAFE_INTEGER) {
            return;
        }
        feedPastSliceLoad(":instant");
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
        feedStatusUpdate(":instant", null, true, stories[0].moment);
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

const connector = connect(
    (state: ClientState) => ({
        loadingPast: getFeedState(state, ":instant").loadingPast,
        after: getFeedState(state, ":instant").after,
        stories: getFeedState(state, ":instant").stories
    }),
    { feedPastSliceLoad, feedStatusUpdate, swipeRefreshUpdate, bodyScrollUpdate }
);

export default connector(Instants);
