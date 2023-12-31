import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { shareDialogPrepare } from "state/sharedialog/actions";

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
            <FontAwesomeIcon icon={faShareAlt}/>
            <span className="caption">{t("share")}</span>
        </button>
    );
}
