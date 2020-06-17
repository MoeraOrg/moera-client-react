import React from 'react';
import { connect } from 'react-redux';

import { isAtNewsPage } from "state/navigation/selectors";
import { Page } from "ui/page/Page";
import FeedPage from "ui/feed/FeedPage";

const NewsPage = ({visible}) => (
    <Page>
        <FeedPage feedName="news" title="News" visible={visible}/>
    </Page>
);

export default connect(
    state => ({
        visible: isAtNewsPage(state)
    })
)(NewsPage);
