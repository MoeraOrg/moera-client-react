import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientReactionInfo, ReactionTotalsInfo } from "api";
import {
    getCommentsReceiverFullName,
    getCommentsReceiverName,
    getDetailedPostingId
} from "state/detailedposting/selectors";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import { ReactionTotals } from "ui/control";
import { REL_CURRENT } from "util/rel-node-name";
import "./CommentReactions.css";

interface Props {
    commentId: string;
    reactions: ReactionTotalsInfo | null;
    seniorReaction: ClientReactionInfo | null;
}

export default function CommentReactions({commentId, reactions, seniorReaction}: Props) {
    const postingId = useSelector(getDetailedPostingId);
    const seniorName = useSelector(getCommentsReceiverName);
    const seniorFullName = useSelector(getCommentsReceiverFullName);
    const dispatch = useDispatch();

    if (postingId == null) {
        return null;
    }

    const onClick = (negative: boolean) => dispatch(openReactionsDialog(REL_CURRENT, postingId, commentId, negative));

    return (
        <ReactionTotals reactions={reactions} seniorReaction={seniorReaction} seniorName={seniorName ?? undefined}
                        seniorFullName={seniorFullName ?? undefined} onClick={onClick}/>
    );
}
