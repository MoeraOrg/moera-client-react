import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { lightBoxCopyLink } from "state/lightbox/actions";
import {
    getLightBoxCommentId,
    getLightBoxMediaId,
    getLightBoxNodeName,
    getLightBoxPostingId
} from "state/lightbox/selectors";
import { getPosting } from "state/postings/selectors";
import { getComment } from "state/detailedposting/selectors";
import { getOwnerName } from "state/node/selectors";
import { DropdownMenu, DropdownMenuItems } from "ui/control";
import { useParent } from "ui/hook";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import { urlWithParameters, ut } from "util/url";
import './LightBoxShareButton.css';

interface Props {
    mediaNodeName: RelNodeName | string;
    mediaHref: string;
}

function LightBoxShareItems({mediaNodeName, mediaHref}: Props) {
    const sourceNodeName = useSelector((state: ClientState) => getLightBoxNodeName(state) || getOwnerName(state));
    const posting = useSelector((state: ClientState) => getPosting(state, getLightBoxPostingId(state), REL_CURRENT));
    const comment = useSelector((state: ClientState) => {
        const commentId = getLightBoxCommentId(state);
        return commentId != null ? getComment(state, commentId) : null;
    });
    const mediaId = useSelector(getLightBoxMediaId);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (sourceNodeName == null) {
        return null;
    }

    let nodeName: RelNodeName | string;
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

    const onShare = () => dispatch(shareDialogPrepare(nodeName, href));

    return (
        <DropdownMenuItems items={[
            {
                title: t("share"),
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
                onClick: () => dispatch(lightBoxCopyLink(nodeName, href)),
                show: true
            },
            {
                title: t("copy-image-link"),
                nodeName: mediaNodeName,
                href: mediaHref,
                onClick: () => dispatch(lightBoxCopyLink(mediaNodeName, mediaHref)),
                show: true
            },
        ]}/>
    );
}

export default function LightBoxShareButton({mediaNodeName, mediaHref}: Props) {
    const {t} = useTranslation();

    const {overlayId: parentOverlayId} = useParent();

    return (
        <DropdownMenu parentOverlayId={parentOverlayId} className="lightbox-button lightbox-share" content={
            <LightBoxShareItems mediaNodeName={mediaNodeName} mediaHref={mediaHref}/>
        }>
            <FontAwesomeIcon icon={faShareAlt} title={t("share")}/>
        </DropdownMenu>
    );
}
