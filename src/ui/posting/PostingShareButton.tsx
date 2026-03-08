import React from 'react';

import { useTranslation } from 'react-i18next';

import { shareDialogPrepare } from "state/sharedialog/actions";
import { useDispatcher } from "ui/hook";
import { Icon, msShare } from "ui/material-symbols";
import { ut } from "util/url";
import { REL_CURRENT } from "util/rel-node-name";

interface Props {
    postingId: string;
    postingReceiverName: string | null | undefined;
    postingReceiverPostingId: string | null | undefined;
}

export default function PostingShareButton({postingId, postingReceiverName, postingReceiverPostingId}: Props) {
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    const nodeName = postingReceiverName ?? REL_CURRENT;
    const id = postingReceiverPostingId ?? postingId;
    const href = ut`/post/${id}`;
    return (
        <button className="posting-button" onClick={() => dispatch(shareDialogPrepare(nodeName, href))}>
            <Icon icon={msShare} size="1.2em"/>
            <span className="caption">{t("share")}</span>
        </button>
    );
}
