import React from 'react';
import { useSelector } from 'react-redux';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { CommentInfo } from "api";
import { ClientState } from "state/state";
import { getDetailedPosting, isCommentSheriffProhibited } from "state/detailedposting/selectors";
import { SheriffVisibility } from "ui/control";

interface Props {
    comment: CommentInfo;
}

export default function CommentSheriffVisibility({comment}: Props) {
    const invisible = useSelector((state: ClientState) =>
        isCommentSheriffProhibited(getDetailedPosting(state), comment, SHERIFF_GOOGLE_PLAY_TIMELINE));

    return <SheriffVisibility invisible={invisible}/>;
}
