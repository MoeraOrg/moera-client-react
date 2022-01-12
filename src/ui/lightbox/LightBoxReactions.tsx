import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientReactionInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { postingReact, postingReactionDelete } from "state/postings/actions";
import { getHomeOwnerName } from "state/home/selectors";
import { getLightBoxMediaPostingId, getLightBoxNodeName } from "state/lightbox/selectors";
import { getPosting } from "state/postings/selectors";
import { getSetting } from "state/settings/selectors";
import { ReactionButton } from "ui/control";
import PostingReactions from "ui/posting/PostingReactions";
import "./LightBoxReactions.css";

type Props = ConnectedProps<typeof connector>;

function LightBoxReactions({posting, homeOwnerName, enableSelf, postingReact, postingReactionDelete}: Props) {
    if (posting == null) {
        return null;
    }

    const onReactionAdd = (negative: boolean, emoji: number) => postingReact(posting.id, negative, emoji);

    const onReactionDelete = () => postingReactionDelete(posting.id);

    const cr = posting.clientReaction || {} as ClientReactionInfo;
    const hide = posting.ownerName === homeOwnerName && !enableSelf && !cr.emoji;
    return (
        <div className="lightbox-reactions">
            <PostingReactions posting={posting}/>
            {!hide &&
                <ReactionButton icon="thumbs-up" className="lightbox-reaction-button positive"
                                invisible={cr.emoji != null && cr.negative} negative={false}
                                emoji={!cr.negative ? cr.emoji : null}
                                accepted={posting.acceptedReactions?.positive ?? ""}
                                onReactionAdd={onReactionAdd} onReactionDelete={onReactionDelete}/>
            }
            {!hide &&
                <ReactionButton icon="thumbs-down" className="lightbox-reaction-button negative"
                                invisible={cr.emoji != null && !cr.negative} negative={true}
                                emoji={cr.negative ? cr.emoji : null}
                                accepted={posting.acceptedReactions?.negative ?? ""}
                                onReactionAdd={onReactionAdd} onReactionDelete={onReactionDelete}/>
            }
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        posting: getPosting(state, getLightBoxMediaPostingId(state), getLightBoxNodeName(state)),
        homeOwnerName: getHomeOwnerName(state),
        enableSelf: getSetting(state, "posting.reactions.self.enabled") as boolean
    }),
    { postingReact, postingReactionDelete }
);

export default connector(LightBoxReactions);
