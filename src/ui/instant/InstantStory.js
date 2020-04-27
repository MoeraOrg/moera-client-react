import React from 'react';
import cx from 'classnames';
import moment from 'moment';

import InstantIcon from "ui/instant/InstantIcon";
import Jump from "ui/navigation/Jump";
import "./InstantStory.css";

function getStoryTarget(story) {
    switch(story.storyType) {
        case "reaction-added-positive":
        case "reaction-added-negative":
            return {nodeName: ":", href: `/post/${story.postingId}`}
        default:
            return {nodeName: ":", href: "/"}
    }
}

class InstantStory extends React.PureComponent {

    onJump = (href, performJump) => {
        this.props.hide();
        performJump();
    }

    render() {
        const {story} = this.props;
        const {nodeName, href} = getStoryTarget(story);
        return (
            <Jump nodeName={nodeName} href={href} className={cx("instant", {"unread": !story.read})}
                  onNear={this.onJump}>
                <div className="cursor">
                    <div dangerouslySetInnerHTML={{__html: story.summary}}/>
                    <div className="footer">
                        <InstantIcon story={story}/>
                        <span className="date">{moment.unix(story.publishedAt).fromNow(true)}</span>
                    </div>
                </div>
            </Jump>
        );
    }

}

export default InstantStory;
