import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientReactionInfo, PostingInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import PostingReactionButton from "ui/posting/PostingReactionButton";
import PostingCommentButton from "ui/posting/PostingCommentButton";
import PostingShareButton from "ui/posting/PostingShareButton";
import "./PostingButtons.css";

interface OwnProps {
    posting: PostingInfo;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function PostingButtons({posting, homeOwnerName, enableSelf, commentsVisible}: Props) {
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
            <PostingCommentButton posting={posting} invisible={!commentsVisible}/>
            <PostingShareButton posting={posting}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        homeOwnerName: getHomeOwnerName(state),
        enableSelf: getSetting(state, "posting.reactions.self.enabled") as boolean,
        commentsVisible: isPermitted("viewComments", props.posting, state, {
            ifNoObject: true,
            ifNoOperation: true
        })
    })
);

export default connector(PostingButtons);
