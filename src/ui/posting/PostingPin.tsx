import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import "./PostingPin.css";

interface Props {
    pinned?: boolean | null;
}

export default function PostingPin({pinned}: Props) {
    const {t} = useTranslation();

    if (!pinned) {
        return null;
    }

    return (
        <div className="pin-line">
            <span className="badge bg-secondary">
                <FontAwesomeIcon icon={faThumbtack} size="sm"/> {t("pinned-post")}
            </span>
        </div>
    );
}
