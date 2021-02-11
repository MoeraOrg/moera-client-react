import React from 'react';
import { connect } from 'react-redux';

import { isAtNewsPage } from "state/navigation/selectors";
import FeedPage from "ui/feed/FeedPage";

const NewsPage = ({visible}) => (
    <FeedPage feedName="news" title="News" visible={visible}/>
);

export default connect(
    state => ({
        visible: isAtNewsPage(state)
    })
)(NewsPage);
