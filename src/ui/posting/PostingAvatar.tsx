import React from 'react';

import { PostingInfo } from "api/node/api-types";
import { AvatarWithPopup } from "ui/control";

interface Props {
    posting: PostingInfo;
}

const PostingAvatar = ({posting}: Props) => (
    <AvatarWithPopup ownerName={posting.ownerName} ownerFullName={posting.ownerFullName} avatar={posting.ownerAvatar}
                     size={48}/>
);

export default PostingAvatar;
