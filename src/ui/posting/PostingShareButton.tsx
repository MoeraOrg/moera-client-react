import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { shareDialogPrepare } from "state/sharedialog/actions";
import { PostingInfo } from "api/node/api-types";

type Props = {
    posting: PostingInfo;
} & ConnectedProps<typeof connector>;

function PostingShareButton({posting, shareDialogPrepare}: Props) {
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

const connector = connect(
    null,
    { shareDialogPrepare }
);

export default connector(PostingShareButton);
