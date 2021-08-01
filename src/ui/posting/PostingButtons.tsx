import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import PostingReactionButton from "ui/posting/PostingReactionButton";
import PostingCommentButton from "ui/posting/PostingCommentButton";
import PostingShareButton from "ui/posting/PostingShareButton";
import { getSetting } from "state/settings/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { ClientState } from "state/state";
import { ClientReactionInfo, PostingInfo } from "api/node/api-types";
import "./PostingButtons.css";

type Props = {
    posting: PostingInfo;
} & ConnectedProps<typeof connector>;

function PostingButtons({posting, homeOwnerName, enableSelf}: Props) {
    const cr = posting.clientReaction || {} as ClientReactionInfo;
    const hide = posting.ownerName === homeOwnerName && !enableSelf && !cr.emoji;
    return (
        <div className="posting-buttons">
            <PostingReactionButton icon="thumbs-up" caption="Support"
                                   invisible={hide || (cr.emoji != null && cr.negative)} id={posting.id}
                                   negative={false} emoji={!cr.negative ? cr.emoji : null}
                                   accepted={posting.acceptedReactions?.positive ?? ""}/>
            <PostingReactionButton icon="thumbs-down" caption="Oppose"
                                   invisible={hide || (cr.emoji != null && !cr.negative)} id={posting.id}
                                   negative={true} emoji={cr.negative ? cr.emoji : null}
                                   accepted={posting.acceptedReactions?.negative ?? ""}/>
            <PostingCommentButton posting={posting}/>
            <PostingShareButton posting={posting}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        homeOwnerName: getHomeOwnerName(state),
        enableSelf: getSetting(state, "posting.reactions.self.enabled") as boolean
    })
);

export default connector(PostingButtons);
