import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { shareDialogPrepare } from "state/sharedialog/actions";
import { Icon, msShare } from "ui/material-symbols";

interface Props {
    nodeName: string;
    postingId: string;
    commentId: string;
}

export default function CommentShareButton({nodeName, postingId, commentId}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClick = () => {
        const href = `/post/${postingId}?comment=${commentId}`;
        dispatch(shareDialogPrepare(nodeName, href));
    }

    return (
        <button className="comment-button" onClick={onClick}>
            <Icon icon={msShare} size="1.2em"/>
            <span className="caption">{t("share")}</span>
        </button>
    );
}
