import React from 'react';

import { ANONYMOUS_NODE_NAME, AvatarImage } from "api";
import { Avatar, AvatarWithPopup } from "ui/control";

interface Props {
    ownerName: string;
    ownerFullName?: string | null;
    avatar?: AvatarImage | null;
    nodeName?: string;
}

const CommentAvatar = ({ownerName, ownerFullName, avatar, nodeName}: Props) => (
    ownerName !== ANONYMOUS_NODE_NAME ?
        <AvatarWithPopup ownerName={ownerName} ownerFullName={ownerFullName} avatar={avatar} nodeName={nodeName}
                         size={32}/>
    :
        <Avatar ownerName={ownerName} avatar={avatar} nodeName={nodeName} size={32}/>
);

export default CommentAvatar;
