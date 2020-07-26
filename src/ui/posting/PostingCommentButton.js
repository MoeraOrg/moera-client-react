import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Jump from "ui/navigation/Jump";

const PostingCommentButton = ({posting}) => {
    const nodeName = posting.receiverName;
    const postingId = nodeName != null ? posting.receiverPostingId : posting.id;

    return (
        <Jump className="posting-button" nodeName={nodeName} href={`/post/${postingId}#comment-add`}>
            <FontAwesomeIcon icon={["far", "comment"]}/>
            <span className="caption">Comment</span>
        </Jump>
    );
};

export default PostingCommentButton;
