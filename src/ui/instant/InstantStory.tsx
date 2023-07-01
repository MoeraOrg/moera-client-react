import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

type Props = {
    story: ExtStoryInfo;
    lastNew: boolean;
    hide: () => void;
} & ConnectedProps<typeof connector>;

function InstantStory({story, lastNew, hide, profileLink, googlePlayHiding, storyReadingUpdate}: Props) {
    const {t} = useTranslation();

    const onJump = (href: string, performJump: () => void) => {
        hide();
        performJump();
        if (!story.read) {
            storyReadingUpdate(":instant", story.id, true);
        }
    }

    const onEnvelope = () => storyReadingUpdate(":instant", story.id, !story.read);

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
                    <FontAwesomeIcon icon={["far", story.read ? "envelope-open" : "envelope"]}/>
                </span>
            </div>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        pulse: state.pulse.pulse, // To force re-rendering only
        profileLink: getSetting(state, "instants.profile-link") as boolean,
        googlePlayHiding: isHomeGooglePlayHiding(state)
    }),
    { storyReadingUpdate }
);

export default connector(InstantStory);
