import React from 'react';

import { PostingInfo } from "api";
import { REL_CURRENT } from "util/rel-node-name";
import StoryDate from "ui/story/StoryDate";
import { ut } from "util/url";

interface Props {
    posting: PostingInfo;
}

export default function PostingDate({posting}: Props) {
    const unixTime = (posting.receiverName ? posting.receiverPublishedAt : posting.earliestPublishedAt)
        ?? posting.createdAt;
    const originalDeleted = posting.receiverDeletedAt != null;
    const nodeName = originalDeleted ? REL_CURRENT : (posting.receiverName ?? posting.ownerName);
    const postingId = originalDeleted ? posting.id : (posting.receiverPostingId ?? posting.id);

    return <StoryDate publishedAt={unixTime} nodeName={nodeName} href={ut`/post/${postingId}`} noteOld/>;
}
