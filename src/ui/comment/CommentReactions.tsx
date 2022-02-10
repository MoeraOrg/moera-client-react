import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ReactionTotals } from "ui/control";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import { getPosting } from "state/postings/selectors";
import { ClientState } from "state/state";
import { CommentInfo } from "api/node/api-types";
import "./CommentReactions.css";

interface OwnProps {
    postingId: string;
    comment: CommentInfo;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const CommentReactions = ({postingId, comment, nodeName, seniorName, seniorFullName, openReactionsDialog}: Props) => (
    <ReactionTotals reactions={comment.reactions ?? null} seniorReaction={comment.seniorReaction}
                    seniorName={seniorName} seniorFullName={seniorFullName}
                    onClick={negative => openReactionsDialog(nodeName, postingId, comment.id, negative)}/>
);

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        nodeName: getPosting(state, ownProps.postingId)?.receiverName ?? "",
        seniorName: getPosting(state, ownProps.postingId)?.ownerName,
        seniorFullName: getPosting(state, ownProps.postingId)?.ownerFullName ?? undefined
    }),
    { openReactionsDialog }
);

export default connector(CommentReactions);
