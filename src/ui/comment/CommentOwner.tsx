import React from 'react';

import { ExtCommentInfo } from "state/detailedposting/state";
import NodeName from "ui/nodename/NodeName";
import CommentVerifyButton from "ui/comment/CommentVerifyButton";
import "./CommentOwner.css";

interface Props {
    comment: ExtCommentInfo;
    nodeName?: string;
    popup?: boolean;
}

const CommentOwner = ({comment, nodeName, popup = true}: Props) => (
    <span className="owner">
        <NodeName name={comment.ownerName} fullName={comment.ownerFullName} avatar={comment.ownerAvatar}
                  avatarNodeName={nodeName} popup={popup}/>
        {" "}<CommentVerifyButton comment={comment}/>
    </span>
);

export default CommentOwner;
