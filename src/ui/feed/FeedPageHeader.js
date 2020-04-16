import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import FeedCalendarButton from "ui/feed/FeedCalendarButton";
import FeedRewindButtons from "ui/feed/FeedRewindButtons";
import "./FeedPageHeader.css";

const FeedPageHeader = ({feedName, title, empty, atTop, atBottom, scrolled}) => (
    <div id="feed-header" className={cx({"feed-header-shadow": scrolled})}>
        <h2>{title}</h2>
        {!empty &&
            <div id="feed-buttons">
                <FeedCalendarButton feedName={feedName}/>
                <FeedRewindButtons feedName={feedName} atTop={atTop} atBottom={atBottom}/>
            </div>
        }
    </div>
);

FeedPageHeader.propTypes = {
    feedName: PropType.string,
    title: PropType.string,
    empty: PropType.bool,
    atTop: PropType.bool,
    atBottom: PropType.bool,
    scrolled: PropType.bool
};

export default FeedPageHeader;
