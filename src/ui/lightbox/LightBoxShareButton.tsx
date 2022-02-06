import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { lightBoxCopyLink, lightBoxCopyMediaLink } from "state/lightbox/actions";
import {
    getLightBoxMediaId,
    getLightBoxMediaPostingId,
    getLightBoxNodeName,
    getLightBoxPostingId
} from "state/lightbox/selectors";
import { getPosting } from "state/postings/selectors";
import { getComment } from "state/detailedposting/selectors";
import { getOwnerName } from "state/owner/selectors";
import { DropdownMenu } from "ui/control";
import { urlWithParameters, ut } from "util/url";
import './LightBoxShareButton.css';

type Props = {
    mediaUrl: string;
} & ConnectedProps<typeof connector>;

function LightBoxShareButton({mediaUrl, sourceNodeName, posting, comment, mediaId, mediaPosting, shareDialogPrepare,
                              lightBoxCopyLink, lightBoxCopyMediaLink}: Props) {
    const onShare = () => {
        if (sourceNodeName == null) {
            return;
        }

        let nodeName: string;
        let href: string;
        if (comment == null) {
            if (posting == null) {
                return;
            }
            nodeName = posting.receiverName ?? sourceNodeName;
            const postingId = posting.receiverPostingId ?? posting.id;
            href = urlWithParameters(ut`/post/${postingId}`, {"media": mediaId});
        } else {
            nodeName = sourceNodeName;
            href = urlWithParameters(ut`/post/${comment.postingId}`, {"comment": comment.id, "media": mediaId});
        }
        shareDialogPrepare(mediaPosting?.heading ?? "", nodeName, href);
    }

    return (
        <DropdownMenu className="lightbox-button lightbox-share" items={[
            {
                title: "Share to...",
                href: null,
                onClick: onShare,
                show: true
            },
            {
                divider: true
            },
            {
                title: "Copy link",
                href: null,
                onClick: () => lightBoxCopyLink(),
                show: true
            },
            {
                title: "Copy image link",
                href: mediaUrl,
                onClick: () => lightBoxCopyMediaLink(mediaUrl),
                show: true
            },
        ]}>
            <FontAwesomeIcon icon="share-alt"/>
        </DropdownMenu>
    );
}

const connector = connect(
    (state: ClientState) => ({
        sourceNodeName: getLightBoxNodeName(state) || getOwnerName(state),
        posting: getPosting(state, getLightBoxPostingId(state)),
        comment: state.lightBox.commentId != null ? getComment(state, state.lightBox.commentId) : null,
        mediaId: getLightBoxMediaId(state),
        mediaPosting: getPosting(state, getLightBoxMediaPostingId(state))
    }),
    { shareDialogPrepare, lightBoxCopyLink, lightBoxCopyMediaLink }
);

export default connector(LightBoxShareButton);