import React from 'react';
import PropType from 'prop-types';

import FeedNewButton from "ui/feed/FeedNewButton";
import FeedCalendarButton from "ui/feed/FeedCalendarButton";
import FeedRewindButtons from "ui/feed/FeedRewindButtons";
import "./FeedPageHeader.css";

const FeedPageHeader = ({feedName, title, empty}) => (
    <div id="timeline-header">
        <h2>{title}</h2>
        <FeedNewButton/>
        {!empty && <FeedCalendarButton feedName={feedName}/>}
        {!empty && <FeedRewindButtons feedName={feedName}/>}
    </div>
);

FeedPageHeader.propTypes = {
    feedName: PropType.string,
    title: PropType.string,
    empty: PropType.bool
};

export default FeedPageHeader;
