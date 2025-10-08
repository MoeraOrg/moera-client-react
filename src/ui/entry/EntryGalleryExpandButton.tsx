import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msReorder, msTable } from "ui/material-symbols";

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
            <Icon icon={collapse ? msTable : msReorder} size="1.2em"/>
        </button>
    );
}
