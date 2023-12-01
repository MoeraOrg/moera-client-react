import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { getOwnerName } from "state/node/selectors";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { ut } from "util/url";

interface Props {
    postingId: string;
    postingReceiverName: string | null | undefined;
    postingReceiverPostingId: string | null | undefined;
}

export default function PostingShareButton({postingId, postingReceiverName, postingReceiverPostingId}: Props) {
    const ownerName = useSelector(getOwnerName);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const nodeName = postingReceiverName ?? ownerName ?? "";
    const id = postingReceiverPostingId ?? postingId;
    const href = ut`/post/${id}`;
    return (
        <button className="posting-button" onClick={() => dispatch(shareDialogPrepare(nodeName, href))}>
            <FontAwesomeIcon icon="share-alt"/>
            <span className="caption">{t("share")}</span>
        </button>
    );
}
