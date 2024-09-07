import React from 'react';

import { PostingInfo } from "api";
import { REL_CURRENT } from "util/rel-node-name";
import StoryDate from "ui/story/StoryDate";

interface Props {
    posting: PostingInfo;
    publishedAt: number;
}

export default function PostingDate({posting, publishedAt}: Props) {
    const unixTime = posting.receiverName ? (posting.receiverCreatedAt ?? posting.createdAt) : publishedAt;
    const originalDeleted = posting.receiverDeletedAt != null;
    const nodeName = originalDeleted ? REL_CURRENT : (posting.receiverName ?? posting.ownerName);
    const postingId = originalDeleted ? posting.id : (posting.receiverPostingId ?? posting.id);

    return <StoryDate publishedAt={unixTime} nodeName={nodeName} href={`/post/${postingId}`}/>;
}
