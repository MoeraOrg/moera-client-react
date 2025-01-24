import React from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingInline } from "ui/control";
import { Icon, msSend } from "ui/material-symbols";
import "./CommentSubmitButton.css";

interface Props {
    disabled?: boolean;
    beingPosted?: boolean;
    onClick?: (event: React.MouseEvent) => void;
}

export default function CommentSubmitButton({disabled, beingPosted, onClick}: Props) {
    const {t} = useTranslation();

    if (beingPosted) {
        return <LoadingInline/>;
    }

    return (
        <button type="button" className="btn btn-primary submit" disabled={disabled} onClick={onClick}>
            <span className="title">{t("send")}</span>
            <span><Icon icon={msSend}/></span>
        </button>
    );
}
