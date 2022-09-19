import React from 'react';
import { useTranslation } from 'react-i18next';

import { Loading } from "ui/control";
import "./PostingDeleting.css";

const PostingDeleting = () => {
    const {t} = useTranslation();

    return (
        <span className="deleting">{t("deleting")} <Loading/></span>
    );
}

export default PostingDeleting;
