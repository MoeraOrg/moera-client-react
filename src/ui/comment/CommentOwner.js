import React from 'react';

import NodeName from "ui/nodename/NodeName";
import CommentVerifyButton from "ui/comment/CommentVerifyButton";
import "./CommentOwner.css";

const CommentOwner = ({comment, nodeName, popup = true}) => (
    <span className="owner">
        <NodeName name={comment.ownerName} fullName={comment.ownerFullName} avatar={comment.ownerAvatar}
                  avatarNodeName={nodeName} popup={popup}/>
        {" "}<CommentVerifyButton comment={comment}/>
    </span>
);

export default CommentOwner;
