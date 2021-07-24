import React from 'react';

import { AvatarWithPopup } from "ui/control";
import { CommentInfo } from "api/node/api-types";

interface Props {
    comment: CommentInfo;
    nodeName?: string;
}

const CommentAvatar = ({comment, nodeName}: Props) => (
    <AvatarWithPopup ownerName={comment.ownerName} ownerFullName={comment.ownerFullName} avatar={comment.ownerAvatar}
                     nodeName={nodeName} size={36}/>
);

export default CommentAvatar;
