import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import cx from 'classnames';
import { Trans, useTranslation } from 'react-i18next';

import { PrivateMediaFileInfo, SourceFormat } from "api";
import { richTextEditorImageCopy } from "state/richtexteditor/actions";
import { RichTextValue } from "ui/control/richtexteditor";
import { UploadProgress, useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import RichTextEditorImageList from "ui/control/richtexteditor/media/RichTextEditorImageList";
import RichTextCopyImageDialog, {
    RichTextCopyImageValues
} from "ui/control/richtexteditor/dialog/RichTextCopyImageDialog";
import { isOverlayClosedRecently } from "ui/overlays/overlays";
import { useIsTinyScreen } from "ui/hook/media-query";
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
    srcFormat: SourceFormat;
    smileysEnabled?: boolean;
}

export default function RichTextEditorDropzone({value, hiding = false, nodeName, srcFormat, smileysEnabled}: Props) {
    const tinyScreen = useIsTinyScreen();
    const dispatch = useDispatch();
    const {
        getRootProps, isDragAccept, isDragReject, openLocalFiles, uploadImages, uploadProgress, forceCompress, compress,
        setCompress, deleteImage, reorderImage
    } = useRichTextEditorMedia();
    const {t} = useTranslation();

    const [selectedImage, setSelectedImage] = useState<PrivateMediaFileInfo | null>(null);
    const [copyImageShow, setCopyImageShow] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);

    const openCopyImage = (e: React.MouseEvent) => {
        setCopyImageShow(true);
        e.preventDefault();
    }

    const onImageDownloadSuccess = (description: RichTextValue | undefined) => (file: File) => {
        setDownloading(false);
        uploadImages([file], compress, description);
    }

    const onImageDownloadFailure = () => {
        setDownloading(false);
    }

    const submitCopyImage = (ok: boolean | null, values: Partial<RichTextCopyImageValues>) => {
        setCopyImageShow(false);
        if (!ok || !values.url) {
            return;
        }
        if (values.compress != null) {
            setCompress(values.compress);
        }
        setDownloading(true);
        dispatch(
            richTextEditorImageCopy(values.url, onImageDownloadSuccess(values.description), onImageDownloadFailure)
        );
    }

    const onSelectImages = (event: React.MouseEvent) => {
        if (!event.isDefaultPrevented() && !isOverlayClosedRecently()) {
            openLocalFiles();
        }
        event.preventDefault();
    }

    const hidden = hiding && (value.media == null || value.media.length === 0);
    const progressSummary = useMemo(() => calcProgressSummary(uploadProgress), [uploadProgress])
    const buttonsTitle = !tinyScreen ? "upload-or-copy-or-drop-images" : "upload-or-copy-images";

    return (
        <>
            <div className={cx(
                "rich-text-editor-dropzone",
                {"d-none": hidden, "drag-accept": isDragAccept, "drag-reject": isDragReject}
            )} {...getRootProps()}>
                <RichTextEditorImageList value={value} nodeName={nodeName} selectedImage={selectedImage}
                                         selectImage={setSelectedImage} onDeleted={deleteImage}
                                         onReorder={reorderImage}/>
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
                                        <button className="copy-image" onClick={openCopyImage}/>
                                        <br/>
                                    </Trans>
                                </div>
                    }
                </div>
                {copyImageShow &&
                    <RichTextCopyImageDialog forceCompress={forceCompress} compressDefault={compress}
                                             descriptionSrcFormat={srcFormat} smileysEnabled={smileysEnabled}
                                             onSubmit={submitCopyImage}/>
                }
            </div>
        </>
    );
}
