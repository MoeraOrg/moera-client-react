import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';
import { formatISO, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { tDistanceToNow } from "i18n/time";
import { ClientState } from "state/state";
import { isHomeGooglePlayHiding } from "state/home/selectors";
import { storyReadingUpdate } from "state/stories/actions";
import { ExtStoryInfo } from "state/feeds/state";
import { getSetting } from "state/settings/selectors";
import Jump from "ui/navigation/Jump";
import { Avatar } from "ui/control";
import { getInstantTarget, getInstantTypeDetails } from "ui/instant/instant-types";
import InstantHtml from "ui/instant/InstantHtml";
import { REL_HOME } from "util/rel-node-name";
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
            dispatch(storyReadingUpdate(REL_HOME, "instant", story.id, true));
        }
    }

    const onEnvelope = () => dispatch(storyReadingUpdate(REL_HOME, "instant", story.id, !story.read));

    const {nodeName, href} = getInstantTarget(story);
    const buttons = getInstantTypeDetails(story.storyType)?.buttons;
    const readId = story.read ? null : story.id;

    const publishDate = fromUnixTime(story.publishedAt);

    return (
        <div className={cx("instant", {"unread": !story.read, "last-new": lastNew})}>
            {!googlePlayHiding || !story.hideSheriffMarked ?
                <>
                    {(profileLink && story.summaryNodeName != null) &&
                        <Jump nodeName={story.summaryNodeName} href="/profile" className="outer cells-avatar"/>
                    }
                    <Jump nodeName={nodeName} href={href} readId={readId} onNear={onJump} onFar={onJump}
                          className={cx("outer", {"cells-summary": profileLink, "cells-all": !profileLink})}/>
                    <div className="summary-avatar">
                        <Avatar avatar={story.summaryAvatar} ownerName={story.summaryNodeName} nodeName={REL_HOME}
                                size={36}/>
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
                    {tDistanceToNow(publishDate, t)}
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
