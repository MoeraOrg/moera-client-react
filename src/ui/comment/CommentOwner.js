import React from 'react';

import { NodeName } from "ui/control";
import "./CommentOwner.css";

const CommentOwner = ({comment}) => (
    <span className="owner">
        <NodeName name={comment.ownerName}/>
    </span>
);

export default CommentOwner;
