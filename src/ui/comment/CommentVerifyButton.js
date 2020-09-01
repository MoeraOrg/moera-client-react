import React from 'react';
import { connect } from 'react-redux';

import { SignatureVerifyButton } from "ui/control";
import { isConnectedToHome } from "state/home/selectors";
import { commentVerify } from "state/detailedposting/actions";

class CommentVerifyButton extends React.PureComponent {

    onVerify = () => {
        const {comment, commentVerify} = this.props;
        commentVerify(comment.id);
    };

    render() {
        const {connectedToHome, comment} = this.props;
        if (!connectedToHome || !comment.signature) {
            return null;
        }
        return <SignatureVerifyButton status={comment.verificationStatus} onVerify={this.onVerify}/>;
    }

}

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
    }),
    { commentVerify }
)(CommentVerifyButton);
