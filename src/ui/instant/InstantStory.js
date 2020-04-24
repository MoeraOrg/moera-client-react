import React from 'react';
import cx from 'classnames';

import "./InstantStory.css";

const InstantStory = ({story}) => (
    <a href="#" className={cx("instant", {"unread": !story.read})} dangerouslySetInnerHTML={{__html: story.summary}}/>
);

export default InstantStory;
