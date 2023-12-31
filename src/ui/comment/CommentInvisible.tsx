import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import "./CommentInvisible.css";

export default function CommentInvisible() {
    const {t} = useTranslation();

    return (
        <span className="banned" title={t("user-comments-hidden")}><FontAwesomeIcon icon={faBan}/></span>
    );
}
