import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation, withTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtTimelinePage } from "state/navigation/selectors";
import FeedPage from "ui/feed/FeedPage";
import { getFeedTitle } from "ui/feed/feeds";

type Props = ConnectedProps<typeof connector>;

const TimelinePage = ({visible}: Props) => {
    const {t} = useTranslation();

    return <FeedPage feedName="timeline" title={getFeedTitle("timeline", t)} shareable visible={visible}/>;
};

const connector = connect(
    (state: ClientState) => ({
        visible: isAtTimelinePage(state)
    })
);

export default withTranslation()(connector(TimelinePage));
