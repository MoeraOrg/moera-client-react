import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { PostingInfo } from "api";
import Jump from "ui/navigation/Jump";
import { Browser } from "ui/browser";
import "./PostingComments.css";

interface Props {
    posting: PostingInfo;
}

export default function PostingComments({posting}: Props) {
    const {t} = useTranslation();

    if (posting.totalComments == null || posting.totalComments <= 0) {
        return null;
    }

    const commentsText = !Browser.isTinyScreen()
        ? t("count-comments", {count: posting.totalComments})
        : `${posting.totalComments}`;
    return (
        <div className="posting-comments">
            <Jump className="total-comments" href={`/post/${posting.id}#comments`}>
                <FontAwesomeIcon icon="comment"/>{" "}&nbsp;{commentsText}
            </Jump>
        </div>
    );
}
