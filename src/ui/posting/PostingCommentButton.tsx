import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Jump from "ui/navigation/Jump";
import { PostingInfo } from "api/node/api-types";

interface Props {
    posting: PostingInfo;
    invisible: boolean;
}

const PostingCommentButton = ({posting, invisible}: Props) => (
    invisible ?
        <span className="posting-button"/>
    :
        <Jump className="posting-button" href={`/post/${posting.id}#comment-add`}>
            <FontAwesomeIcon icon={["far", "comment"]}/>
            <span className="caption">Comment</span>
        </Jump>
);

export default PostingCommentButton;
