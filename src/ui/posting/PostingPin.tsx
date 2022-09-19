import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import "./PostingPin.css";

interface Props {
    pinned?: boolean | null;
}

const PostingPin = ({pinned}: Props) => {
    const {t} = useTranslation();

    if (!pinned) {
        return null;
    }

    return (
        <div className="pin-line">
            <span className="badge bg-secondary">
                <FontAwesomeIcon icon="thumbtack" size="sm"/> {t("pinned-post")}
            </span>
        </div>
    );
}

export default PostingPin;
