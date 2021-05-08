import React from 'react';

import Jump from "ui/navigation/Jump";
import { Avatar } from "ui/control";

const PostingAvatar = ({posting}) => (
    <Jump nodeName={posting.ownerName} href="/profile" title="Profile">
        <Avatar avatar={posting.ownerAvatar} size={48}/>
    </Jump>
);

export default PostingAvatar;
