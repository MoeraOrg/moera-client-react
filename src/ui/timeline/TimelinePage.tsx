import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { isAtTimelinePage } from "state/navigation/selectors";
import FeedPage from "ui/feed/FeedPage";

type Props = ConnectedProps<typeof connector>;

const TimelinePage = ({visible}: Props) => (
    <FeedPage feedName="timeline" title="Timeline" visible={visible}/>
);

const connector = connect(
    (state: ClientState) => ({
        visible: isAtTimelinePage(state)
    })
);

export default connector(TimelinePage);
