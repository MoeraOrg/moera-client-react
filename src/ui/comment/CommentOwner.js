import React from 'react';

import { NodeName } from "ui/control";
import CommentVerifyButton from "ui/comment/CommentVerifyButton";
import "./CommentOwner.css";

const CommentOwner = ({comment}) => (
    <span className="owner">
        <NodeName name={comment.ownerName} fullName={comment.ownerFullName}/>
        {" "}<CommentVerifyButton comment={comment}/>
    </span>
);

export default CommentOwner;
