import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientReactionInfo, PostingInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import PostingReactionButton from "ui/posting/PostingReactionButton";
import EntryGalleryShareButton from "ui/entry/EntryGalleryShareButton";

type Props = {
    posting: PostingInfo;
    mediaId: string;
} & ConnectedProps<typeof connector>;

function EntryGalleryButtons({posting, mediaId, homeOwnerName, enableSelf}: Props) {
    const cr = posting.clientReaction || {} as ClientReactionInfo;
    const hide = posting.ownerName === homeOwnerName && !enableSelf && !cr.emoji;
    return (
        <div className="gallery-buttons">
            <PostingReactionButton icon="thumbs-up" caption="Support"
                                   invisible={hide || (cr.emoji != null && cr.negative)} id={posting.id}
                                   negative={false} emoji={!cr.negative ? cr.emoji : null}
                                   accepted={posting.acceptedReactions?.positive ?? ""}/>
            <PostingReactionButton icon="thumbs-down" caption="Oppose"
                                   invisible={hide || (cr.emoji != null && !cr.negative)} id={posting.id}
                                   negative={true} emoji={cr.negative ? cr.emoji : null}
                                   accepted={posting.acceptedReactions?.negative ?? ""}/>
            <EntryGalleryShareButton posting={posting} mediaId={mediaId}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        homeOwnerName: getHomeOwnerName(state),
        enableSelf: getSetting(state, "posting.reactions.self.enabled") as boolean
    })
);

export default connector(EntryGalleryButtons);
