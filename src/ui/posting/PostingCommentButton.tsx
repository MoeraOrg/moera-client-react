import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { PostingInfo } from "api/node/api-types";
import Jump from "ui/navigation/Jump";

interface Props {
    posting: PostingInfo;
    invisible: boolean;
}

const PostingCommentButton = ({posting, invisible}: Props) => {
    const {t} = useTranslation();

    return (
        invisible ?
            <span className="posting-button"/>
        :
            <Jump className="posting-button" href={`/post/${posting.id}#comment-add`}>
                <FontAwesomeIcon icon={["far", "comment"]}/>
                <span className="caption">{t("comment")}</span>
            </Jump>
    );
}

export default PostingCommentButton;
