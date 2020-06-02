import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import FeedGotoButton from "ui/feed/FeedGotoButton";
import FeedTopButton from "ui/feed/FeedTopButton";
import "./FeedPageHeader.css";

const FeedPageHeader = ({feedName, title, empty, atTop, atBottom, scrolled}) => (
    <div id="feed-header" className={cx({"feed-header-shadow": scrolled})}>
        <h2>{title} <FeedSubscribeButton feedName={feedName}/></h2>
        {!empty &&
            <FeedGotoButton feedName={feedName} atBottom={atBottom}/>
        }
        <FeedTopButton feedName={feedName} atTop={atTop}/>
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
