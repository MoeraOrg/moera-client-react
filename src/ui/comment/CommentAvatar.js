import React from 'react';

import Jump from "ui/navigation/Jump";
import { Avatar } from "ui/control";
import NodeNamePopup from "ui/nodename/NodeNamePopup";

const CommentAvatar = ({comment, nodeName}) => (
    <NodeNamePopup nodeName={comment.ownerName} fullName={comment.ownerFullName}>
        {(ref, mainEnter, mainLeave, mainTouch) =>
            <Jump nodeName={comment.ownerName} href="/profile" anchorRef={ref} onMouseEnter={mainEnter}
                  onMouseLeave={mainLeave} onTouchStart={mainTouch}>
                <Avatar avatar={comment.ownerAvatar} size={36} nodeName={nodeName}/>
            </Jump>
        }
    </NodeNamePopup>
);

export default CommentAvatar;
