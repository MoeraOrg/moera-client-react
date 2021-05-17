import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Jump from "ui/navigation/Jump";
import { Browser } from "ui/browser";
import "./PostingComments.css";

export default function PostingComments({posting}) {
    if (posting.totalComments <= 0) {
        return null;
    }

    let commentsText = "";
    if (!Browser.isTinyScreen()) {
        commentsText = posting.totalComments === 1 ? "comment" : "comments"
    }
    return (
        <div className="posting-comments">
            <Jump className="total-comments" href={`/post/${posting.id}#comments`}>
                <FontAwesomeIcon icon="comment"/>{" "}&nbsp;
                {posting.totalComments}&nbsp;{commentsText}
            </Jump>
        </div>
    );
}
