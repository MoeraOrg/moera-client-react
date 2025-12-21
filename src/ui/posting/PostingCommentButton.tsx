import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msComment } from "ui/material-symbols";
import { uiEventCommentQuote } from "ui/ui-events";
import Jump from "ui/navigation/Jump";
import { getWindowSelectionHtml } from "util/ui";
import { ut } from "util/url";

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
            <Jump className="posting-button" href={ut`/post/${postingId}#comment-add`} onNear={onJump}>
                <Icon icon={msComment} size="1.2em"/>
                <span className="caption">{t("comment-button")}</span>
            </Jump>
    );
}
