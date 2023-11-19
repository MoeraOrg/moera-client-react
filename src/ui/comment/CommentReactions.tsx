import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientReactionInfo, ReactionTotalsInfo } from "api";
import { ClientState } from "state/state";
import { getPosting } from "state/postings/selectors";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import { ReactionTotals } from "ui/control";
import "./CommentReactions.css";

interface Props {
    postingId: string;
    commentId: string;
    reactions: ReactionTotalsInfo | null;
    seniorReaction: ClientReactionInfo | null;
}

export default function CommentReactions({postingId, commentId, reactions, seniorReaction}: Props) {
    const nodeName = useSelector((state: ClientState) => getPosting(state, postingId)?.receiverName ?? "");
    const seniorName = useSelector((state: ClientState) => getPosting(state, postingId)?.ownerName);
    const seniorFullName = useSelector((state: ClientState) => getPosting(state, postingId)?.ownerFullName ?? undefined);
    const dispatch = useDispatch();

    const onClick = (negative: boolean) => dispatch(openReactionsDialog(nodeName, postingId, commentId, negative));

    return (
        <ReactionTotals reactions={reactions} seniorReaction={seniorReaction} seniorName={seniorName}
                        seniorFullName={seniorFullName} onClick={onClick}/>
    );
}
