import React from 'react';

import Jump from "ui/navigation/Jump";
import "./PostingComments.css";

const PostingComments = ({posting}) => (
    posting.totalComments > 0 ?
        <div className="posting-comments">
            <Jump className="total-comments" href={`/post/${posting.id}`}>
                {posting.totalComments}&nbsp;{posting.totalComments === 1 ? "comment" : "comments"}
            </Jump>
        </div>
    :
        null
);

export default PostingComments;
