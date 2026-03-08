import React from 'react';

import { ReactionTotalsInfo } from "api";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import { useDispatcher } from "ui/hook";
import { ReactionTotals } from "ui/control";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    nodeName: string | RelNodeName;
    postingId: string;
    reactions: ReactionTotalsInfo | null | undefined;
}

export default function PostingReactions({nodeName, postingId, reactions}: Props) {
    const dispatch = useDispatcher();

    const onClick = (negative: boolean) =>
        dispatch(openReactionsDialog(nodeName, postingId, null, negative));

    return <ReactionTotals reactions={reactions ?? null} onClick={onClick}/>;
}
