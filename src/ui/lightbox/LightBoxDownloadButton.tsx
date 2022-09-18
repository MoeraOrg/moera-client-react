import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { urlWithParameters } from "util/url";

interface Props {
    mediaUrl: string;
    mediaMimeType: string;
}

function LightBoxDownloadButton({mediaUrl, mediaMimeType}: Props) {
    const {t} = useTranslation();

    const onDownload = window.Android
        ? (e: React.MouseEvent) => {
            window.Android?.saveImage(mediaUrl, mediaMimeType);
            e.preventDefault();
        }
        : undefined;

    return (
        <a className="lightbox-button lightbox-download" download onClick={onDownload}
           href={urlWithParameters(mediaUrl, {download: true})} title={t("download")}>
            <FontAwesomeIcon icon="file-download"/>
        </a>
    );
}

export default LightBoxDownloadButton;
