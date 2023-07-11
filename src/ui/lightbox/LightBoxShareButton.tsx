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
    mediaNodeName: string,
    mediaHref: string,
    mediaUrl: string;
} & ConnectedProps<typeof connector>;

function LightBoxShareButton({
    mediaNodeName, mediaHref, mediaUrl, sourceNodeName, posting, comment, mediaId, shareDialogPrepare, lightBoxCopyLink,
    lightBoxCopyMediaLink
}: Props) {
    const {t} = useTranslation();

    if (sourceNodeName == null) {
        return null;
    }

    let nodeName: string;
    let href: string;
    if (comment == null) {
        if (posting == null) {
            return null;
        }
        const originalDeleted = posting.receiverDeletedAt != null;
        nodeName = originalDeleted ? sourceNodeName : (posting.receiverName ?? sourceNodeName);
        const postingId = originalDeleted ? posting.id : (posting.receiverPostingId ?? posting.id);
        let targetMediaId = mediaId;
        if (!originalDeleted && posting.receiverName != null) {
            const attachment = posting.media?.find(ma => ma.media?.id === mediaId);
            targetMediaId = attachment?.remoteMedia?.id ?? mediaId;
        }
        href = urlWithParameters(ut`/post/${postingId}`, {"media": targetMediaId});
    } else {
        nodeName = sourceNodeName;
        href = urlWithParameters(ut`/post/${comment.postingId}`, {"comment": comment.id, "media": mediaId});
    }

    const onShare = () => shareDialogPrepare(nodeName, href);

    return (
        <DropdownMenu className="lightbox-button lightbox-share" items={[
            {
                title: t("share-ellipsis"),
                nodeName: nodeName,
                href: href,
                onClick: onShare,
                show: true
            },
            {
                divider: true
            },
            {
                title: t("copy-link"),
                nodeName: nodeName,
                href: href,
                onClick: () => lightBoxCopyLink(nodeName, href),
                show: true
            },
            {
                title: t("copy-image-link"),
                nodeName: mediaNodeName,
                href: mediaHref,
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
