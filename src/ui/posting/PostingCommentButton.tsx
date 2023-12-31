import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';

import Jump from "ui/navigation/Jump";

interface Props {
    postingId: string;
    invisible: boolean;
}

export default function PostingCommentButton({postingId, invisible}: Props) {
    const {t} = useTranslation();

    return (
        invisible ?
            <span className="posting-button"/>
        :
            <Jump className="posting-button" href={`/post/${postingId}#comment-add`}>
                <FontAwesomeIcon icon={faComment}/>
                <span className="caption">{t("comment-button")}</span>
            </Jump>
    );
}
