import React from 'react';

import PostingReactionButton from "ui/posting/PostingReactionButton";
import PostingReplyButton from "ui/posting/PostingReplyButton";
import "./PostingButtons.css";

const PostingButtons = ({posting}) => {
    const cr = posting.clientReaction || {};
    return (
        <div className="posting-buttons">
            <PostingReactionButton icon="thumbs-up" caption="Support" invisible={cr.emoji && cr.negative}
                                   id={posting.id} negative={false} emoji={!cr.negative ? cr.emoji : null}
                                   accepted={posting.acceptedReactions.positive}/>
            <PostingReactionButton icon="thumbs-down" caption="Oppose" invisible={cr.emoji && !cr.negative}
                                   id={posting.id} negative={true} emoji={cr.negative ? cr.emoji : null}
                                   accepted={posting.acceptedReactions.negative}/>
            <PostingReplyButton id={posting.id}/>
        </div>
    );
};

export default PostingButtons;
