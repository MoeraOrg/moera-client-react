import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import cx from 'classnames';
import { Trans, useTranslation } from 'react-i18next';

import { PrivateMediaFileInfo, VerifiedMediaFile } from "api";
import { richTextEditorImageCopy } from "state/richtexteditor/actions";
import { RichTextValue } from "ui/control/richtexteditor";
import { UploadProgress, useRichTextEditorMedia } from "ui/control/richtexteditor/rich-text-editor-media-context";
import RichTextEditorImageList from "ui/control/richtexteditor/RichTextEditorImageList";
import RichTextCopyImageDialog, { RichTextCopyImageValues } from "ui/control/richtexteditor/RichTextCopyImageDialog";
import * as Browser from "ui/browser";
import { isOverlayClosedRecently } from "ui/overlays/overlays";
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
    selectedImage: PrivateMediaFileInfo | null;
    selectImage: (image: VerifiedMediaFile | null) => void;
    onDeleted?: (id: string) => void;
    onReorder?: (activeId: string, overId: string) => void;
}

export default function RichTextEditorDropzone({
    value, hiding = false, nodeName, selectedImage, selectImage, onDeleted, onReorder
}: Props) {
    const dispatch = useDispatch();
    const {
        getRootProps, isDragAccept, isDragReject, open, uploadImages, uploadProgress, forceCompress, compress,
        setCompress
    } = useRichTextEditorMedia();
    const {t} = useTranslation();

    const [copyImageShow, setCopyImageShow] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);

    const openCopyImage = (e: React.MouseEvent) => {
        setCopyImageShow(true);
        e.preventDefault();
    }

    const onImageDownloadSuccess = (file: File) => {
        setDownloading(false);
        uploadImages([file], undefined);
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
        dispatch(richTextEditorImageCopy(values.url, onImageDownloadSuccess, onImageDownloadFailure));
    }

    const onSelectImages = (event: React.MouseEvent) => {
        if (!event.isDefaultPrevented() && !isOverlayClosedRecently()) {
            open();
        }
        event.preventDefault();
    }

    const progressSummary = useMemo(() => calcProgressSummary(uploadProgress), [uploadProgress])
    const buttonsTitle = !Browser.isTinyScreen() ? "upload-or-copy-or-drop-images" : "upload-or-copy-images";

    return (
        <>
            <div className={cx(
                "rich-text-editor-dropzone",
                {"hiding": hiding, "drag-accept": isDragAccept, "drag-reject": isDragReject}
            )} {...getRootProps()}>
                <RichTextEditorImageList value={value} nodeName={nodeName} selectedImage={selectedImage}
                                         selectImage={selectImage} onDeleted={onDeleted} onReorder={onReorder}/>
                <div className="upload">
                    {uploadProgress.length > 0 ?
                        t("uploading-files", {...progressSummary})
                    :
                        downloading ?
                            t("downloading-image")
                        :
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
                                             onSubmit={submitCopyImage}/>
                }
            </div>
        </>
    );
}
