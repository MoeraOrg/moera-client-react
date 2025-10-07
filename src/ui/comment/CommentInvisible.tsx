import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msBlock } from "ui/material-symbols";
import "./CommentInvisible.css";

export default function CommentInvisible() {
    const {t} = useTranslation();

    return (
        <span className="banned" title={t("user-comments-hidden")}><Icon icon={msBlock} size="1em"/></span>
    );
}
