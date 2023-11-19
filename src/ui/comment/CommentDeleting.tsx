import React from 'react';
import { useTranslation } from 'react-i18next';

import { Loading } from "ui/control";
import "./CommentDeleting.css";

export default function CommentDeleting() {
    const {t} = useTranslation();

    return <span className="deleting">{t("deleting")} <Loading/></span>;
}
