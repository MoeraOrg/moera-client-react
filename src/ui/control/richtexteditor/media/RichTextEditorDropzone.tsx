import React, { useMemo } from 'react';
import cx from 'classnames';
import { Trans, useTranslation } from 'react-i18next';

import { RichTextValue } from "ui/control/richtexteditor";
import { UploadProgress, useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import RichTextEditorImageList from "ui/control/richtexteditor/media/RichTextEditorImageList";
import { isOverlayClosedRecently } from "ui/overlays/overlays";
import { useIsTinyScreen } from "ui/hook";
import { RelNodeName } from "util/rel-node-name";
import "./RichTextEditorDropzone.css";

interface UploadProgressSummary {
    loadedFiles: number;
    totalFiles: number;
    progress: number;
}

function calcProgressSummary(progress: UploadProgress[]): UploadProgressSummary {
    let loadedFiles = 0;
    let loaded = 0;
    let total = 0;
    for (const p of progress) {
        switch (p.status) {
            case "loading":
                loaded += p.loaded;
                total += p.total;
                break;
            case "success":
            case "failure":
                loadedFiles++;
                loaded += p.total;
                total += p.total;
                break;
        }
    }
    return {loadedFiles, totalFiles: progress.length, progress: total !== 0 ? Math.round(loaded * 100 / total) : 0};
}

interface Props {
    value: RichTextValue;
    hiding?: boolean;
    nodeName: RelNodeName | string;
    noEmbeddedMedia?: boolean | null;
}

export default function RichTextEditorDropzone({value, hiding = false, nodeName, noEmbeddedMedia}: Props) {
    const tinyScreen = useIsTinyScreen();
    const {
        getRootProps, isDragAccept, isDragReject, openLocalFiles, uploadProgress, downloading, copyImage,
    } = useRichTextEditorMedia();
    const {t} = useTranslation();

    const onCopyImage = (e: React.MouseEvent) => {
        copyImage();
        e.preventDefault();
    }

    const onSelectImages = (event: React.MouseEvent) => {
        if (!event.isDefaultPrevented() && !isOverlayClosedRecently()) {
            openLocalFiles();
        }
        event.preventDefault();
    }

    const hidden = hiding && (value.media == null || value.media.length === 0);
    const progressSummary = useMemo(() => calcProgressSummary(uploadProgress), [uploadProgress])
    const buttonsTitle = !tinyScreen ? "upload-or-copy-or-drop-images" : "upload-images";

    return (
        <>
            <div className={cx(
                "rich-text-editor-dropzone",
                {"d-none": hidden, "drag-accept": isDragAccept, "drag-reject": isDragReject}
            )} {...getRootProps()}>
                <RichTextEditorImageList value={value} className={hiding ? "pb-3" : undefined} nodeName={nodeName}
                                         noEmbeddedMedia={noEmbeddedMedia}/>
                <div className="upload">
                    {uploadProgress.length > 0 ?
                        t("uploading-files", {...progressSummary})
                    :
                        downloading ?
                            t("downloading-image")
                        :
                            !hiding &&
                                <div className="upload-button" role="button" tabIndex={0} onClick={onSelectImages}>
                                    <Trans i18nKey={buttonsTitle}>
                                        <b/>
                                        <button className="copy-image" onClick={onCopyImage}/>
                                        <br/>
                                    </Trans>
                                </div>
                    }
                </div>
            </div>
        </>
    );
}
