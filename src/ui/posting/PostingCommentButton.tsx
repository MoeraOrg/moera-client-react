import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Jump from "ui/navigation/Jump";
import { PostingInfo } from "api/node/api-types";

interface Props {
    posting: PostingInfo;
}

const PostingCommentButton = ({posting}: Props) => (
    <Jump className="posting-button" href={`/post/${posting.id}#comment-add`}>
        <FontAwesomeIcon icon={["far", "comment"]}/>
        <span className="caption">Comment</span>
    </Jump>
);

export default PostingCommentButton;
