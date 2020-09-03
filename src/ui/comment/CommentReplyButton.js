import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CommentReplyButton = () => (
    <button className="comment-button">
        <FontAwesomeIcon icon="reply"/>
        <span className="caption">Reply</span>
    </button>
);

export default CommentReplyButton;
