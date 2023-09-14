import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { CommentInfo } from "api";
import { commentReply } from "state/detailedposting/actions";

type Props = {
    comment: CommentInfo;
} & ConnectedProps<typeof connector>;

function CommentReplyButton({comment, commentReply}: Props) {
    const {t} = useTranslation();

    const onClick = () => {
        commentReply(comment.id, comment.ownerName, comment.ownerFullName ?? null, comment.heading);
    }

    return (
        <button className="comment-button" onClick={onClick}>
            <FontAwesomeIcon icon="reply"/>
            <span className="caption">{t("reply")}</span>
        </button>
    );
}

const connector = connect(
    null,
    { commentReply }
);

export default connector(CommentReplyButton);
