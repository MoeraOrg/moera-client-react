import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { feedScrollToAnchor } from "state/feeds/actions";
import "./FeedTopButton.css";

type Props = {
    feedName: string;
    atTop: boolean;
    totalAfterTop: number;
    notViewed: number;
} & ConnectedProps<typeof connector>;

const FeedTopButton = ({feedName, atTop, totalAfterTop, notViewed, feedScrollToAnchor}: Props) => {
    if (atTop) {
        return null;
    }

    let title = " Top";
    if (totalAfterTop > 0) {
        if (notViewed > 0) {
            if (totalAfterTop > notViewed) {
                title += ` (${totalAfterTop - notViewed} + ${notViewed} new)`;
            } else {
                title += ` (${totalAfterTop} new)`;
            }
        } else {
            title += ` (${totalAfterTop})`;
        }
    }

    return (
        <div className="feed-top-box">
            <div className="feed-top-button" onClick={e => {
                feedScrollToAnchor(feedName, Number.MAX_SAFE_INTEGER);
                e.preventDefault();
            }}>
                <FontAwesomeIcon icon="arrow-up"/>{title}
            </div>
        </div>
    );
};

const connector = connect(
    null,
    { feedScrollToAnchor }
);

export default connector(FeedTopButton);
