import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientReactionInfo } from "api";
import { ClientState } from "state/state";
import { postingReact, postingReactionDelete } from "state/postings/actions";
import { getHomeOwnerName } from "state/home/selectors";
import { getLightBoxMediaPostingId, getLightBoxNodeName } from "state/lightbox/selectors";
import { getPosting } from "state/postings/selectors";
import { getSetting } from "state/settings/selectors";
import { ReactionButton } from "ui/control";
import { msThumbDown, msThumbUp } from "ui/material-symbols";
import PostingReactions from "ui/posting/PostingReactions";
import "./LightBoxReactions.css";

export default function LightBoxReactions() {
    const nodeName = useSelector(getLightBoxNodeName);
    const posting = useSelector((state: ClientState) =>
        getPosting(state, getLightBoxMediaPostingId(state), nodeName)
    );
    const homeOwnerName = useSelector(getHomeOwnerName);
    const enableSelf = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.self.enabled") as boolean
    );
    const dispatch = useDispatch();

    if (posting == null) {
        return null;
    }

    const onReactionAdd = (negative: boolean, emoji: number) =>
        dispatch(postingReact(posting.id, negative, emoji, nodeName));

    const onReactionDelete = () => dispatch(postingReactionDelete(posting.id, nodeName));

    const cr = posting.clientReaction || {} as ClientReactionInfo;
    const hide = posting.ownerName === homeOwnerName && !enableSelf && !cr.emoji;
    return (
        <div className="lightbox-reactions">
            <PostingReactions nodeName={nodeName} postingId={posting.id} reactions={posting.reactions}/>
            {!hide &&
                <ReactionButton
                    icon={msThumbUp}
                    className="lightbox-reaction-button positive"
                    invisible={cr.emoji != null && cr.negative}
                    negative={false}
                    emoji={!cr.negative ? cr.emoji : null}
                    rejected={posting.rejectedReactions?.positive}
                    onReactionAdd={onReactionAdd}
                    onReactionDelete={onReactionDelete}
                />
            }
            {!hide &&
                <ReactionButton
                    icon={msThumbDown}
                    className="lightbox-reaction-button negative"
                    invisible={cr.emoji != null && !cr.negative}
                    negative={true}
                    emoji={cr.negative ? cr.emoji : null}
                    rejected={posting.rejectedReactions?.negative}
                    onReactionAdd={onReactionAdd}
                    onReactionDelete={onReactionDelete}
                />
            }
        </div>
    );
}
