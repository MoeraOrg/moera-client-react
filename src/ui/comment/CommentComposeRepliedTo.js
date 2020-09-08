import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NodeName } from "ui/control";
import { commentRepliedToUnset } from "state/detailedposting/actions";
import { getDetailedPostingId } from "state/detailedposting/selectors";
import Jump from "ui/navigation/Jump";

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
            <div className="replied-to">
                <Jump href={`/post/${postingId}?comment=${commentId}`}>
                    <span className="icon"><FontAwesomeIcon icon="reply"/></span>
                    <NodeName name={ownerName} linked={false}/>
                    <span className="heading">{heading}</span>
                </Jump>
                <button className="unset" onClick={this.onUnset}>&times;</button>
            </div>
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
