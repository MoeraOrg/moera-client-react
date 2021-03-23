import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { shareDialogPrepare } from "state/sharedialog/actions";

const CommentShareButton = ({nodeName, postingId, comment, shareDialogPrepare}) => {
    const href = `/post/${postingId}?comment=${comment.id}`;
    return (
        <button className="comment-button" onClick={() => shareDialogPrepare(comment.heading, nodeName, href)}>
            <FontAwesomeIcon icon="share-alt"/>
            <span className="caption">Share</span>
        </button>
    );
};

export default connect(
    null,
    { shareDialogPrepare }
)(CommentShareButton);
