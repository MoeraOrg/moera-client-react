import React from 'react';
import cx from 'classnames';
import moment from 'moment';

import InstantIcon from "ui/instant/InstantIcon";
import "./InstantStory.css";

const InstantStory = ({story}) => (
    <a href="#" className={cx("instant", {"unread": !story.read})}>
        <div dangerouslySetInnerHTML={{__html: story.summary}}/>
        <div className="footer">
            <InstantIcon story={story}/>
            <span className="date">{moment.unix(story.publishedAt).fromNow(true)}</span>
        </div>
    </a>
);

export default InstantStory;
