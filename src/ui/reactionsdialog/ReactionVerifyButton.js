import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { SignatureVerifyButton } from "ui/control";
import { isConnectedToHome } from "state/home/selectors";
import { reactionVerify } from "state/reactionsdialog/actions";
import { getReactionVerificationStatus } from "state/reactionsdialog/selectors";

class ReactionVerifyButton extends React.PureComponent {

    static propTypes = {
        postingId: PropType.string,
        commentId: PropType.string,
        ownerName: PropType.string
    };

    onVerify = () => {
        const {postingId, commentId, ownerName, reactionVerify} = this.props;
        reactionVerify(postingId, commentId, ownerName);
    };

    render() {
        const {connectedToHome, status} = this.props;
        return connectedToHome ? <SignatureVerifyButton status={status} onVerify={this.onVerify}/> : null;
    }

}

export default connect(
    (state, ownProps) => ({
        connectedToHome: isConnectedToHome(state),
        status: getReactionVerificationStatus(state, ownProps.ownerName)
    }),
    { reactionVerify }
)(ReactionVerifyButton);
