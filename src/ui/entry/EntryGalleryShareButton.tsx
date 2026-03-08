import React from 'react';

import { useTranslation } from 'react-i18next';

import { shareDialogPrepare } from "state/sharedialog/actions";
import { useDispatcher } from "ui/hook";
import { Icon, msShare } from "ui/material-symbols";
import { urlWithParameters, ut } from "util/url";
import { REL_CURRENT } from "util/rel-node-name";

interface Props {
    postingId: string;
    postingReceiverName?: string | null;
    postingReceiverPostingId?: string | null;
    mediaId: string;
}

export default function EntryGalleryShareButton({
    postingId, postingReceiverName, postingReceiverPostingId, mediaId
}: Props) {
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    const onClick = () => {
        const nodeName = postingReceiverName ?? REL_CURRENT;
        const id = postingReceiverPostingId ?? postingId;
        const href = urlWithParameters(ut`/post/${id}`, {"media": mediaId});

        dispatch(shareDialogPrepare(nodeName, href));
    }

    return (
        <button className="posting-button" onClick={onClick}>
            <Icon icon={msShare} size="1.2em"/>
            <span className="caption">{t("share")}</span>
        </button>
    );
}
