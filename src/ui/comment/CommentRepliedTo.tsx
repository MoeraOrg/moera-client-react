import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ExtRepliedTo } from "state/detailedposting/state";
import { getDetailedPostingId } from "state/detailedposting/selectors";
import RepliedTo from "ui/comment/RepliedTo";
import "./CommentRepliedTo.css";

interface Props {
    repliedTo: ExtRepliedTo | null | undefined;
    previousId: string | null;
}

export default function CommentRepliedTo({repliedTo, previousId}: Props) {
    const {t} = useTranslation();

    const postingId = useSelector(getDetailedPostingId);

    if (postingId == null || !repliedTo) {
        return null;
    }
    if (repliedTo.id === previousId) {
        return (
            <div className="replied-to-previous" title={t("reply-prev-comment")}>
                <FontAwesomeIcon icon="reply"/>
            </div>
        );
    }
    return (
        <RepliedTo postingId={postingId} commentId={repliedTo.id} ownerName={repliedTo.name}
                   ownerFullName={repliedTo.fullName ?? null} headingHtml={repliedTo.headingHtml ?? ""} unset={false}/>
    );
}
