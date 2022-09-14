import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { shareDialogPrepare } from "state/sharedialog/actions";

type Props = {
    nodeName: string;
    postingId: string;
    commentId: string;
} & ConnectedProps<typeof connector>;

function CommentShareButton({nodeName, postingId, commentId, shareDialogPrepare}: Props) {
    const {t} = useTranslation();

    const href = `/post/${postingId}?comment=${commentId}`;
    return (
        <button className="comment-button" onClick={() => shareDialogPrepare(nodeName, href)}>
            <FontAwesomeIcon icon="share-alt"/>
            <span className="caption">{t("share")}</span>
        </button>
    );
}

const connector = connect(
    null,
    { shareDialogPrepare }
);

export default connector(CommentShareButton);
