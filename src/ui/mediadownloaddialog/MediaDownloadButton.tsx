import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getHomeRootPage } from "state/home/selectors";
import { Button } from "ui/control";
import { Icon, msDownload } from "ui/material-symbols";
import { mediaDownloadUrl, mediaFileName } from "util/media-images";
import "./MediaDownloadButton.css";

interface Props {
    loading: boolean;
    onClose: () => void;
}

export default function MediaDownloadButton({loading, onClose}: Props) {
    const media = useSelector((state: ClientState) => state.mediaDownloadDialog.media);
    const homeRootPage = useSelector(getHomeRootPage);
    const {t} = useTranslation();

    if (media == null || media.malware) {
        if (loading) {
            return <Button variant="secondary" disabled loading={true}>{t("downloading")}</Button>;
        } else {
            return <Button variant="primary" onClick={onClose}>{t("close")}</Button>;
        }
    }

    const fileName = mediaFileName(media);
    const url = mediaDownloadUrl(homeRootPage, media);

    const onDownload = window.Android && "saveFile" in window.Android
        ? (e: React.MouseEvent) => {
            window.Android?.saveFile(url, fileName, media.mimeType);
            e.preventDefault();
        }
        : undefined;

    return (
        <a className="btn btn-primary" download={fileName} href={url} onClick={onDownload}>
            <Icon icon={msDownload} size="1.3em" className="download-icon"/>{t("download")}
        </a>
    );
}
