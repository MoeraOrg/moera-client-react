import React from 'react';

import { NodeName } from "ui/control";
import CommentVerifyButton from "ui/comment/CommentVerifyButton";
import "./CommentOwner.css";

const CommentOwner = ({comment}) => (
    <span className="owner">
        <NodeName name={comment.ownerName}/>
        {" "}<CommentVerifyButton comment={comment}/>
    </span>
);

export default CommentOwner;
