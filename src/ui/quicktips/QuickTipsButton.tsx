import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { openQuickTips } from "state/quicktips/actions";

export default function QuickTipsButton() {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClick = () => dispatch(openQuickTips());

    return (
        <span className="connection-button" title={t("help")} onClick={onClick}>
            <FontAwesomeIcon icon="question-circle"/>
        </span>
    );
}
