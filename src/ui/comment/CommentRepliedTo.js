import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NodeName } from "ui/control";
import { getDetailedPostingId } from "state/detailedposting/selectors";
import Jump from "ui/navigation/Jump";
import "./CommentRepliedTo.css";

const CommentRepliedTo = ({comment, postingId}) => (
    comment.repliedTo ?
        <div className="replied-to">
            <Jump href={`/post/${postingId}?comment=${comment.repliedTo.id}`}>
                <span className="icon"><FontAwesomeIcon icon="reply"/></span>
                <NodeName name={comment.repliedTo.name} linked={false}/>
                <span className="heading">{comment.repliedTo.heading}</span>
            </Jump>
        </div>
    :
        null
);

export default connect(
    state => ({
        postingId: getDetailedPostingId(state)
    })
)(CommentRepliedTo);
