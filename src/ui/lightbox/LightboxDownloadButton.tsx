import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msDownload } from "ui/material-symbols";
import './LightboxDownloadButton.css';

interface Props {
    mediaUrl: string;
    mediaMimeType: string;
}

export default function LightboxDownloadButton({mediaUrl, mediaMimeType}: Props) {
    const {t} = useTranslation();

    const onDownload = window.Android
        ? (e: React.MouseEvent) => {
            window.Android?.saveImage(mediaUrl, mediaMimeType);
            e.preventDefault();
        }
        : undefined;

    return (
        <a className="lightbox-button lightbox-download" download onClick={onDownload}
           href={mediaUrl} title={t("download")}>
            <Icon icon={msDownload} size="1.5em"/>
        </a>
    );
}
