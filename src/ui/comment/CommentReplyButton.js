import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { commentReply } from "state/detailedposting/actions";

class CommentReplyButton extends React.Component {

    onClick = () => {
        const {comment, commentReply} = this.props;

        commentReply(comment.id, comment.ownerName);
    }

    render() {
        return (
            <button className="comment-button" onClick={this.onClick}>
                <FontAwesomeIcon icon="reply"/>
                <span className="caption">Reply</span>
            </button>
        );
    }

}

export default connect(
    null,
    { commentReply }
)(CommentReplyButton);
