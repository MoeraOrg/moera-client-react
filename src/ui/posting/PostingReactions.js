import React from 'react';
import { connect } from 'react-redux';

import { ReactionTotals } from "ui/control";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import "./PostingReactions.css";

const PostingReactions = ({posting, openReactionsDialog}) => (
    <ReactionTotals reactions={posting.reactions} onClick={negative => openReactionsDialog(posting.id, negative)}/>
);

export default connect(
    null,
    { openReactionsDialog }
)(PostingReactions);
