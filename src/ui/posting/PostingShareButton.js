import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { shareDialogPrepare } from "state/sharedialog/actions";

function PostingShareButton({posting, shareDialogPrepare}) {
    const nodeName = posting.receiverName ?? posting.ownerName;
    const postingId = posting.receiverPostingId ?? posting.id;
    const href = `/post/${postingId}`;
    return (
        <button className="posting-button" onClick={() => shareDialogPrepare(posting.heading, nodeName, href)}>
            <FontAwesomeIcon icon="share-alt"/>
            <span className="caption">Share</span>
        </button>
    );
}

export default connect(
    null,
    { shareDialogPrepare }
)(PostingShareButton);
