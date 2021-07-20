import React from 'react';

import { AvatarWithPopup } from "ui/control";
import { PostingInfo } from "api/node/api-types";

interface Props {
    posting: PostingInfo;
}

const PostingAvatar = ({posting}: Props) => (
    <AvatarWithPopup ownerName={posting.ownerName} ownerFullName={posting.ownerFullName} avatar={posting.ownerAvatar}
                     size={48}/>
);

export default PostingAvatar;
