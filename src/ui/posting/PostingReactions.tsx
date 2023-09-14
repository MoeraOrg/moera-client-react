import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { PostingInfo } from "api";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import { ReactionTotals } from "ui/control";

type Props = {
    posting: PostingInfo;
} & ConnectedProps<typeof connector>;

const PostingReactions = ({posting, openReactionsDialog}: Props) => (
    <ReactionTotals reactions={posting.reactions ?? null}
                    onClick={negative => openReactionsDialog(posting.receiverName ?? "", posting.id, null, negative)}/>
);

const connector = connect(
    null,
    { openReactionsDialog }
);

export default connector(PostingReactions);
