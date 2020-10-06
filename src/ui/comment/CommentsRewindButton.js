import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getCommentsState, getDetailedPosting } from "state/detailedposting/selectors";
import { commentsScrollToAnchor } from "state/detailedposting/actions";
import "./CommentsRewindButton.css";

class CommentsRewindButton extends React.PureComponent {

    static propTypes = {
        end: PropType.bool,
        forward: PropType.bool,
        before: PropType.number,
        after: PropType.number,
        total: PropType.number
    };

    onClick = () => {
        const {forward, commentsScrollToAnchor} = this.props;

        commentsScrollToAnchor(forward ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER + 1);
    }

    render() {
        const {end, forward, before, after, total} = this.props;
        const visible = total > 1
            && ((end && (!forward || before < Number.MAX_SAFE_INTEGER))
                || (!end && (forward || after > Number.MIN_SAFE_INTEGER)));

        if (!visible) {
            return null;
        }

        return (
            <button className="comments-rewind" title={forward ? "Go to the last comment" : "Go to the first comment"}
                    onClick={this.onClick}>
                <FontAwesomeIcon icon={forward ? "fast-forward" : "fast-backward"}/>
            </button>
        )
    }

}

export default connect(
    state => ({
        before: getCommentsState(state).before,
        after: getCommentsState(state).after,
        total: getDetailedPosting(state).totalComments
    }),
    { commentsScrollToAnchor }
)(CommentsRewindButton);
