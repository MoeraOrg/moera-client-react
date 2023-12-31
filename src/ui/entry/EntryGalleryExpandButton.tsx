import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTh } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

interface Props {
    collapse?: boolean;
    onClick: () => void;
}

export default function EntryGalleryExpandButton({collapse = false, onClick}: Props) {
    const {t} = useTranslation();

    const buttonClick = (e: React.MouseEvent) => {
        onClick();
        e.preventDefault();
    }

    return (
        <button className="gallery-expand" title={collapse ? t("view-images-grid") : t("view-images-list")}
                onClick={buttonClick}>
            <FontAwesomeIcon icon={collapse ? faTh : faBars}/>
        </button>
    );
}
