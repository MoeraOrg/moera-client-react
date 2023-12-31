import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { commentReply } from "state/detailedposting/actions";

interface Props {
    id: string;
    ownerName: string;
    ownerFullName: string | null;
    heading: string;
}

export default function CommentReplyButton({id, ownerName, ownerFullName, heading}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClick = () => dispatch(commentReply(id, ownerName, ownerFullName, heading));

    return (
        <button className="comment-button" onClick={onClick}>
            <FontAwesomeIcon icon={faReply}/>
            <span className="caption">{t("reply")}</span>
        </button>
    );
}
