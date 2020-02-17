import React from 'react';
import { connect } from 'react-redux';

import PostingButton from "ui/posting/PostingButton";
import { postingReply } from "state/postingreply/actions";
import { Loading } from "ui/control";

class PostingReplyButton extends React.PureComponent {

    onClick = () => {
        const {id, postingReply} = this.props;

        postingReply(id);
    };

    render() {
        const {id, replyingId} = this.props;

        if (id !== replyingId) {
            return <PostingButton icon="reply" caption="Reply" onClick={this.onClick}/>
        } else {
            return <div className="posting-button"><Loading/></div>;
        }
    }

}

export default connect(
    state => ({
        replyingId: state.postingReply.postingId
    }),
    { postingReply }
)(PostingReplyButton);
