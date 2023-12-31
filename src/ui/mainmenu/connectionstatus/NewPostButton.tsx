import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { isAtComposePage } from "state/navigation/selectors";
import Jump from "ui/navigation/Jump";
import "./NewPostButton.css";

export default function NewPostButton() {
    const atCompose = useSelector(isAtComposePage);
    const {t} = useTranslation();

    if (atCompose) {
        return null;
    }

    return (
        <Jump nodeName=":" href="/compose" className="btn btn-success btn-sm new-post-button">
            <FontAwesomeIcon icon={faPenAlt}/>
            &nbsp;&nbsp;{t("new-post-button")}
        </Jump>
    );
}
