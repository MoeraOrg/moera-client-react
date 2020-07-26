import React from 'react';
import { connect } from 'react-redux';

import PostingButton from "ui/posting/PostingButton";
import { goToLocation } from "state/navigation/actions";

class PostingCommentButton extends React.PureComponent {

    onClick = () => {
        const {id, goToLocation} = this.props;

        goToLocation(`/post/${id}`, null, "comment-add");
    };

    render() {
        return <PostingButton icon={["far", "comment"]} caption="Comment" onClick={this.onClick}/>
    }

}

export default connect(
    state => ({
        replyingId: state.postingReply.postingId
    }),
    { goToLocation }
)(PostingCommentButton);
