import React from 'react';
import { useSelector } from 'react-redux';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';

import { ClientReactionInfo, PostingInfo } from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import PostingReactionButton from "ui/posting/PostingReactionButton";
import EntryGalleryShareButton from "ui/entry/EntryGalleryShareButton";

interface Props {
    posting: PostingInfo;
    mediaId: string;
}

export default function EntryGalleryButtons({posting, mediaId}: Props) {
    const homeOwnerName = useSelector(getHomeOwnerName);
    const enableSelf = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.self.enabled") as boolean
    );
    const {t} = useTranslation();

    const cr = posting.clientReaction || {} as ClientReactionInfo;
    const hide = posting.ownerName === homeOwnerName && !enableSelf && !cr.emoji;
    return (
        <div className="gallery-buttons">
            <PostingReactionButton
                icon={faThumbsUp}
                caption={t("support")}
                invisible={hide || (cr.emoji != null && cr.negative)}
                id={posting.id}
                negative={false}
                emoji={!cr.negative ? cr.emoji : null}
                rejected={posting.rejectedReactions?.positive}
            />
            <PostingReactionButton
                icon={faThumbsDown}
                caption={t("oppose")}
                invisible={hide || (cr.emoji != null && !cr.negative)}
                id={posting.id}
                negative={true}
                emoji={cr.negative ? cr.emoji : null}
                rejected={posting.rejectedReactions?.negative}
            />
            <EntryGalleryShareButton postingId={posting.id} postingReceiverName={posting.receiverName}
                                     postingReceiverPostingId={posting.receiverPostingId} mediaId={mediaId}/>
        </div>
    );
}
