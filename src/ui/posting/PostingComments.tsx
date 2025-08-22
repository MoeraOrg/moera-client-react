import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msCommentRegular } from "ui/material-symbols";
import { useIsTinyScreen } from "ui/hook";
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
                <Icon icon={msCommentRegular} size="1.2em"/>
                <span className="caption">{commentsText}</span>
            </Jump>
        </div>
    );
}
