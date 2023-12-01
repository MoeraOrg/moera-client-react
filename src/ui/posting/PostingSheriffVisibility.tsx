import React from 'react';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { PostingInfo } from "api";
import { isPostingSheriffProhibited } from "state/postings/selectors";
import { SheriffInvisible } from "ui/control";

interface Props {
    posting: PostingInfo;
}

export default function PostingSheriffVisibility({posting}: Props) {
    const invisible = isPostingSheriffProhibited(posting, SHERIFF_GOOGLE_PLAY_TIMELINE);

    return invisible ? <SheriffInvisible/> : null;
}
