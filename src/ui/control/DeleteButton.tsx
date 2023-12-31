import React, { MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import "./DeleteButton.css";

interface Props {
    onClick?: MouseEventHandler;
}

export function DeleteButton({onClick}: Props) {
    const {t} = useTranslation();

    return (
        <div className="delete-button" title={t("delete")} onClick={onClick}>
            <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faTimes} color="white"/>
                <FontAwesomeIcon icon={faTimesCircle}/>
            </span>
        </div>
    );
}
