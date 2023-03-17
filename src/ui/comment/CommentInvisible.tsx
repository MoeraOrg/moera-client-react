import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ExtCommentInfo } from "state/detailedposting/state";
import "./CommentInvisible.css";

interface Props {
    comment: ExtCommentInfo;
}

export default function CommentInvisible({comment}: Props) {
    const {t} = useTranslation();

    if (!comment.invisible) {
        return null;
    }

    return (
        <span className="banned" title={t("user-comments-hidden")}><FontAwesomeIcon icon="ban"/></span>
    );
}
