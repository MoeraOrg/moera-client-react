import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtNewsPage } from "state/navigation/selectors";
import FeedPage from "ui/feed/FeedPage";
import { getFeedTitle } from "ui/feed/feeds";

type Props = ConnectedProps<typeof connector>;

const NewsPage = ({visible}: Props) => {
    const {t} = useTranslation();

    return (
        <FeedPage feedName="news" title={getFeedTitle("news", t)} visible={visible}/>
    );
}

const connector = connect(
    (state: ClientState) => ({
        visible: isAtNewsPage(state)
    })
);

export default connector(NewsPage);
