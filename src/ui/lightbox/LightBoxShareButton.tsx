import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { lightBoxCopyLink, lightBoxCopyMediaLink } from "state/lightbox/actions";
import { getLightBoxMediaId, getLightBoxNodeName, getLightBoxPostingId } from "state/lightbox/selectors";
import { getPosting } from "state/postings/selectors";
import { getComment } from "state/detailedposting/selectors";
import { getOwnerName } from "state/node/selectors";
import { DropdownMenu } from "ui/control";
import { urlWithParameters, ut } from "util/url";
import './LightBoxShareButton.css';

type Props = {
    mediaUrl: string;
} & ConnectedProps<typeof connector>;

function LightBoxShareButton({mediaUrl, sourceNodeName, posting, comment, mediaId, shareDialogPrepare,
                              lightBoxCopyLink, lightBoxCopyMediaLink}: Props) {
    const {t} = useTranslation();

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
        shareDialogPrepare(nodeName, href);
    }

    return (
        <DropdownMenu className="lightbox-button lightbox-share" items={[
            {
                title: t("share-ellipsis"),
                href: null,
                onClick: onShare,
                show: true
            },
            {
                divider: true
            },
            {
                title: t("copy-link"),
                href: null,
                onClick: () => lightBoxCopyLink(),
                show: true
            },
            {
                title: t("copy-image-link"),
                href: mediaUrl,
                onClick: () => lightBoxCopyMediaLink(mediaUrl),
                show: true
            },
        ]}>
            <FontAwesomeIcon icon="share-alt" title={t("share")}/>
        </DropdownMenu>
    );
}

const connector = connect(
    (state: ClientState) => ({
        sourceNodeName: getLightBoxNodeName(state) || getOwnerName(state),
        posting: getPosting(state, getLightBoxPostingId(state)),
        comment: state.lightBox.commentId != null ? getComment(state, state.lightBox.commentId) : null,
        mediaId: getLightBoxMediaId(state)
    }),
    { shareDialogPrepare, lightBoxCopyLink, lightBoxCopyMediaLink }
);

export default connector(LightBoxShareButton);
