import React, { useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import * as immutable from 'object-path-immutable';
import { Trans, useTranslation } from 'react-i18next';

import { PostingFeatures, PrivateMediaFileInfo, SourceFormat, VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { richTextEditorImageCopy, richTextEditorImagesUpload } from "state/richtexteditor/actions";
import { getSetting } from "state/settings/selectors";
import { RichTextValue } from "ui/control/richtexteditor";
import RichTextEditorImageList from "ui/control/richtexteditor/RichTextEditorImageList";
import RichTextCopyImageDialog, { RichTextCopyImageValues } from "ui/control/richtexteditor/RichTextCopyImageDialog";
import RichTextUploadImagesDialog, { RichTextUploadImagesValues } from "ui/control/richtexteditor/RichTextUploadImagesDialog";
import * as Browser from "ui/browser";
import { isOverlayClosedRecently } from "ui/overlays/overlays";
import { RelNodeName } from "util/rel-node-name";
import { isHtmlEmpty } from "util/html";
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

interface Props {
    value: RichTextValue;
    features: PostingFeatures | null;
    hiding?: boolean;
    nodeName: RelNodeName | string;
    forceCompress?: boolean;
    captionSrcFormat?: SourceFormat;
    smileysEnabled?: boolean;
    selectedImage: PrivateMediaFileInfo | null;
    selectImage: (image: VerifiedMediaFile | null) => void;
    onLoadStarted?: ImageLoadStartedHandler;
    onLoaded?: ImageLoadedHandler;
    onDeleted?: (id: string) => void;
    onReorder?: (activeId: string, overId: string) => void;
}

export default function RichTextEditorDropzone({
    value, features, hiding = false, nodeName, forceCompress = false, captionSrcFormat, smileysEnabled, selectedImage,
    selectImage, onLoadStarted, onLoaded, onDeleted, onReorder
}: Props) {
    const compressImages = useSelector((state: ClientState) =>
        getSetting(state, "posting.media.compress.default") as boolean);
    const dispatch = useDispatch();

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

    const uploadImages = (files: File[], caption: RichTextValue | undefined) => {
        if (files.length > 0) {
            const progress: UploadProgress[] = [];
            for (const file of files) {
                progress.push({status: "loading", loaded: 0, total: file.size});
            }
            setUploadProgress(progress);
            if (onLoadStartedRef.current) {
                onLoadStartedRef.current(files.length);
            }
            const captionSrcText = caption?.toString(smileysEnabled);
            const captionSrc = !isHtmlEmpty(captionSrcText) ? JSON.stringify({text: captionSrcText}) : null;
            dispatch(richTextEditorImagesUpload(
                nodeName, files, features, compress.current, onImageUploadSuccess(value.media?.length ?? 0),
                onImageUploadFailure, onImageUploadProgress, captionSrc, captionSrcFormat
            ));
        }
    };

    const [files, setFiles] = useState<File[]>([]);
    const compress = useRef<boolean>(forceCompress || compressImages);
    const [uploadImagesShow, setUploadImagesShow] = useState<boolean>(false);

    const openUploadImages = (files: File[]) => {
        setFiles(files);
        setUploadImagesShow(true);
    }

    const submitUploadImages = (ok: boolean | null, values: Partial<RichTextUploadImagesValues>) => {
        setUploadImagesShow(false);
        if (!ok || !values.files || values.files.length === 0) {
            return;
        }
        if (values.compress != null) {
            compress.current = values.compress;
        }
        uploadImages(values.files, values.caption);
    }

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
            compress.current = values.compress;
        }
        setDownloading(true);
        dispatch(richTextEditorImageCopy(values.url, onImageDownloadSuccess, onImageDownloadFailure));
    }

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({
            noClick: true,
            noKeyboard: true,
            accept: {
                "image/*": features?.imageFormats ?? []
            },
            onDrop: openUploadImages
        });

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
                <input {...getInputProps()}/>
                {copyImageShow &&
                    <RichTextCopyImageDialog forceCompress={forceCompress} compressDefault={compress.current}
                                             onSubmit={submitCopyImage}/>
                }
                {uploadImagesShow &&
                    <RichTextUploadImagesDialog forceCompress={forceCompress} files={files}
                                                compressDefault={compress.current} captionSrcFormat={captionSrcFormat}
                                                smileysEnabled={smileysEnabled} onSubmit={submitUploadImages}/>
                }
            </div>
        </>
    );
}
