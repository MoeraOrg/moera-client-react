import React from 'react';

import { PostingInfo } from "api";
import { AvatarWithPopup } from "ui/control";

interface Props {
    posting: PostingInfo;
}

const PostingAvatar = ({posting}: Props) => (
    <AvatarWithPopup ownerName={posting.ownerName} ownerFullName={posting.ownerFullName} avatar={posting.ownerAvatar}
                     size={40}/>
);

export default PostingAvatar;
