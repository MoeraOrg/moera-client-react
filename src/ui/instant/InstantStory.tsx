import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';

import InstantIcon from "ui/instant/InstantIcon";
import Jump from "ui/navigation/Jump";
import { Avatar } from "ui/control";
import { storyReadingUpdate } from "state/stories/actions";
import { getInstantTarget } from "ui/instant/instant-types";
import InstantHtml from "ui/instant/InstantHtml";
import { ClientState } from "state/state";
import { StoryInfo } from "api/node/api-types";
import "./InstantStory.css";

type Props = {
    story: StoryInfo;
    lastNew: boolean;
    hide: () => void;
} & ConnectedProps<typeof connector>;

function InstantStory({story, lastNew, hide, storyReadingUpdate}: Props) {
    const onJump = (href: string, performJump: () => void) => {
        hide();
        performJump();
        if (!story.read) {
            storyReadingUpdate(":instant", story.id, true);
        }
    }

    const onEnvelope = () => storyReadingUpdate(":instant", story.id, !story.read);

    const {nodeName, href} = getInstantTarget(story);
    const trackingId = story.read ? null : story.trackingId;

    return (
        <div className={cx("instant", {"unread": !story.read, "last-new": lastNew})}>
            <Jump nodeName={nodeName} href={href} trackingId={trackingId} className="summary-avatar"
                  onNear={onJump} onFar={onJump}>
                <Avatar avatar={story.summaryAvatar} ownerName={story.remoteNodeName} nodeName=":" size={36}/>
            </Jump>
            <Jump nodeName={nodeName} href={href} trackingId={trackingId} className="summary"
                  onNear={onJump} onFar={onJump}>
                <InstantHtml html={story.summary}/>
            </Jump>
            <div className="footer">
                <InstantIcon story={story}/>
                <span className="date">{formatDistanceToNow(fromUnixTime(story.publishedAt))}</span>
            </div>
            <div className="sidebar">
                <span className="envelope" title={story.read ? "Mark as Unread" : "Mark as Read"}
                      onClick={onEnvelope}>
                    <FontAwesomeIcon icon={["far", story.read ? "envelope-open" : "envelope"]}/>
                </span>
            </div>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        pulse: state.pulse.pulse // To force re-rendering only
    }),
    { storyReadingUpdate }
);

export default connector(InstantStory);
