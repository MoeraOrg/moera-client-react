import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { shareDialogPrepare } from "state/sharedialog/actions";
import { CommentInfo } from "api/node/api-types";

type Props = {
    nodeName: string;
    postingId: string;
    comment: CommentInfo;
} & ConnectedProps<typeof connector>;

function CommentShareButton({nodeName, postingId, comment, shareDialogPrepare}: Props) {
    const href = `/post/${postingId}?comment=${comment.id}`;
    return (
        <button className="comment-button" onClick={() => shareDialogPrepare(comment.heading, nodeName, href)}>
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
