import React from 'react';
import { connect } from 'react-redux';

import { ReactionButton } from "ui/control";
import { commentReact, commentReactionDelete } from "state/detailedposting/actions";
import { getCommentsReceiverPostingId } from "state/detailedposting/selectors";
import "./CommentButton.css";

const CommentReactionButton = ({icon, caption, invisible, id, negative, emoji, accepted, postingId, commentReact,
                                commentReactionDelete}) => (
    <ReactionButton icon={icon} emoji={emoji} caption={caption} className="comment-button" negative={negative}
                    accepted={accepted} invisible={invisible}
                    onReactionAdd={(negative, emoji) => commentReact(id, negative, emoji)}
                    onReactionDelete={() => commentReactionDelete(id, postingId)}/>
);

export default connect(
    state => ({
        postingId: getCommentsReceiverPostingId(state)
    }),
    { commentReact, commentReactionDelete }
)(CommentReactionButton);
