import React from 'react';
import { connect } from 'react-redux';

import { ReactionTotals } from "ui/control";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import "./CommentReactions.css";

const CommentReactions = ({comment, openReactionsDialog}) => (
    <ReactionTotals reactions={comment.reactions} onClick={negative => openReactionsDialog(comment.id, negative)}/>
);

export default connect(
    null,
    { openReactionsDialog }
)(CommentReactions);
