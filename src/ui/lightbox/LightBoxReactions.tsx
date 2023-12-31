import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';

import { ClientReactionInfo } from "api";
import { ClientState } from "state/state";
import { postingReact, postingReactionDelete } from "state/postings/actions";
import { getHomeOwnerName } from "state/home/selectors";
import { getLightBoxMediaPostingId, getLightBoxNodeName } from "state/lightbox/selectors";
import { getPosting } from "state/postings/selectors";
import { getSetting } from "state/settings/selectors";
import { ReactionButton } from "ui/control";
import PostingReactions from "ui/posting/PostingReactions";
import "./LightBoxReactions.css";

export default function LightBoxReactions() {
    const posting = useSelector((state: ClientState) =>
        getPosting(state, getLightBoxMediaPostingId(state), getLightBoxNodeName(state)));
    const homeOwnerName = useSelector(getHomeOwnerName);
    const enableSelf = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.self.enabled") as boolean);
    const dispatch = useDispatch();

    if (posting == null) {
        return null;
    }

    const onReactionAdd = (negative: boolean, emoji: number) => dispatch(postingReact(posting.id, negative, emoji, ""));

    const onReactionDelete = () => dispatch(postingReactionDelete(posting.id, ""));

    const cr = posting.clientReaction || {} as ClientReactionInfo;
    const hide = posting.ownerName === homeOwnerName && !enableSelf && !cr.emoji;
    return (
        <div className="lightbox-reactions">
            <PostingReactions postingId={posting.id} postingReceiverName={posting.receiverName}
                              reactions={posting.reactions}/>
            {!hide &&
                <ReactionButton icon={faThumbsUp} className="lightbox-reaction-button positive"
                                invisible={cr.emoji != null && cr.negative} negative={false}
                                emoji={!cr.negative ? cr.emoji : null}
                                accepted={posting.acceptedReactions?.positive ?? ""}
                                onReactionAdd={onReactionAdd} onReactionDelete={onReactionDelete}/>
            }
            {!hide &&
                <ReactionButton icon={faThumbsDown} className="lightbox-reaction-button negative"
                                invisible={cr.emoji != null && !cr.negative} negative={true}
                                emoji={cr.negative ? cr.emoji : null}
                                accepted={posting.acceptedReactions?.negative ?? ""}
                                onReactionAdd={onReactionAdd} onReactionDelete={onReactionDelete}/>
            }
        </div>
    );
}
