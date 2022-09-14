import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { ExtCommentInfo } from "state/detailedposting/state";
import { getDetailedPostingId } from "state/detailedposting/selectors";
import RepliedTo from "ui/comment/RepliedTo";
import "./CommentRepliedTo.css";

type Props = {
    comment: ExtCommentInfo;
    previousId: string | null
} & ConnectedProps<typeof connector>;

function CommentRepliedTo({comment, postingId, previousId}: Props) {
    const {t} = useTranslation();

    if (postingId == null || !comment.repliedTo) {
        return null;
    }
    if (comment.repliedTo.id === previousId) {
        return (
            <div className="replied-to-previous" title={t("reply-prev-comment")}>
                <FontAwesomeIcon icon="reply"/>
            </div>
        );
    }
    return (
        <RepliedTo postingId={postingId} commentId={comment.repliedTo.id} ownerName={comment.repliedTo.name}
                   ownerFullName={comment.repliedTo.fullName ?? null} headingHtml={comment.repliedTo.headingHtml ?? ""}
                   unset={false}/>
    );
}

const connector = connect(
    (state: ClientState) => ({
        postingId: getDetailedPostingId(state)
    })
);

export default connector(CommentRepliedTo);
