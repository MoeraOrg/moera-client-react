import React from 'react';
import { connect } from 'react-redux';

import { commentRepliedToUnset } from "state/detailedposting/actions";
import { getDetailedPostingId } from "state/detailedposting/selectors";
import RepliedTo from "ui/comment/RepliedTo";
import { replaceEmojis } from "util/html";

class CommentComposeRepliedTo extends React.PureComponent {

    onUnset = () => {
        this.props.commentRepliedToUnset();
    }

    render() {
        const {postingId, commentId, ownerName, ownerFullName, heading} = this.props;

        if (commentId == null) {
            return null;
        }

        return (
            <RepliedTo postingId={postingId} commentId={commentId} ownerName={ownerName} ownerFullName={ownerFullName}
                       heading={replaceEmojis(heading)} unset={true} onUnset={this.onUnset}/>
        );
    }

}

export default connect(
    state => ({
        postingId: getDetailedPostingId(state),
        commentId: state.detailedPosting.compose.repliedToId,
        ownerName: state.detailedPosting.compose.repliedToName,
        ownerFullName: state.detailedPosting.compose.repliedToFullName,
        heading: state.detailedPosting.compose.repliedToHeading,
    }),
    { commentRepliedToUnset }
)(CommentComposeRepliedTo);
