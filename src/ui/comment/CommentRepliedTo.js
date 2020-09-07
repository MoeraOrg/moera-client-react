import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NodeName } from "ui/control";
import "./CommentRepliedTo.css";

const CommentRepliedTo = ({comment}) => (
    comment.repliedTo ?
        <div className="replied-to">
            <span className="icon"><FontAwesomeIcon icon="reply"/></span>
            <NodeName name={comment.repliedTo.name} linked={false}/>
            <span className="heading">{comment.repliedTo.heading}</span>
        </div>
    :
        null
);

export default CommentRepliedTo;
