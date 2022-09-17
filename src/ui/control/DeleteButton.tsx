import React, { MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import "./DeleteButton.css";

interface Props {
    onClick?: MouseEventHandler;
}

export const DeleteButton = ({onClick}: Props) => {
    const {t} = useTranslation();

    return (
        <div className="delete-button" title={t("delete")} onClick={onClick}>
        <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon="times" color="white"/>
            <FontAwesomeIcon icon="times-circle"/>
        </span>
        </div>
    );
}
