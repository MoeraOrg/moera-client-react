import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NodeName } from "ui/control";
import { commentRepliedToUnset } from "state/detailedposting/actions";
import "./CommentComposeRepliedTo.css";

class CommentComposeRepliedTo extends React.PureComponent {

    onUnset = () => {
        this.props.commentRepliedToUnset();
    }

    render() {
        const {commentId, ownerName} = this.props;

        if (commentId == null) {
            return null;
        }

        return (
            <div className="replied-to">
                <span className="icon"><FontAwesomeIcon icon="reply"/></span>
                <NodeName name={ownerName} linked={false}/>
                <button className="unset" onClick={this.onUnset}>&times;</button>
            </div>
        );
    }

}

export default connect(
    state => ({
        commentId: state.detailedPosting.compose.repliedToId,
        ownerName: state.detailedPosting.compose.repliedToName,
    }),
    { commentRepliedToUnset }
)(CommentComposeRepliedTo);
