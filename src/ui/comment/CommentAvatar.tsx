import React from 'react';

import { AvatarImage } from "api";
import { AvatarWithPopup } from "ui/control";

interface Props {
    ownerName: string;
    ownerFullName?: string | null;
    avatar?: AvatarImage | null;
    nodeName?: string;
}

const CommentAvatar = ({ownerName, ownerFullName, avatar, nodeName}: Props) => (
    <AvatarWithPopup ownerName={ownerName} ownerFullName={ownerFullName} avatar={avatar} nodeName={nodeName} size={36}/>
);

export default CommentAvatar;
