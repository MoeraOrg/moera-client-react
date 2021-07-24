import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { commentReply } from "state/detailedposting/actions";
import { CommentInfo } from "api/node/api-types";

type Props = {
    comment: CommentInfo;
} & ConnectedProps<typeof connector>;

function CommentReplyButton({comment, commentReply}: Props) {
    const onClick = () => {
        commentReply(comment.id, comment.ownerName, comment.ownerFullName ?? null, comment.heading);
    }

    return (
        <button className="comment-button" onClick={onClick}>
            <FontAwesomeIcon icon="reply"/>
            <span className="caption">Reply</span>
        </button>
    );
}

const connector = connect(
    null,
    { commentReply }
);

export default connector(CommentReplyButton);
