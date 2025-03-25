import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';

import { uiEventCommentQuote } from "ui/ui-events";
import Jump from "ui/navigation/Jump";
import { getWindowSelectionHtml } from "util/ui";

interface Props {
    postingId: string;
    invisible: boolean;
}

export default function PostingCommentButton({postingId, invisible}: Props) {
    const {t} = useTranslation();

    const onJump = (_: string, performJump: () => void) => {
        const html = getWindowSelectionHtml();
        document.dispatchEvent(uiEventCommentQuote(html ?? undefined));
        performJump();
    }

    return (
        invisible ?
            <span className="posting-button"/>
        :
            <Jump className="posting-button" href={`/post/${postingId}#comment-add`} onNear={onJump}>
                <FontAwesomeIcon icon={faComment}/>
                <span className="caption">{t("comment-button")}</span>
            </Jump>
    );
}
