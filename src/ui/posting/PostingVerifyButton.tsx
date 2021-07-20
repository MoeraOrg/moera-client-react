import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { SignatureVerifyButton } from "ui/control";
import { getPostingVerificationStatus } from "state/postings/selectors";
import { postingVerify } from "state/postings/actions";
import { isConnectedToHome } from "state/home/selectors";
import { ClientState } from "state/state";

interface OwnProps {
    id: string;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

class PostingVerifyButton extends React.PureComponent<Props> {

    onVerify = () => {
        const {id, postingVerify} = this.props;
        postingVerify(id);
    };

    render() {
        const {connectedToHome, status} = this.props;
        return connectedToHome ? <SignatureVerifyButton status={status} onVerify={this.onVerify}/> : null;
    }

}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        connectedToHome: isConnectedToHome(state),
        status: getPostingVerificationStatus(state, ownProps.id)
    }),
    { postingVerify }
);

export default connector(PostingVerifyButton);
