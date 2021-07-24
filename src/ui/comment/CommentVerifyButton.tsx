import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { SignatureVerifyButton } from "ui/control";
import { isConnectedToHome } from "state/home/selectors";
import { commentVerify } from "state/detailedposting/actions";
import { ClientState } from "state/state";
import { ExtCommentInfo } from "state/detailedposting/state";

type Props = {
    comment: ExtCommentInfo;
} & ConnectedProps<typeof connector>;

function CommentVerifyButton({comment, connectedToHome, commentVerify}: Props) {
    if (!connectedToHome || !comment.signature) {
        return null;
    }

    const onVerify = () => commentVerify(comment.id);

    return <SignatureVerifyButton status={comment.verificationStatus} onVerify={onVerify}/>;
}

const connector = connect(
    (state: ClientState) => ({
        connectedToHome: isConnectedToHome(state),
    }),
    { commentVerify }
);

export default connector(CommentVerifyButton);
