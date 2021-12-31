import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientReactionInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import { getLightBoxPostingId } from "state/lightbox/selectors";
import { getPosting } from "state/postings/selectors";
import { getSetting } from "state/settings/selectors";
import { ReactionButton } from "ui/control";
import "./LightBoxReactions.css";

type Props = ConnectedProps<typeof connector>;

function LightBoxReactions({posting, homeOwnerName, enableSelf}: Props) {
    if (posting == null) {
        return null;
    }
    const cr = posting.clientReaction || {} as ClientReactionInfo;
    const hide = posting.ownerName === homeOwnerName && !enableSelf && !cr.emoji;
    return (
        <div className="lightbox-reactions">
            {!hide &&
                <ReactionButton icon="thumbs-up" className="lightbox-reaction-button"
                                invisible={cr.emoji != null && cr.negative} negative={false}
                                emoji={!cr.negative ? cr.emoji : null}
                                accepted={posting.acceptedReactions?.positive ?? ""}
                                onReactionAdd={() => {}} onReactionDelete={() => {}}/>
            }
            {!hide &&
                <ReactionButton icon="thumbs-down" className="lightbox-reaction-button"
                                invisible={cr.emoji != null && !cr.negative} negative={true}
                                emoji={cr.negative ? cr.emoji : null}
                                accepted={posting.acceptedReactions?.negative ?? ""}
                                onReactionAdd={() => {}} onReactionDelete={() => {}}/>
            }
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        posting: getPosting(state, getLightBoxPostingId(state)),
        homeOwnerName: getHomeOwnerName(state),
        enableSelf: getSetting(state, "posting.reactions.self.enabled") as boolean
    })
);

export default connector(LightBoxReactions);
