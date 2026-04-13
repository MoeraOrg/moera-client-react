import React from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { closeMediaDownloadDialog } from "state/mediadownloaddialog/actions";
import { ModalDialog } from "ui/control";
import { useDispatcher } from "ui/hook";
import MediaDownloadButton from "ui/mediadownloaddialog/MediaDownloadButton";

export default function MediaDownloadDialog() {
    const errorCode = useSelector((state: ClientState) => state.mediaDownloadDialog.errorCode);
    const media = useSelector((state: ClientState) => state.mediaDownloadDialog.media);
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
                <MediaDownloadButton loading={loading}/>
            </div>
        </ModalDialog>
    );
}
