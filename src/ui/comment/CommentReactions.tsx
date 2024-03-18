import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientReactionInfo, ReactionTotalsInfo } from "api";
import { ClientState } from "state/state";
import { getPosting } from "state/postings/selectors";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import { ReactionTotals } from "ui/control";
import "./CommentReactions.css";
import { REL_CURRENT } from "util/rel-node-name";

interface Props {
    postingId: string;
    commentId: string;
    reactions: ReactionTotalsInfo | null;
    seniorReaction: ClientReactionInfo | null;
}

export default function CommentReactions({postingId, commentId, reactions, seniorReaction}: Props) {
    const nodeName = useSelector(
        (state: ClientState) => getPosting(state, postingId, REL_CURRENT)?.receiverName ?? REL_CURRENT
    );
    const seniorName = useSelector((state: ClientState) => getPosting(state, postingId, REL_CURRENT)?.ownerName);
    const seniorFullName = useSelector(
        (state: ClientState) => getPosting(state, postingId, REL_CURRENT)?.ownerFullName ?? undefined
    );
    const dispatch = useDispatch();

    const onClick = (negative: boolean) => dispatch(openReactionsDialog(nodeName, postingId, commentId, negative));

    return (
        <ReactionTotals reactions={reactions} seniorReaction={seniorReaction} seniorName={seniorName}
                        seniorFullName={seniorFullName} onClick={onClick}/>
    );
}
