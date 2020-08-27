import React from 'react';
import { connect } from 'react-redux';

import { ReactionTotals } from "ui/control";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import "./CommentReactions.css";
import { getPosting } from "state/postings/selectors";

const CommentReactions = ({postingId, comment, nodeName, openReactionsDialog}) => (
    <ReactionTotals reactions={comment.reactions}
                    onClick={negative => openReactionsDialog(nodeName, postingId, comment.id, negative)}/>
);

export default connect(
    (state, ownProps) => ({
        nodeName: getPosting(state, ownProps.postingId).receiverName ?? ""
    }),
    { openReactionsDialog }
)(CommentReactions);
