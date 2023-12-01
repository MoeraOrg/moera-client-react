import React from 'react';
import { useDispatch } from 'react-redux';

import { ReactionTotalsInfo } from "api";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import { ReactionTotals } from "ui/control";

interface Props {
    postingId: string;
    postingReceiverName: string | null | undefined;
    reactions: ReactionTotalsInfo | null | undefined;
}

export default function PostingReactions({postingId, postingReceiverName, reactions}: Props) {
    const dispatch = useDispatch();

    const onClick = (negative: boolean) =>
        dispatch(openReactionsDialog(postingReceiverName ?? "", postingId, null, negative));

    return <ReactionTotals reactions={reactions ?? null} onClick={onClick}/>;
}
