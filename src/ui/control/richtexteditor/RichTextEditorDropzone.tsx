import React, { useMemo, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import * as immutable from 'object-path-immutable';

import { PrivateMediaFileInfo } from "api/node/api-types";
import { richTextEditorImagesUpload } from "state/richtexteditor/actions";
import { ACCEPTED_IMAGE_TYPES } from "ui/image-types";
import { Button, RichTextValue } from "ui/control";
import RichTextEditorImageList from "ui/control/richtexteditor/RichTextEditorImageList";
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
type ImageLoadedHandler = (index: number, image: PrivateMediaFileInfo) => void;
type Props = {
    value: RichTextValue;
    selectImage: (image: PrivateMediaFileInfo | null) => void;
    onLoadStarted?: ImageLoadStartedHandler;
    onLoaded?: ImageLoadedHandler;
    onDeleted?: (id: string) => void;
} & ConnectedProps<typeof connector>;

function RichTextEditorDropzone({value, selectImage, onLoadStarted, onLoaded, onDeleted,
                                 richTextEditorImagesUpload}: Props) {
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    // Refs are needed here, because callbacks passed to richTextEditorImagesUpload() cannot be changed, while
    // onLoadStarted and onLoaded may change
    const onLoadStartedRef = useRef<ImageLoadStartedHandler>();
    onLoadStartedRef.current = onLoadStarted;
    const onLoadedRef = useRef<ImageLoadedHandler>();
    onLoadedRef.current = onLoaded;

    const onImageUploadSuccess = (startIndex: number) => (index: number, mediaFile: PrivateMediaFileInfo) => {
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

    const onDrop = (files: File[]) => {
        if (files != null && files.length > 0) {
            const progress: UploadProgress[] = [];
            for (const file of files) {
                progress.push({status: "loading", loaded: 0, total: file.size});
            }
            setUploadProgress(progress);
            if (onLoadStartedRef.current) {
                onLoadStartedRef.current(files.length);
            }
            richTextEditorImagesUpload(files, onImageUploadSuccess(value.media?.length ?? 0), onImageUploadFailure,
                onImageUploadProgress);
        }
    };

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({noClick: true, noKeyboard: true, accept: ACCEPTED_IMAGE_TYPES, onDrop});
    const progressSummary = useMemo(() => calcProgressSummary(uploadProgress), [uploadProgress])

    return (
        <div className={cx(
            "rich-text-editor-dropzone",
            {"drag-accept": isDragAccept, "drag-reject": isDragReject}
        )} {...getRootProps()}>
            <RichTextEditorImageList value={value} selectImage={selectImage} onDeleted={onDeleted}/>
            <div className="upload">
                {uploadProgress.length > 0 ?
                    `Uploading ${progressSummary.loadedFiles} of ${progressSummary.totalFiles}
                     ${progressSummary.progress}% ...`
                :
                    <>
                        <Button variant="primary" size="sm" onClick={open}>Upload images</Button> or drop them here
                    </>
                }
            </div>
            <input {...getInputProps()}/>
        </div>
    );
}

const connector = connect(
    null,
    { richTextEditorImagesUpload }
);

export default connector(RichTextEditorDropzone);
