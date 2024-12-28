import React, { ReactNode, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import * as immutable from 'object-path-immutable';

import { PostingFeatures, SourceFormat, VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { richTextEditorImagesUpload } from "state/richtexteditor/actions";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import {
    RichTextEditorMediaContext,
    UploadProgress,
    UploadStatus
} from "ui/control/richtexteditor/rich-text-editor-media-context";
import RichTextUploadImagesDialog, {
    RichTextUploadImagesValues
} from "ui/control/richtexteditor/RichTextUploadImagesDialog";
import { isHtmlEmpty } from "util/html";
import { RelNodeName } from "util/rel-node-name";
import { arrayMove } from "util/misc";

function updateStatus(progress: UploadProgress[], index: number, status: UploadStatus): UploadProgress[] {
    const updated = immutable.set(progress, [index, "status"], status);
    return updated.some(p => p.status === "loading") ? updated : [];
}

type ChangeHandler = (value: RichTextValue) => void;

interface Props {
    value: RichTextValue;
    features: PostingFeatures | null;
    nodeName: RelNodeName | string;
    forceCompress?: boolean;
    srcFormat: SourceFormat;
    smileysEnabled?: boolean;
    onChange?: ChangeHandler;
    children: ReactNode;
}

export default function RichTextEditorMedia({
    value, features, nodeName, forceCompress = false, srcFormat, smileysEnabled, onChange, children
}: Props) {
    const compressImages = useSelector((state: ClientState) =>
        getSetting(state, "posting.media.compress.default") as boolean);
    const dispatch = useDispatch();

    // Refs are needed here, because callbacks passed to richTextEditorImagesUpload() cannot be changed, while
    // value and onChange may change
    const valueRef = useRef<RichTextValue>();
    valueRef.current = value;
    const onChangeRef = useRef<ChangeHandler | undefined>();
    onChangeRef.current = onChange;

    const imageUploadStarted = (count: number) => {
        if (onChange != null && valueRef.current != null && count > 0) {
            const media = valueRef.current?.media != null ? [...valueRef.current.media] : [];
            for (let i = 0; i < count; i++) {
                media.push(null);
            }
            onChange(new RichTextValue(valueRef.current.text, srcFormat, media));
        }
    }

    const imageUploaded = (index: number, image: VerifiedMediaFile) => {
        if (onChange != null && valueRef.current?.media != null && index < valueRef.current.media.length) {
            if (valueRef.current.media.some(v => v != null && v.id === image.id)) {
                return;
            }
            const media = [...valueRef.current.media];
            media[index] = image;
            onChange(new RichTextValue(valueRef.current.text, srcFormat, media));
        }
    }

    const deleteImage = (id: string) => {
        if (onChange != null && valueRef.current?.media != null) {
            const media = valueRef.current.media.filter(v => v == null || v.id !== id);
            onChange(new RichTextValue(valueRef.current.text, srcFormat, media));
        }
    }

    const reorderImage = (moveId: string, overId: string) => {
        if (onChange != null && valueRef.current?.media != null && moveId !== overId) {
            const index = valueRef.current.media.findIndex(v => v != null && v.id === moveId);
            const overIndex = valueRef.current.media.findIndex(v => v != null && v.id === overId);
            if (index == null || overIndex == null) {
                return;
            }
            const media = arrayMove(valueRef.current.media, index, overIndex);
            onChange(new RichTextValue(valueRef.current.text, srcFormat, media));
        }
    }

    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

    const onImageUploadSuccess = (startIndex: number) => (index: number, mediaFile: VerifiedMediaFile) => {
        setUploadProgress(progress => updateStatus(progress, index, "success"));
        imageUploaded(startIndex + index, mediaFile);
    }

    const onImageUploadFailure = (index: number) => {
        setUploadProgress(progress => updateStatus(progress, index, "failure"));
    }

    const onImageUploadProgress = (index: number, loaded: number, total: number) => {
        setUploadProgress(progress => immutable.assign(progress, [index], {loaded, total}));
    }

    const uploadImages = (files: File[], caption: RichTextValue | undefined) => {
        if (files.length > 0) {
            setUploadProgress(files.map(file => ({status: "loading", loaded: 0, total: file.size})));
            imageUploadStarted(files.length);
            const captionSrcText = caption?.toString(smileysEnabled);
            const captionSrc = !isHtmlEmpty(captionSrcText) ? JSON.stringify({text: captionSrcText}) : null;
            dispatch(richTextEditorImagesUpload(
                nodeName, files, features, compress.current, onImageUploadSuccess(value.media?.length ?? 0),
                onImageUploadFailure, onImageUploadProgress, captionSrc, srcFormat
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

    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} =
        useDropzone({
            noClick: true,
            noKeyboard: true,
            accept: {
                "image/*": features?.imageFormats ?? []
            },
            onDrop: openUploadImages
        });

    return (
        <RichTextEditorMediaContext.Provider value={{
            getRootProps, isDragAccept, isDragReject, open, uploadImages, uploadProgress, forceCompress,
            compress: compress.current, setCompress: value => compress.current = value, deleteImage, reorderImage
        }}>
            {children}
            <input {...getInputProps()}/>
            {uploadImagesShow &&
                <RichTextUploadImagesDialog forceCompress={forceCompress} files={files}
                                            compressDefault={compress.current} captionSrcFormat={srcFormat}
                                            smileysEnabled={smileysEnabled} onSubmit={submitUploadImages}/>
            }
        </RichTextEditorMediaContext.Provider>
    );
};
