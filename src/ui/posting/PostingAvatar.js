import React from 'react';

import { AvatarWithPopup } from "ui/control";

const PostingAvatar = ({posting}) => (
    <AvatarWithPopup ownerName={posting.ownerName} ownerFullName={posting.ownerFullName} avatar={posting.ownerAvatar}
                     size={48}/>
);

export default PostingAvatar;
