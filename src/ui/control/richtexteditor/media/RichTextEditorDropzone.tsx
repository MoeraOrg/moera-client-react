import React, { useMemo } from 'react';
import cx from 'classnames';
import { Trans, useTranslation } from 'react-i18next';

import { RichTextValue } from "ui/control/richtexteditor";
import { UploadProgress, useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import RichTextEditorDropzoneTabs from "ui/control/richtexteditor/media/RichTextEditorDropzoneTabs";
import RichTextEditorImageList from "ui/control/richtexteditor/media/RichTextEditorImageList";
import RichTextEditorFileList from "ui/control/richtexteditor/media/RichTextEditorFileList";
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
    compact?: boolean;
    nodeName: RelNodeName | string;
    noEmbeddedMedia?: boolean | null;
}

export default function RichTextEditorDropzone({value, compact = false, nodeName, noEmbeddedMedia}: Props) {
    const tinyScreen = useIsTinyScreen();
    const {
        getRootProps, isDragAccept, isDragReject, openLocalFiles, uploadProgress, downloading, copyImage, attachmentType
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

    const hidden =
        compact
        && (value.media == null || value.media.length === 0)
        && uploadProgress.length === 0
        && !downloading;
    const progressSummary = useMemo(() => calcProgressSummary(uploadProgress), [uploadProgress])
    const buttonsTitle = attachmentType === "image"
        ? (!tinyScreen ? "upload-or-copy-or-drop-images" : "upload-images")
        : (!tinyScreen ? "upload-or-drop-files" : "upload-files");

    return (
        <>
            {!compact && <RichTextEditorDropzoneTabs value={value}/>}
            <div className={cx(
                "rich-text-editor-dropzone",
                {"d-none": hidden, "drag-accept": isDragAccept, "drag-reject": isDragReject}
            )} {...getRootProps()}>
                {(attachmentType === "image" || compact) &&
                    <RichTextEditorImageList value={value} className={compact ? "pb-3" : undefined} nodeName={nodeName}
                                             noEmbeddedMedia={noEmbeddedMedia}/>
                }
                {(attachmentType === "file" || compact) &&
                    <RichTextEditorFileList value={value} className={compact ? "pb-3" : undefined}/>
                }
                <div className="upload">
                    {uploadProgress.length > 0 ?
                        t("uploading-files", {...progressSummary})
                    :
                        downloading ?
                            t("downloading-image")
                        :
                            !compact &&
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
