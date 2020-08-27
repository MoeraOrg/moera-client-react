import React from 'react';
import { connect } from 'react-redux';

import { ReactionTotals } from "ui/control";
import { openReactionsDialog } from "state/reactionsdialog/actions";

const PostingReactions = ({posting, openReactionsDialog}) => (
    <ReactionTotals reactions={posting.reactions}
                    onClick={negative => openReactionsDialog(posting.receiverName ?? "", posting.id, null, negative)}/>
);

export default connect(
    null,
    { openReactionsDialog }
)(PostingReactions);
