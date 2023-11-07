import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { postingVerify } from "state/postings/actions";
import { getPostingVerificationStatus } from "state/postings/selectors";
import { SignatureVerifyButton } from "ui/control";

interface OwnProps {
    id: string;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function PostingVerifyButton({id, connectedToHome, status, postingVerify}: Props) {
    if (!connectedToHome) {
        return null;
    }

    const onVerify = () => postingVerify(id, "");

    return <SignatureVerifyButton status={status} onVerify={onVerify}/>;
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        connectedToHome: isConnectedToHome(state),
        status: getPostingVerificationStatus(state, ownProps.id)
    }),
    { postingVerify }
);

export default connector(PostingVerifyButton);
