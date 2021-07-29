import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { isAtNewsPage } from "state/navigation/selectors";
import FeedPage from "ui/feed/FeedPage";

type Props = ConnectedProps<typeof connector>;

const NewsPage = ({visible}: Props) => (
    <FeedPage feedName="news" title="News" visible={visible}/>
);

const connector = connect(
    (state: ClientState) => ({
        visible: isAtNewsPage(state)
    })
);

export default connector(NewsPage);
