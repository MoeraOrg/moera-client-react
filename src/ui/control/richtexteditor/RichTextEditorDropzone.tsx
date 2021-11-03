import React, { useMemo, useRef, useState, MouseEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import * as immutable from 'object-path-immutable';

import { PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeRootPage } from "state/node/selectors";
import { richTextEditorImagesUpload } from "state/richtexteditor/actions";
import { ACCEPTED_IMAGE_TYPES } from "ui/image-types";
import { Button, DeleteButton, RichTextValue } from "ui/control";
import { mediaImagePreview, mediaImageSize } from "util/media-images";
import "./RichTextEditorDropzone.css";

const HASH_URI_PATTERN = /["' (]hash:([A-Za-z0-9+_-]+={0,2})["' )]/g;

function extractMediaHashes(text: string): Set<string> {
    const result = new Set<string>();
    const matches = text.matchAll(HASH_URI_PATTERN);
    for (const match of matches) {
        result.add(match[1]);
    }
    return result;
}

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

function RichTextEditorDropzone({value, selectImage, onLoadStarted, onLoaded, onDeleted, rootPage,
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

    const onDelete = (id: string) => () => {
        if (onDeleted) {
            onDeleted(id);
        }
    }

    const onClick = (image: PrivateMediaFileInfo) => (event: MouseEvent) => {
        selectImage(image);
        event.preventDefault();
    }

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({noClick: true, noKeyboard: true, accept: ACCEPTED_IMAGE_TYPES, onDrop});
    const embedded = extractMediaHashes(value.text);
    const progressSummary = useMemo(() => calcProgressSummary(uploadProgress), [uploadProgress])

    return (
        <div className={cx(
            "rich-text-editor-dropzone",
            {"drag-accept": isDragAccept, "drag-reject": isDragReject}
        )} {...getRootProps()}>
            {value.media != null && value.media.length > 0 &&
                <div className="uploaded-image-list">
                    {value.media
                        .filter((media): media is PrivateMediaFileInfo => media != null && !embedded.has(media.hash))
                        .map(media => {
                            const src = mediaImagePreview(rootPage + "/media/" + media.path, 150);
                            const [imageWidth, imageHeight] = mediaImageSize(150, 150, 150, media);
                            return (
                                <div className="uploaded-image" key={media.id}>
                                    <DeleteButton onClick={onDelete(media.id)}/>
                                    <img alt="" src={src} width={imageWidth} height={imageHeight}
                                         onClick={onClick(media)}/>
                                </div>
                            );
                        })
                    }
                </div>
            }
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
    (state: ClientState) => ({
        rootPage: getNodeRootPage(state)
    }),
    { richTextEditorImagesUpload }
);

export default connector(RichTextEditorDropzone);
