import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Jump from "ui/navigation/Jump";
import "./PostingComments.css";

const PostingComments = ({posting}) => (
    posting.totalComments > 0 ?
        <div className="posting-comments">
            <Jump className="total-comments" href={`/post/${posting.id}`}>
                <FontAwesomeIcon icon="comment"/>{" "}&nbsp;
                {posting.totalComments}&nbsp;{posting.totalComments === 1 ? "comment" : "comments"}
            </Jump>
        </div>
    :
        null
);

export default PostingComments;
