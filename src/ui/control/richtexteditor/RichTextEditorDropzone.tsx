import React, { useMemo, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import * as immutable from 'object-path-immutable';
import { Trans, useTranslation } from 'react-i18next';

import { PostingFeatures, PrivateMediaFileInfo, VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { richTextEditorImageCopy, richTextEditorImagesUpload } from "state/richtexteditor/actions";
import { getSetting } from "state/settings/selectors";
import { Button, RichTextValue } from "ui/control";
import RichTextEditorImageList from "ui/control/richtexteditor/RichTextEditorImageList";
import RichTextCopyImageDialog, { RichTextCopyImageValues } from "ui/control/richtexteditor/RichTextCopyImageDialog";
import { Browser } from "ui/browser";
import "./RichTextEditorDropzone.css";

type UploadStatus = "loading" | "success" | "failure";

interface UploadProgress {
    status: UploadStatus;
    loaded: number;
    total: number;
}

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

function updateStatus(progress: UploadProgress[], index: number, status: UploadStatus): UploadProgress[] {
    const updated = immutable.set(progress, [index, "status"], status);
    return updated.some(p => p.status === "loading") ? updated : [];
}

type ImageLoadStartedHandler = (count: number) => void;
type ImageLoadedHandler = (index: number, image: VerifiedMediaFile) => void;
type Props = {
    value: RichTextValue;
    features: PostingFeatures | null;
    hiding?: boolean;
    nodeName: string | null;
    forceCompress?: boolean;
    selectedImage: PrivateMediaFileInfo | null;
    selectImage: (image: VerifiedMediaFile | null) => void;
    onLoadStarted?: ImageLoadStartedHandler;
    onLoaded?: ImageLoadedHandler;
    onDeleted?: (id: string) => void;
    onReorder?: (activeId: string, overId: string) => void;
} & ConnectedProps<typeof connector>;

function RichTextEditorDropzone({value, features, hiding = false, nodeName, forceCompress = false, selectedImage,
                                 selectImage, onLoadStarted, onLoaded, onDeleted, onReorder, compressImages,
                                 richTextEditorImagesUpload, richTextEditorImageCopy}: Props) {
    const [compress, setCompress] = useState<boolean>(forceCompress || compressImages);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    // Refs are needed here, because callbacks passed to richTextEditorImagesUpload() cannot be changed, while
    // onLoadStarted and onLoaded may change
    const onLoadStartedRef = useRef<ImageLoadStartedHandler>();
    onLoadStartedRef.current = onLoadStarted;
    const onLoadedRef = useRef<ImageLoadedHandler>();
    onLoadedRef.current = onLoaded;

    const {t} = useTranslation();

    const onImageUploadSuccess = (startIndex: number) => (index: number, mediaFile: VerifiedMediaFile) => {
        setUploadProgress(progress => updateStatus(progress, index, "success"));
        if (onLoadedRef.current) {
            onLoadedRef.current(startIndex + index, mediaFile);
        }
    }

    const onImageUploadFailure = (index: number) => {
        setUploadProgress(progress => updateStatus(progress, index, "failure"));
    }

    const onImageUploadProgress = (index: number, loaded: number, total: number) => {
        setUploadProgress(progress => immutable.assign(progress, [index], {loaded, total}));
    }

    const uploadImage = (files: File[]) => {
        if (files != null && files.length > 0) {
            const progress: UploadProgress[] = [];
            for (const file of files) {
                progress.push({status: "loading", loaded: 0, total: file.size});
            }
            setUploadProgress(progress);
            if (onLoadStartedRef.current) {
                onLoadStartedRef.current(files.length);
            }
            richTextEditorImagesUpload(nodeName, files, features, compress,
                onImageUploadSuccess(value.media?.length ?? 0), onImageUploadFailure, onImageUploadProgress);
        }
    };

    const [copyImageShow, setCopyImageShow] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);

    const onImageDownloadSuccess = (file: File) => {
        setDownloading(false);
        uploadImage([file]);
    }

    const onImageDownloadFailure = () => {
        setDownloading(false);
    }

    const openCopyImage = (e: React.MouseEvent) => {
        setCopyImageShow(true);
        e.preventDefault();
    }

    const submitCopyImage = (ok: boolean, {url}: RichTextCopyImageValues) => {
        setCopyImageShow(false);
        if (!ok || !url) {
            return;
        }
        setDownloading(true);
        richTextEditorImageCopy(url, onImageDownloadSuccess, onImageDownloadFailure);
    }

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({
            noClick: true,
            noKeyboard: true,
            accept: {
                "image/*": features?.imageFormats ?? []
            },
            onDrop: uploadImage
        });
    const progressSummary = useMemo(() => calcProgressSummary(uploadProgress), [uploadProgress])
    const buttonsTitle = !Browser.isTinyScreen() ? "upload-or-copy-or-drop-images" : "upload-or-copy-images";

    return (
        <div className={cx(
            "rich-text-editor-dropzone",
            {"hiding": hiding, "drag-accept": isDragAccept, "drag-reject": isDragReject}
        )} {...getRootProps()}>
            <RichTextEditorImageList value={value} nodeName={nodeName} selectedImage={selectedImage}
                                     selectImage={selectImage} onDeleted={onDeleted} onReorder={onReorder}/>
            <div className="upload">
                {uploadProgress.length > 0 ?
                    t("uploading-files", progressSummary)
                : downloading ?
                    t("downloading-image")
                :
                    <>
                        <Trans i18nKey={buttonsTitle}>
                            <Button variant="outline-info" size="sm" onClick={open}/>
                            <Button variant="outline-secondary" size="sm" onClick={openCopyImage}/>
                        </Trans>
                        {!forceCompress &&
                            <>
                                <br/>
                                <label className="form-check-label" htmlFor="editorImagesCompress">
                                    {t("compress-images")}
                                </label>
                                <input className="form-check-input" type="checkbox" checked={compress}
                                       onChange={e => setCompress(e.target.checked)} id="editorImagesCompress"/>
                            </>
                        }
                    </>
                }
            </div>
            <input {...getInputProps()}/>
            <RichTextCopyImageDialog show={copyImageShow} onSubmit={submitCopyImage}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        compressImages: getSetting(state, "posting.media.compress.default") as boolean
    }),
    { richTextEditorImagesUpload, richTextEditorImageCopy }
);

export default connector(RichTextEditorDropzone);
