import React from 'react';
import PropType from 'prop-types';

import FeedCalendarButton from "ui/feed/FeedCalendarButton";
import FeedRewindButtons from "ui/feed/FeedRewindButtons";
import "./FeedPageHeader.css";

const FeedPageHeader = ({feedName, title, empty}) => (
    <div id="feed-header">
        <h2>{title}</h2>
        {!empty &&
            <div id="feed-buttons">
                <FeedCalendarButton feedName={feedName}/>
                <FeedRewindButtons feedName={feedName}/>
            </div>
        }
    </div>
);

FeedPageHeader.propTypes = {
    feedName: PropType.string,
    title: PropType.string,
    empty: PropType.bool
};

export default FeedPageHeader;
