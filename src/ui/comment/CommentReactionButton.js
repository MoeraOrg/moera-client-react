import React from 'react';
import { connect } from 'react-redux';

import { postingReact, postingReactionDelete } from "state/postings/actions";
import { ReactionButton } from "ui/control";
import "./CommentButton.css";

const CommentReactionButton = ({icon, caption, invisible, id, negative, emoji, accepted, postingReact,
                                postingReactionDelete}) => (
    <ReactionButton icon={icon} emoji={emoji} caption={caption} className="comment-button" negative={negative}
                    accepted={accepted} invisible={invisible}
                    onReactionAdd={(negative, emoji) => postingReact(id, negative, emoji)}
                    onReactionDelete={() => postingReactionDelete(id)}/>
);

export default connect(
    null,
    { postingReact, postingReactionDelete }
)(CommentReactionButton);
