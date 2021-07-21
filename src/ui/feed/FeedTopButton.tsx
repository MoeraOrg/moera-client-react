import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { feedScrollToAnchor } from "state/feeds/actions";
import "./FeedTopButton.css";

type Props = {
    feedName: string;
    atTop: boolean;
} & ConnectedProps<typeof connector>;

const FeedTopButton = ({feedName, atTop, feedScrollToAnchor}: Props) => (
    !atTop ?
        <div className="feed-top-box">
            <div className="feed-top-button" onClick={e => {
                feedScrollToAnchor(feedName, Number.MAX_SAFE_INTEGER);
                e.preventDefault();
            }}>
                <FontAwesomeIcon icon="arrow-up"/>&nbsp;Top
            </div>
        </div>
    :
        null
);

const connector = connect(
    null,
    { feedScrollToAnchor }
);

export default connector(FeedTopButton);
