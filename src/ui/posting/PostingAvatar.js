import React from 'react';

import Jump from "ui/navigation/Jump";
import { Avatar } from "ui/control";
import NodeNamePopup from "ui/nodename/NodeNamePopup";

const PostingAvatar = ({posting}) => (
    <NodeNamePopup nodeName={posting.ownerName} fullName={posting.ownerFullName}>
        {(ref, mainEnter, mainLeave, mainTouch) =>
            <Jump nodeName={posting.ownerName} href="/profile" anchorRef={ref} onMouseEnter={mainEnter}
                  onMouseLeave={mainLeave} onTouchStart={mainTouch}>
                <Avatar avatar={posting.ownerAvatar} size={48}/>
            </Jump>
        }
    </NodeNamePopup>
);

export default PostingAvatar;
