import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Jump from "ui/navigation/Jump";
import "./PostingSource.css";

const PostingSource = ({posting}) => (
    posting.receiverName ?
        <span className="posting-source">
            <Jump nodeName={posting.receiverName} href={`/post/${posting.receiverPostingId}`}>
                <FontAwesomeIcon icon="retweet"/>
            </Jump>
        </span>
    :
        null
);

export default PostingSource;
