import React from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { getHomeRootPage } from "state/home/selectors";
import { closeMediaDownloadDialog } from "state/mediadownloaddialog/actions";
import { Button, ModalDialog } from "ui/control";
import { useDispatcher } from "ui/hook";
import { mediaDownloadUrl, mediaFileName } from "util/media-images";
import { Icon, msDownload } from "ui/material-symbols";
import "./MediaDownloadDialog.css";

export default function MediaDownloadDialog() {
    const errorCode = useSelector((state: ClientState) => state.mediaDownloadDialog.errorCode);
    const media = useSelector((state: ClientState) => state.mediaDownloadDialog.media);
    const homeRootPage = useSelector(getHomeRootPage);
    const carte = useSelector(getCurrentViewMediaCarte);
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    const onClose = () => dispatch(closeMediaDownloadDialog());

    const loading = errorCode === "media.download-pending";
    const text = loading ? "attached-files-downloaded-home"
        : errorCode === "media.digest-incorrect" ? "file-not-recommended-to-download"
        : errorCode === "media.malware" ? "malware-detected-in-file"
        : errorCode != null ? "file-cannot-be-downloaded"
        : media?.malware ? "malware-detected-in-file"
        : "file-can-be-downloaded";

    return (
        <ModalDialog title={t("download-attachment")} className="media-download-dialog" onClose={onClose}>
            <div className="modal-body">
                <Trans i18nKey={text} components={{b: <b/>}}/>
            </div>
            <div className="modal-footer justify-content-center">
                {media == null || media.malware ?
                    <Button variant="primary" disabled loading={loading}>
                        <Icon icon={msDownload} size="1.3em" className="download-icon"/>{t("download")}
                    </Button>
                :
                    <a
                        className="btn btn-primary"
                        download={mediaFileName(media)}
                        href={mediaDownloadUrl(homeRootPage, media, carte)}
                    >
                        <Icon icon={msDownload} size="1.3em" className="download-icon"/>{t("download")}
                    </a>
                }
            </div>
        </ModalDialog>
    );
}
