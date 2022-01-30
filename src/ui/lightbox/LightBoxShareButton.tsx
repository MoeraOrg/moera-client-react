import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { shareDialogPrepare } from "state/sharedialog/actions";
import {
    getLightBoxMediaId,
    getLightBoxMediaPostingId,
    getLightBoxNodeName,
    getLightBoxPostingId
} from "state/lightbox/selectors";
import { getPosting } from "state/postings/selectors";
import { getComment } from "state/detailedposting/selectors";
import { getOwnerName } from "state/owner/selectors";
import { urlWithParameters, ut } from "util/url";
import './LightBoxShareButton.css';

type Props = ConnectedProps<typeof connector>;

function LightBoxShareButton({sourceNodeName, posting, comment, mediaId, mediaPosting, shareDialogPrepare}: Props) {
    const onClick = () => {
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
        <button className="lightbox-button lightbox-share" onClick={onClick}>
            <FontAwesomeIcon icon="share-alt"/>
        </button>
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
    { shareDialogPrepare }
);

export default connector(LightBoxShareButton);
