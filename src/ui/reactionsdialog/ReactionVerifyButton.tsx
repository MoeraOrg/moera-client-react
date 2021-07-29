import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { SignatureVerifyButton } from "ui/control";
import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { reactionVerify } from "state/reactionsdialog/actions";
import { getReactionVerificationStatus } from "state/reactionsdialog/selectors";

interface OwnProps {
    postingId: string;
    commentId: string | null;
    ownerName: string;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function ReactionVerifyButton({postingId, commentId, ownerName, connectedToHome, status, reactionVerify}: Props) {
    const onVerify = () => reactionVerify(postingId, commentId, ownerName);

    return connectedToHome ? <SignatureVerifyButton status={status} onVerify={onVerify}/> : null;
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        connectedToHome: isConnectedToHome(state),
        status: getReactionVerificationStatus(state, ownProps.ownerName)
    }),
    { reactionVerify }
);

export default connector(ReactionVerifyButton);
