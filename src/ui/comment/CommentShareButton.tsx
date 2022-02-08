import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { shareDialogPrepare } from "state/sharedialog/actions";

type Props = {
    nodeName: string;
    postingId: string;
    commentId: string;
} & ConnectedProps<typeof connector>;

function CommentShareButton({nodeName, postingId, commentId, shareDialogPrepare}: Props) {
    const href = `/post/${postingId}?comment=${commentId}`;
    return (
        <button className="comment-button" onClick={() => shareDialogPrepare(nodeName, href)}>
            <FontAwesomeIcon icon="share-alt"/>
            <span className="caption">Share</span>
        </button>
    );
}

const connector = connect(
    null,
    { shareDialogPrepare }
);

export default connector(CommentShareButton);
