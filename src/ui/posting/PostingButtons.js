import React from 'react';
import { connect } from 'react-redux';

import PostingReactionButton from "ui/posting/PostingReactionButton";
import PostingCommentButton from "ui/posting/PostingCommentButton";
import PostingShareButton from "ui/posting/PostingShareButton";
import { getSetting } from "state/settings/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import "./PostingButtons.css";

const PostingButtons = ({posting, homeOwnerName, enableSelf}) => {
    const cr = posting.clientReaction || {};
    const hide = posting.ownerName === homeOwnerName && !enableSelf && !cr.emoji;
    return (
        <div className="posting-buttons">
            <PostingReactionButton icon="thumbs-up" caption="Support" invisible={hide || (cr.emoji && cr.negative)}
                                   id={posting.id} negative={false} emoji={!cr.negative ? cr.emoji : null}
                                   accepted={posting.acceptedReactions.positive}/>
            <PostingReactionButton icon="thumbs-down" caption="Oppose" invisible={hide || (cr.emoji && !cr.negative)}
                                   id={posting.id} negative={true} emoji={cr.negative ? cr.emoji : null}
                                   accepted={posting.acceptedReactions.negative}/>
            <PostingCommentButton posting={posting}/>
            <PostingShareButton posting={posting}/>
        </div>
    );
};

export default connect(
    state => ({
        homeOwnerName: getHomeOwnerName(state),
        enableSelf: getSetting(state, "posting.reactions.self.enabled")
    })
)(PostingButtons);
