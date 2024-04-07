import React from 'react';
import { useDispatch } from 'react-redux';

import { ReactionTotalsInfo } from "api";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import { ReactionTotals } from "ui/control";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    nodeName: string | RelNodeName;
    postingId: string;
    reactions: ReactionTotalsInfo | null | undefined;
}

export default function PostingReactions({nodeName, postingId, reactions}: Props) {
    const dispatch = useDispatch();

    const onClick = (negative: boolean) =>
        dispatch(openReactionsDialog(nodeName, postingId, null, negative));

    return <ReactionTotals reactions={reactions ?? null} onClick={onClick}/>;
}
