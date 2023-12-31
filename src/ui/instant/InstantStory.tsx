import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';
import { formatDistanceToNow, formatISO, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { getDateFnsLocale } from "i18n";
import { ClientState } from "state/state";
import { isHomeGooglePlayHiding } from "state/home/selectors";
import { storyReadingUpdate } from "state/stories/actions";
import { ExtStoryInfo } from "state/feeds/state";
import { getSetting } from "state/settings/selectors";
import Jump from "ui/navigation/Jump";
import { Avatar } from "ui/control";
import { getInstantTarget, getInstantTypeDetails } from "ui/instant/instant-types";
import InstantHtml from "ui/instant/InstantHtml";
import "./InstantStory.css";

interface Props {
    story: ExtStoryInfo;
    lastNew: boolean;
    hide: () => void;
}

export default function InstantStory({story, lastNew, hide}: Props) {
    useSelector((state: ClientState) => state.pulse.pulse); // To force re-rendering only
    const profileLink = useSelector((state: ClientState) => getSetting(state, "instants.profile-link") as boolean);
    const googlePlayHiding = useSelector(isHomeGooglePlayHiding);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onJump = (_: string, performJump: () => void) => {
        hide();
        performJump();
        if (!story.read) {
            dispatch(storyReadingUpdate(":instant", story.id, true));
        }
    }

    const onEnvelope = () => dispatch(storyReadingUpdate(":instant", story.id, !story.read));

    const {nodeName, href} = getInstantTarget(story);
    const buttons = getInstantTypeDetails(story.storyType)?.buttons;
    const trackingId = story.read ? null : story.trackingId;

    const publishDate = fromUnixTime(story.publishedAt);

    return (
        <div className={cx("instant", {"unread": !story.read, "last-new": lastNew})}>
            {!googlePlayHiding || !story.hideSheriffMarked ?
                <>
                    {profileLink &&
                        <Jump nodeName={story.summaryNodeName} href="/profile" className="outer cells-avatar"/>
                    }
                    <Jump nodeName={nodeName} href={href} trackingId={trackingId} onNear={onJump} onFar={onJump}
                          className={cx("outer", {"cells-summary": profileLink, "cells-all": !profileLink})}/>
                    <div className="summary-avatar">
                        <Avatar avatar={story.summaryAvatar} ownerName={story.summaryNodeName} nodeName=":" size={36}/>
                    </div>
                    <div className="summary">
                        <InstantHtml story={story}/>
                    </div>
                </>
            :
                <>
                    <div className="summary-avatar">
                        <Avatar avatar={null} ownerName={null} size={36}/>
                    </div>
                    <div className="summary">
                        {t("content-not-accessible-android")}
                    </div>
                </>
            }
            <div className="footer">
                <time className="date" dateTime={formatISO(publishDate)}>
                    {formatDistanceToNow(publishDate, {locale: getDateFnsLocale()})}
                </time>
            </div>
            {buttons && React.createElement(buttons, {story, hide})}
            <div className="sidebar">
                <span className="envelope" title={story.read ? t("mark-unread") : t("mark-read")}
                      onClick={onEnvelope}>
                    <FontAwesomeIcon icon={story.read ? faEnvelopeOpen : faEnvelope}/>
                </span>
            </div>
        </div>
    );
}
