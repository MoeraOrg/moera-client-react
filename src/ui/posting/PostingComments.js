import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Jump from "ui/navigation/Jump";
import "./PostingComments.css";

const PostingComments = ({posting}) => {
    if (posting.totalComments <= 0) {
        return null;
    }

    const nodeName = posting.receiverName;
    const postingId = nodeName != null ? posting.receiverPostingId : posting.id;
    return (
        <div className="posting-comments">
            <Jump className="total-comments" nodeName={nodeName} href={`/post/${postingId}`}>
                <FontAwesomeIcon icon="comment"/>{" "}&nbsp;
                {posting.totalComments}&nbsp;{posting.totalComments === 1 ? "comment" : "comments"}
            </Jump>
        </div>
    );
}

export default PostingComments;
