import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { shareDialogPrepare } from "state/sharedialog/actions";
import { ut } from "util/url";
import { REL_CURRENT } from "util/rel-node-name";

interface Props {
    postingId: string;
    postingReceiverName: string | null | undefined;
    postingReceiverPostingId: string | null | undefined;
}

export default function PostingShareButton({postingId, postingReceiverName, postingReceiverPostingId}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const nodeName = postingReceiverName ?? REL_CURRENT;
    const id = postingReceiverPostingId ?? postingId;
    const href = ut`/post/${id}`;
    return (
        <button className="posting-button" onClick={() => dispatch(shareDialogPrepare(nodeName, href))}>
            <FontAwesomeIcon icon={faShareAlt}/>
            <span className="caption">{t("share")}</span>
        </button>
    );
}
