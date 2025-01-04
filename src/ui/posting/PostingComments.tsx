import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { useIsTinyScreen } from "ui/hook/media-query";
import Jump from "ui/navigation/Jump";
import "./PostingComments.css";

interface Props {
    postingId: string;
    totalComments: number | null | undefined;
}

export default function PostingComments({postingId, totalComments}: Props) {
    const tinyScreen = useIsTinyScreen();
    const {t} = useTranslation();

    if (totalComments == null || totalComments <= 0) {
        return null;
    }

    const commentsText = !tinyScreen ? t("count-comments", {count: totalComments}) : `${totalComments}`;
    return (
        <div className="posting-comments">
            <Jump className="total-comments" href={`/post/${postingId}#comments`}>
                <FontAwesomeIcon icon={faComment}/>{" "}&nbsp;{commentsText}
            </Jump>
        </div>
    );
}
