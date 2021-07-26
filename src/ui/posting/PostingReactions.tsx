import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ReactionTotals } from "ui/control";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import { PostingInfo } from "api/node/api-types";

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
