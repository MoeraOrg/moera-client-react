import React from 'react';
import { connect } from 'react-redux';

import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';

import InstantIcon from "ui/instant/InstantIcon";
import Jump from "ui/navigation/Jump";
import { storyReadingUpdate } from "state/stories/actions";
import "./InstantStory.css";

function getStoryTarget(story) {
    switch(story.storyType) {
        case "reaction-added-positive":
        case "reaction-added-negative":
            return {nodeName: ":", href: `/post/${story.postingId}`}
        case "mention-posting":
        case "posting-task-failed":
            return {nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`}
        case "subscriber-added":
        case "subscriber-deleted":
            return {nodeName: story.remoteNodeName, href: "/"}
        case "comment-added":
            return {nodeName: ":", href: `/post/${story.postingId}?comment=${story.remoteCommentId}`}
        case "mention-comment":
        case "reply-comment":
        case "comment-reaction-added-positive":
        case "comment-reaction-added-negative":
        case "remote-comment-added":
        case "comment-task-failed":
            return {
                nodeName: story.remoteNodeName,
                href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
            }
        default:
            return {nodeName: ":", href: "/"}
    }
}

class InstantStory extends React.PureComponent {

    onJump = story => (href, performJump) => {
        const {hide, storyReadingUpdate} = this.props;

        hide();
        performJump();
        if (!story.read) {
            storyReadingUpdate(":instant", story.id, true);
        }
    }

    onEnvelope = () => {
        const {story, storyReadingUpdate} = this.props;
        storyReadingUpdate(":instant", story.id, !story.read);
    }

    render() {
        const {story, lastNew} = this.props;
        const {nodeName, href} = getStoryTarget(story);
        return (
            <div className={cx("instant", {"unread": !story.read, "last-new": lastNew})}>
                <div className="cursor">
                    <Jump nodeName={nodeName} href={href} trackingId={story.read ? null : story.trackingId}
                          onNear={this.onJump(story)} onFar={this.onJump(story)}>
                        <div dangerouslySetInnerHTML={{__html: story.summary}}/>
                        <div className="footer">
                            <InstantIcon story={story}/>
                            <span className="date">{formatDistanceToNow(fromUnixTime(story.publishedAt))}</span>
                        </div>
                    </Jump>
                    <div className="sidebar">
                        <span className="envelope" title={story.read ? "Mark as Unread" : "Mark as Read"}
                              onClick={this.onEnvelope}>
                            <FontAwesomeIcon icon={["far", story.read ? "envelope-open" : "envelope"]}/>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

}

export default connect(
    state => ({
        pulse: state.pulse.pulse // To force re-rendering only
    }),
    { storyReadingUpdate }
)(InstantStory);
