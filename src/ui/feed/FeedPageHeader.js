import React from 'react';
import PropType from 'prop-types';

import PageHeader from "ui/page/PageHeader";
import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import FeedGotoButton from "ui/feed/FeedGotoButton";
import FeedTopButton from "ui/feed/FeedTopButton";

const FeedPageHeader = ({feedName, title, empty, atTop, atBottom}) => (
    <PageHeader>
        <h2>{title} <FeedSubscribeButton feedName={feedName}/></h2>
        {!empty &&
            <FeedGotoButton feedName={feedName} atBottom={atBottom}/>
        }
        <FeedTopButton feedName={feedName} atTop={atTop}/>
    </PageHeader>
);

FeedPageHeader.propTypes = {
    feedName: PropType.string,
    title: PropType.string,
    empty: PropType.bool,
    atTop: PropType.bool,
    atBottom: PropType.bool
};

export default FeedPageHeader;
