import React from 'react';

import PostingReactionButton from "ui/posting/PostingReactionButton";
import PostingCommentButton from "ui/posting/PostingCommentButton";
import PostingShareButton from "ui/posting/PostingShareButton";
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
            <PostingCommentButton posting={posting}/>
            <PostingShareButton posting={posting}/>
        </div>
    );
};

export default PostingButtons;
