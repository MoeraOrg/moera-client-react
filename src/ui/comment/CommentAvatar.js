import React from 'react';

import { AvatarWithPopup } from "ui/control";

const CommentAvatar = ({comment, nodeName}) => (
    <AvatarWithPopup ownerName={comment.ownerName} ownerFullName={comment.ownerFullName} avatar={comment.ownerAvatar}
                     nodeName={nodeName} size={36}/>
);

export default CommentAvatar;
