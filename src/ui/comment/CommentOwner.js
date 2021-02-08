import React from 'react';

import NodeName from "ui/nodename/NodeName";
import CommentVerifyButton from "ui/comment/CommentVerifyButton";
import "./CommentOwner.css";

const CommentOwner = ({comment, popup = true}) => (
    <span className="owner">
        <NodeName name={comment.ownerName} fullName={comment.ownerFullName} popup={popup}/>
        {" "}<CommentVerifyButton comment={comment}/>
    </span>
);

export default CommentOwner;
