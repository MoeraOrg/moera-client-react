import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
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
import { Icon, msCircleFilled } from "ui/material-symbols";
import { getInstantTarget, getInstantTypeDetails } from "ui/instant/instant-types";
import InstantHtml from "ui/instant/InstantHtml";
import { REL_HOME } from "util/rel-node-name";
import "./InstantStory.css";

interface Props {
    story: ExtStoryInfo;
    hide: () => void;
}

export default function InstantStory({story, hide}: Props) {
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
        <div className={cx("instant", {"unread": !story.read})}>
            {!googlePlayHiding || !story.hideSheriffMarked ?
                <>
                    {(profileLink && story.summaryNodeName != null) &&
                        <Jump nodeName={story.summaryNodeName} href="/" className="outer cells-avatar"/>
                    }
                    {!profileLink &&
                        <Jump nodeName={nodeName} href={href} readId={readId} onNear={onJump} onFar={onJump}
                              className="outer cells-avatar"/>
                    }
                    <Jump nodeName={nodeName} href={href} readId={readId} onNear={onJump} onFar={onJump}
                          className="outer cells-summary"/>
                    <Jump nodeName={nodeName} href={href} readId={readId} onNear={onJump} onFar={onJump}
                          className="outer cells-date"/>

                    <div className="summary-avatar">
                        <Avatar avatar={story.summaryAvatar} ownerName={story.summaryNodeName} nodeName={REL_HOME}
                                size={40}/>
                    </div>
                    <div className="summary">
                        <InstantHtml story={story}/>
                    </div>
                </>
            :
                <>
                    <div className="summary-avatar">
                        <Avatar avatar={null} ownerName={null} size={40}/>
                    </div>
                    <div className="summary">
                        {t("content-not-accessible-android")}
                    </div>
                </>
            }
            {buttons && React.createElement(buttons, {story, hide})}
            <div className="footer">
                <time className="date" dateTime={formatISO(publishDate)}>
                    {tDistanceToNow(publishDate, t)}
                </time>
            </div>
            <div className="sidebar only-desktop">
                {!story.read &&
                    <span className="envelope" title={t("mark-read")} onClick={onEnvelope}>
                        <Icon icon={msCircleFilled} size={12}/>
                    </span>
                }
            </div>
        </div>
    );
}
