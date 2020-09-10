import React from 'react';
import { connect } from 'react-redux';

import { commentRepliedToUnset } from "state/detailedposting/actions";
import { getDetailedPostingId } from "state/detailedposting/selectors";
import RepliedTo from "ui/comment/RepliedTo";

class CommentComposeRepliedTo extends React.PureComponent {

    onUnset = () => {
        this.props.commentRepliedToUnset();
    }

    render() {
        const {postingId, commentId, ownerName, heading} = this.props;

        if (commentId == null) {
            return null;
        }

        return (
            <RepliedTo postingId={postingId} commentId={commentId} ownerName={ownerName} heading={heading} unset={true}
                       onUnset={this.onUnset}/>
        );
    }

}

export default connect(
    state => ({
        postingId: getDetailedPostingId(state),
        commentId: state.detailedPosting.compose.repliedToId,
        ownerName: state.detailedPosting.compose.repliedToName,
        heading: state.detailedPosting.compose.repliedToHeading,
    }),
    { commentRepliedToUnset }
)(CommentComposeRepliedTo);
