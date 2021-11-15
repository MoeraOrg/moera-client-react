import React, { useMemo, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import * as immutable from 'object-path-immutable';

import { PostingFeatures, PrivateMediaFileInfo } from "api/node/api-types";
import { richTextEditorImagesUpload } from "state/richtexteditor/actions";
import { Button, RichTextValue } from "ui/control";
import RichTextEditorImageList from "ui/control/richtexteditor/RichTextEditorImageList";
import "./RichTextEditorDropzone.css";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";

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
    features: PostingFeatures | null;
    selectImage: (image: PrivateMediaFileInfo | null) => void;
    onLoadStarted?: ImageLoadStartedHandler;
    onLoaded?: ImageLoadedHandler;
    onDeleted?: (id: string) => void;
    onReorder?: (activeId: string, overId: string) => void;
} & ConnectedProps<typeof connector>;

function RichTextEditorDropzone({value, features, selectImage, onLoadStarted, onLoaded, onDeleted, onReorder,
                                 compressImages, richTextEditorImagesUpload}: Props) {
    const [compress, setCompress] = useState<boolean>(compressImages);
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
            richTextEditorImagesUpload(files, features, compress, onImageUploadSuccess(value.media?.length ?? 0),
                onImageUploadFailure, onImageUploadProgress);
        }
    };

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({noClick: true, noKeyboard: true, accept: features?.imageFormats, onDrop});
    const progressSummary = useMemo(() => calcProgressSummary(uploadProgress), [uploadProgress])

    return (
        <div className={cx(
            "rich-text-editor-dropzone",
            {"drag-accept": isDragAccept, "drag-reject": isDragReject}
        )} {...getRootProps()}>
            <RichTextEditorImageList value={value} selectImage={selectImage} onDeleted={onDeleted}
                                     onReorder={onReorder}/>
            <div className="upload">
                {uploadProgress.length > 0 ?
                    `Uploading ${progressSummary.loadedFiles} of ${progressSummary.totalFiles}
                     ${progressSummary.progress}% ...`
                :
                    <>
                        <Button variant="outline-info" size="sm" onClick={open}>Upload images</Button>
                        {" "}or drop them here<br/>
                        <label className="form-check-label" htmlFor="editorImagesCompress">
                            Compress images
                        </label>
                        <input className="form-check-input" type="checkbox" checked={compress}
                               onChange={e => setCompress(e.target.checked)} id="editorImagesCompress"/>
                    </>
                }
            </div>
            <input {...getInputProps()}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        compressImages: getSetting(state, "posting.media.compress.default") as boolean
    }),
    { richTextEditorImagesUpload }
);

export default connector(RichTextEditorDropzone);
