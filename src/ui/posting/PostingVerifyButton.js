import React from 'react';
import { connect } from 'react-redux';

import { SignatureVerifyButton } from "ui/control";
import { getPostingVerificationStatus } from "state/postings/selectors";
import { postingVerify } from "state/postings/actions";
import { isConnectedToHome } from "state/home/selectors";

class PostingVerifyButton extends React.PureComponent {

    onVerify = () => {
        const {id, postingVerify} = this.props;
        postingVerify(id);
    };

    render() {
        const {connectedToHome, status} = this.props;
        return connectedToHome ? <SignatureVerifyButton status={status} onVerify={this.onVerify}/> : null;
    }

}

export default connect(
    (state, ownProps) => ({
        connectedToHome: isConnectedToHome(state),
        status: getPostingVerificationStatus(state, ownProps.id)
    }),
    { postingVerify }
)(PostingVerifyButton);
