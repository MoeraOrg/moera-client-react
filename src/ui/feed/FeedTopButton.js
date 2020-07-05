import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { feedScrollToAnchor } from "state/feeds/actions";
import "./FeedTopButton.css";

const FeedTopButton = ({feedName, atTop, feedScrollToAnchor}) => (
    !atTop &&
        <div className="feed-top-box">
            <div className="feed-top-button" onClick={e => {
                feedScrollToAnchor(feedName, Number.MAX_SAFE_INTEGER);
                e.preventDefault();
            }}>
                <FontAwesomeIcon icon="arrow-up"/>&nbsp;Top
            </div>
        </div>
);

FeedTopButton.propTypes = {
    feedName: PropType.string,
    atTop: PropType.bool
}

export default connect(
    null,
    { feedScrollToAnchor }
)(FeedTopButton);
