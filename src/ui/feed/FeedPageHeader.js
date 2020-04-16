import React from 'react';
import PropType from 'prop-types';

import FeedCalendarButton from "ui/feed/FeedCalendarButton";
import FeedRewindButtons from "ui/feed/FeedRewindButtons";
import "./FeedPageHeader.css";

const FeedPageHeader = ({feedName, title, empty, atTop, atBottom}) => (
    <div id="feed-header">
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
    atBottom: PropType.bool
};

export default FeedPageHeader;
